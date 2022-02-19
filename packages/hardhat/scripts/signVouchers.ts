import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { ethers, getNamedAccounts, getChainId } from "hardhat";
import { writeFile, readFile } from "fs/promises";
import { existsSync } from "fs";
import { NFTVoucher, VOUCHER_TYPE, CONTRACT_ADDRESS } from "../constant";

//change if change stage
const stageId = 1;
//change if re-sign in the same stage
const nonce = 1;

async function main() {
    const { deployer } = await getNamedAccounts();
    console.log("Singer address:",deployer)
    const signer = await ethers.getSigner(deployer);
    // domain data
    const chainId = await getChainId();
    const contractAddr = CONTRACT_ADDRESS[chainId];
    if (!contractAddr) {
        console.log("[ERROR] contract address not set");
        return;
    }
    const domainData: TypedDataDomain = {
        name: process.env.NAME,
        version: "1",
        chainId: chainId,
        verifyingContract: contractAddr,
    }
    const whitelist = (await readFile('./whitelist/whitelist.txt')).toString().split('\n');
    let sigMap = new Map<string, {voucher: NFTVoucher, signature: string}>();
    await Promise.all(whitelist.map(async (list) => {
        const struct = list.split(' ');
        const redeemer = struct[0];
        const amount = parseInt(struct[1]);
        const voucher: NFTVoucher = { redeemer, stageId, nonce, amount };
        const signature: string = await signer._signTypedData(domainData, VOUCHER_TYPE, voucher);
        sigMap.set(redeemer, {voucher, signature});
        return signature;
    }));
    console.log("voucher count:", sigMap.size);
    if (existsSync("../frontend/src/whitelist/whitelist.json")) {
        await writeFile("../frontend/src/whitelist/whitelist.json", JSON.stringify(Object.fromEntries(sigMap), null, 4));
    } else {
        await writeFile("./whitelist/whitelist.json", JSON.stringify(Object.fromEntries(sigMap), null, 4));
    }


}
  
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});