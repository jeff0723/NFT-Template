import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { getTimestamp, INIT_BASE_URI, StageInfo, STAGE_1_END, STAGE_1_PRICE, STAGE_1_START, STAGE_1_SUPPLY } from "../constant";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deploy } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();
  const chainId = await hre.getChainId();
  const isMainnet = chainId === "1";
  const stageId = 1;
  const maxSupply = isMainnet? STAGE_1_SUPPLY : 100;
  const startTime = isMainnet? STAGE_1_START : getTimestamp(new Date());
  const endTime = isMainnet? STAGE_1_END : startTime + 86400*3;
  const mintPrice = STAGE_1_PRICE;
  const stageInfo: StageInfo = {
    stageId,
    maxSupply,
    startTime,
    endTime,
    mintPrice,
  };
  const shdd = await deploy("TemplateNFT", {
    from: deployer,
    args: [
      "TemplateNFT", // name
      "TEMP", // symbol
      [deployer], // payees
      [1], // shares
      10000, // max supply
      2, // public mint stage
      stageInfo, // init stage info
      INIT_BASE_URI // init base URI
    ],
  });
  console.log("TemplateNFT deployed to:", shdd.address);
};
export default func;
func.tags = ["TemplateNFT"];
