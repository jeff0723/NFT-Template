//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma abicoder v2; // required to accept structs as function parameters

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "./ERC721A.sol";

/**
 @title Template NFT 
 @author Jeffrey Lin, Justa Liang
 */
contract TemplateNFT is ERC721A, Ownable, PaymentSplitter, EIP712 {
    using Address for address;

    // Stage info (packed)
    struct StageInfo {
        uint8 stageId;
        uint16 maxSupply;
        uint32 startTime;
        uint32 endTime;
        uint160 mintPrice;
    }
    StageInfo public stageInfo;

    // Maximum limit of tokens that can ever exist
    uint16 immutable MAX_SUPPLY;

    // Public mint stage
    uint8 immutable PUBLIC_MINT_STAGE;

    // The base link that leads to the image / video of the token
    string private _baseTokenURI;

    struct MinterInfo {
        uint8 nonce;
        uint248 remain;
    }
    // Stage ID check
    mapping(address => MinterInfo) private _whitelistInfo;

    // voucher for user to redeem
    struct NFTVoucher {
        address redeemer; // specify user to redeem this voucher
        uint8 stageId; // voucher issued in which stage
        uint8 nonce; // to make voucher differ from previous
        uint8 amount; // max amount to mint in stage
    }

    /// @dev Setup ERC721A, EIP712 and first stage info
    constructor(
        string memory name,
        string memory symbol,
        address[] memory payees,
        uint256[] memory shares,
        uint16 maxSupply,
        uint8 publicMintStage,
        StageInfo memory _initStageInfo,
        string memory _initBaseURI
    )
        ERC721A(name, symbol, 5) // better not exceed 5 to show up on opensea
        EIP712(name, "1")
        PaymentSplitter(payees, shares)
    {
        MAX_SUPPLY = maxSupply;
        PUBLIC_MINT_STAGE = publicMintStage;
        _baseTokenURI = _initBaseURI;
        stageInfo = _initStageInfo;
    }

    /// @notice Whitelist mint using the voucher
    function whitelistMint(
        NFTVoucher calldata voucher,
        bytes calldata signature,
        uint8 amount
    ) external payable {
        MinterInfo storage minterInfo = _whitelistInfo[_msgSender()];
        // if haven't redeemed then redeem first
        if (voucher.nonce > minterInfo.nonce) {
            // make sure that the signer is authorized to mint NFTs
            _verify(voucher, signature);
            // check stage ID
            require(stageInfo.stageId == voucher.stageId, "Stage ID not match");
            // update minter info
            minterInfo.remain = voucher.amount;
            minterInfo.nonce = voucher.nonce;
        }

        // check time
        require(block.timestamp >= stageInfo.startTime, "Sale not started");
        require(block.timestamp <= stageInfo.endTime, "Sale already ended");
        // check if enough remain
        require(amount <= minterInfo.remain, "Not enough remain");
        // check if exceed
        require(
            totalSupply() + amount <= stageInfo.maxSupply,
            "Exceed stage max supply"
        );
        // check fund
        require(msg.value >= stageInfo.mintPrice * amount, "Not enough fund");
        super._safeMint(_msgSender(), amount);
        minterInfo.remain -= amount;
    }

    /// @notice Public mint
    function publicMint(uint8 amount) external payable {
        // check public mint stage
        require(
            stageInfo.stageId == PUBLIC_MINT_STAGE,
            "Public mint not started"
        );
        // check time
        require(block.timestamp >= stageInfo.startTime, "Sale not started");
        require(block.timestamp <= stageInfo.endTime, "Sale already ended");
        // check if exceed total supply
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceed total supply");
        // check fund
        require(msg.value >= stageInfo.mintPrice * amount, "Not enough fund");
        // batch mint
        super._safeMint(_msgSender(), amount);
    }

    /// @dev Verify voucher
    function _verify(NFTVoucher calldata voucher, bytes calldata signature)
        private
        view
    {
        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    keccak256(
                        "NFTVoucher(address redeemer,uint8 stageId,uint8 nonce,uint8 amount)"
                    ),
                    _msgSender(),
                    voucher.stageId,
                    voucher.nonce,
                    voucher.amount
                )
            )
        );
        require(
            owner() == ECDSA.recover(digest, signature),
            "invalid or unauthorized"
        );
    }

    /// @dev Reserve NFT
    function reserve(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceed total supply");
        super._safeMint(to, amount);
    }

    /// @dev Go to next stage
    function nextStage(StageInfo memory _stageInfo) external onlyOwner {
        require(
            _stageInfo.stageId >= stageInfo.stageId,
            "Cannot set to previous stage"
        );
        require(_stageInfo.maxSupply <= MAX_SUPPLY, "Set exceed max supply");
        require(
            _stageInfo.stageId <= PUBLIC_MINT_STAGE,
            "Public mint should be last stage"
        );
        stageInfo = _stageInfo;
    }

    /// @dev Set new baseURI
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    /// @dev override _baseURI()
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
}
