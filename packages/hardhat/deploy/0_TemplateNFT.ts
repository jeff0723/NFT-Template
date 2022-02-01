import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { INIT_BASE_URI, StageInfo, STAGE_1_END, STAGE_1_PRICE, STAGE_1_START, STAGE_1_SUPPLY } from "../constant";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deploy } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();
  const chainId = await hre.getChainId();
  const isMainnet = chainId === "1";
  const stageId = 1;
  const maxSupply = isMainnet? STAGE_1_SUPPLY : 150;
  const startTime = isMainnet? STAGE_1_START : 0;
  const endTime = STAGE_1_END;
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
    args: [stageInfo, INIT_BASE_URI],
  });
  console.log("TemplateNFT deployed to:", shdd.address);
};
export default func;
func.tags = ["TemplateNFT"];
