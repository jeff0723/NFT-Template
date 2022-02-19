import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { assert, expect } from "chai";
import { ethers, deployments, network, getChainId } from "hardhat";
import { TemplateNFT__factory } from "../../frontend/src/typechain";
import {
  StageInfo,
  VOUCHER_TYPE,
  NFTVoucher,
  getTimestamp,
  UNREVEALED_BASE_URI,
  STAGE_1_PRICE,
  STAGE_2_PRICE,
  FINAL_BASE_URI,
} from "../constant";

const STAGE_1_START = getTimestamp(new Date()) + 86400;
const STAGE_1_END = STAGE_1_START + 86400 * 3;
const STAGE_2_START = STAGE_1_END + 300;
const STAGE_2_END = getTimestamp(new Date(2100, 0, 1));
const STAGE_2_SUPPLY = process.env.MAX_SUPPLY;

describe("Template NFT", function () {
  if (!STAGE_2_SUPPLY) return;
  it("Simple flow", async function () {
    let tx;
    let totalSupply;

    // Accounts
    const [owner, user0, user1, user2, user3] = await ethers.getSigners();
    if (!owner.provider) return;

    // Deployment
    await deployments.fixture(["TemplateNFT"]);
    const deployment = await deployments.get("TemplateNFT");
    const contract = TemplateNFT__factory.connect(deployment.address, owner);

    // domain data
    const domainData: TypedDataDomain = {
      name: process.env.NAME,
      version: "1",
      chainId: await getChainId(),
      verifyingContract: deployment.address,
    };

    /// ///////////////////
    // Stage #1
    /// ///////////////////
    await network.provider.send("evm_setNextBlockTimestamp", [STAGE_1_START]);
    await network.provider.send("evm_mine");

    // sign voucher #0
    const voucher0: NFTVoucher = {
      redeemer: user0.address,
      stageId: 1,
      nonce: 1,
      amount: 2,
    };
    const signatureForUser0 = await owner._signTypedData(
      domainData,
      VOUCHER_TYPE,
      voucher0
    );
    tx = await contract
      .connect(user0)
      .whitelistMint(voucher0, signatureForUser0, 2, {
        value: STAGE_1_PRICE.mul(2),
      });
    await tx.wait();
    assert((await contract.balanceOf(user0.address)).eq(2));
    totalSupply = await contract.totalSupply();
    assert(totalSupply.eq(2));
    assert(
      (await owner.provider.getBalance(contract.address)).eq(
        totalSupply.mul(STAGE_1_PRICE)
      )
    );

    // sign voucher #1
    const voucher1: NFTVoucher = {
      redeemer: user1.address,
      stageId: 1,
      nonce: 1,
      amount: 8,
    };
    await expect(
      contract.connect(user1).whitelistMint(voucher0, signatureForUser0, 2, {
        value: STAGE_1_PRICE.mul(2),
      })
    ).to.be.revertedWith("invalid or unauthorized");
    await expect(
      contract.connect(user1).whitelistMint(voucher1, signatureForUser0, 2, {
        value: STAGE_1_PRICE.mul(2),
      })
    ).to.be.revertedWith("invalid or unauthorized");

    const signatureForUser1 = await owner._signTypedData(
      domainData,
      VOUCHER_TYPE,
      voucher1
    );
    tx = await contract
      .connect(user1)
      .whitelistMint(voucher1, signatureForUser1, 4, {
        value: STAGE_1_PRICE.mul(4),
      });
    await tx.wait();
    assert((await contract.balanceOf(user1.address)).eq(4));
    totalSupply = await contract.totalSupply();
    assert(totalSupply.eq(6));
    assert(
      (await owner.provider.getBalance(contract.address)).eq(
        totalSupply.mul(STAGE_1_PRICE)
      )
    );

    tx = await contract
      .connect(user1)
      .whitelistMint(voucher1, "0x00", 2, { value: STAGE_1_PRICE.mul(2) });
    await tx.wait();
    assert((await contract.balanceOf(user1.address)).eq(6));
    totalSupply = await contract.totalSupply();
    assert(totalSupply.eq(8));
    assert(
      (await owner.provider.getBalance(contract.address)).eq(
        totalSupply.mul(STAGE_1_PRICE)
      )
    );

    await expect(
      contract
        .connect(user1)
        .whitelistMint(voucher1, "0x00", 4, { value: STAGE_1_PRICE.mul(4) })
    ).to.be.revertedWith("Not enough remain");

    tx = await contract
      .connect(user1)
      .whitelistMint(voucher1, "0x00", 2, { value: STAGE_1_PRICE.mul(2) });
    await tx.wait();
    assert((await contract.balanceOf(user1.address)).eq(8));
    totalSupply = await contract.totalSupply();
    assert(totalSupply.eq(10));
    assert(
      (await owner.provider.getBalance(contract.address)).eq(
        totalSupply.mul(STAGE_1_PRICE)
      )
    );

    await expect(
      contract.connect(user1).whitelistMint(voucher1, signatureForUser1, 2, {
        value: STAGE_1_PRICE.mul(2),
      })
    ).to.be.revertedWith("Not enough remain");

    await expect(
      contract.connect(user0).reserve(user0.address, 5)
    ).to.be.revertedWith("Ownable: caller is not the owner");

    tx = await contract.reserve(user2.address, 2);
    await tx.wait();
    assert((await contract.balanceOf(user2.address)).eq(2));
    totalSupply = await contract.totalSupply();
    assert(totalSupply.eq(12));
    assert(
      (await owner.provider.getBalance(contract.address)).eq(
        totalSupply.sub(2).mul(STAGE_1_PRICE)
      )
    );

    await network.provider.send("evm_setNextBlockTimestamp", [STAGE_1_END + 1]);
    await network.provider.send("evm_mine");

    await expect(
      contract
        .connect(user1)
        .whitelistMint(voucher1, "0x00", 1, { value: STAGE_1_PRICE })
    ).to.be.revertedWith("Sale already ended");

    await expect(
      contract.connect(user2).publicMint(2, { value: STAGE_2_PRICE.mul(2) })
    ).to.be.revertedWith("Public mint not started");

    tx = await contract.reserve(user3.address, 5);
    await tx.wait();
    assert((await contract.balanceOf(user3.address)).eq(5));

    const stage1Earn = STAGE_1_PRICE.mul(10);

    /// ///////////////////
    // Stage #2 (public)
    /// ///////////////////
    const supply = parseInt(STAGE_2_SUPPLY);
    const stage2Info: StageInfo = {
      stageId: 3,
      maxSupply: supply,
      startTime: STAGE_2_START,
      endTime: STAGE_2_END,
      mintPrice: STAGE_2_PRICE,
    };

    await expect(contract.nextStage(stage2Info)).to.be.revertedWith(
      "Public mint should be last stage"
    );
    stage2Info.stageId = 2;
    stage2Info.maxSupply = supply * 2;
    await expect(contract.nextStage(stage2Info)).to.be.revertedWith(
      "Set exceed max supply"
    );

    stage2Info.maxSupply = supply;
    tx = await contract.nextStage(stage2Info);
    await tx.wait();

    await expect(
      contract.connect(user0).publicMint(2, { value: STAGE_2_PRICE.mul(2) })
    ).to.be.revertedWith("Sale not started");

    await network.provider.send("evm_setNextBlockTimestamp", [STAGE_2_START]);
    await network.provider.send("evm_mine");

    tx = await contract
      .connect(user0)
      .publicMint(2, { value: STAGE_2_PRICE.mul(2) });
    await tx.wait();
    assert((await contract.balanceOf(user0.address)).eq(4));
    tx = await contract
      .connect(user1)
      .publicMint(1, { value: STAGE_2_PRICE.mul(1) });
    await tx.wait();
    assert((await contract.balanceOf(user1.address)).eq(9));

    tx = await contract.reserve(user3.address, 5);
    await tx.wait();
    assert((await contract.balanceOf(user3.address)).eq(10));

    const tokenId = await contract.tokenOfOwnerByIndex(user3.address, 2);
    assert(
      (await contract.tokenURI(tokenId)) === UNREVEALED_BASE_URI + tokenId
    );

    /// ///////////////////
    // Settlement
    /// ///////////////////

    const totalEarn = stage1Earn.add(STAGE_2_PRICE.mul(3));
    assert((await owner.provider.getBalance(contract.address)).eq(totalEarn));
    const ownerBalanceBefore = await owner.getBalance();
    await expect(
      contract.connect(user3)["release(address)"](user3.address)
    ).to.be.revertedWith("PaymentSplitter: account has no shares");
    tx = await contract["release(address)"](owner.address);
    const receipt = await tx.wait();
    if (receipt.status === 1) {
      const gasFee = receipt.gasUsed.mul(receipt.effectiveGasPrice);
      const ownerBalanceAfter = await owner.getBalance();
      assert(
        ownerBalanceBefore.add(totalEarn).sub(gasFee).eq(ownerBalanceAfter)
      );
    }

    tx = await contract.setBaseURI(FINAL_BASE_URI);
    await tx.wait();
    assert((await contract.tokenURI(tokenId)) === FINAL_BASE_URI + tokenId);
  });
});
