import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "TokenFactory" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("TokenFactory", {
    from: deployer,
    // Contract constructor arguments
    args: [deployer],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  await deploy("RWF_Trust", {
    from: deployer,
    // Contract constructor arguments
    args: [
      "BufficornCastle",
      "BCC",
      "500000",
      "1000000000000000000",
      "1709420650",
      "15000000000000000000",
      "10000000000000000000",
      "100000000000000000000",
      deployer,
      "15000000000000000000",
      "https://pbs.twimg.com/media/GHhtNknWMAAK4hZ?format=jpg&name=4096x4096",
    ],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  await deploy("NFTPoI", {
    from: deployer,
    // Contract constructor arguments
    args: [deployer],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const tokenShopFactory = await hre.ethers.getContract<Contract>("TokenFactory", deployer);

  const tokenFactory = await hre.ethers.getContract<Contract>("RWF_Trust", deployer);

  console.log("factory owner:", await tokenShopFactory.owner());
  console.log("token owner:", await tokenFactory.owner());

  // await tokenShopFactory.createToken(
  //   "BufficornCastle",
  //   "BCC",
  //   "500000",
  //   "1000000000000000000",
  //   1709420650,
  //   "15000000000000000000",
  //   "10000000000000000000",
  //   "20000000000000000000",
  //   "https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg",
  //   "15000000000000000000",
  // );
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags TokenFactory
deployYourContract.tags = ["TokenFactory"];
