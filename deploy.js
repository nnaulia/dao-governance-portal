const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // 1. Deploy Token
  const GovToken = await hre.ethers.getContractFactory("GovToken");
  const token = await GovToken.deploy();
  await token.deployed();
  console.log("GovToken deployed to:", token.address);

  // 2. Deploy DAO
  const SimpleDAO = await hre.ethers.getContractFactory("SimpleDAO");
  const dao = await SimpleDAO.deploy(token.address);
  await dao.deployed();
  console.log("SimpleDAO deployed to:", dao.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
