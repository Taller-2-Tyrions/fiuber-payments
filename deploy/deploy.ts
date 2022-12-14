import { HardhatRuntimeEnvironment } from "hardhat/types";

import { DeployFunction } from "hardhat-deploy/types";

const deployFunc: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;
  console.log(deployer);
  const deployResult = await deploy("BasicPayments", {
    from: deployer,
    gasLimit: 900000,
    args: [],
  });
  console.log(`BasicPayments deployed at ${deployResult.address}`);
  return hre.network.live; // prevents re execution on live networks
};
export default deployFunc;

deployFunc.id = "deploy_BasicPayments"; // id required to prevent reexecution
