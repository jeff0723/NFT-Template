import { BigNumber, utils } from "ethers";
import { TypedDataField } from "@ethersproject/abstract-signer";

function getTimestamp(date: Date) : number {
    return BigNumber.from(date.getTime()).div(1000).toNumber();
}

export type NFTVoucher = {
    redeemer: string;
    stageId: number;
    amount: number;
};

export type StageInfo = {
    stageId: number;
    maxSupply: number;
    startTime: number;
    endTime: number;
    mintPrice: BigNumber;
};

export const VOUCHER_TYPE: Record<string, TypedDataField[]> = {
    NFTVoucher: [
      { name: "redeemer", type: "address" },
      { name: "stageId", type: "uint8" },
      { name: "amount", type: "uint8" }, 
    ]
};

// Stage #1
// Type in your start time
export const STAGE_1_START = getTimestamp(new Date(2022, 1-1, 30, 22, 30));
export const STAGE_1_END = getTimestamp(new Date(2022, 2-1, 21, 1, 30));
export const STAGE_1_PRICE = utils.parseEther("0.07");
export const STAGE_1_SUPPLY = 6999;
export const INIT_BASE_URI =
    "ipfs://QmazRpZmrndNc59zCWeFV9oEXaYE8gSeMaAiQyDm14hL7y/";

// Stage #2 (public)
export const STAGE_2_START = getTimestamp(new Date(2022, 2-1, 21, 1, 30));
export const STAGE_2_END = getTimestamp(new Date(2100, 3-1, 1));
export const STAGE_2_PRICE = utils.parseEther("0.1");
export const STAGE_2_SUPPLY = 6999;

// Settle
export const FINAL_BASE_URI
    = "ipfs://QmaMby3sqZ491rww2Tef3QK7E4McVsw4EUiXD4Ygo1Xiwu/"; //TODO

type AddressMap = { [chainId: string]: string };
export const CONTRACT_ADDRESS: AddressMap = {
    '1': '0xE3FeB315Ae49491900e34763d7d5aEcc4277D843',
    '4': '0x447ef5CD74Cbdb1a2835d84AbD6e99020E420732',
    '1337': '0x5FbDB2315678afecb367f032d93F642f64180aa3',
}   