// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

const ISKEEN_ADDRESS = "0xAC53b3dFB93CCcEaE015E7B5C1Cef4681a2D3d9e";
const MIM_ADDRESS = "0x130966628846BFd36ff31a822705796e8cb8C18D";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const ICO = await ethers.getContractFactory("iSKEENCrowdsale");
  const iSKEEN = await ethers.getContractFactory("iSKEEN");

  // Deploy ICO with iSKEEN address
  let ico = await ICO.deploy(
    1,
    "0x94500E9d54E092B32bA89156805672b9aAe6ab43",
    ISKEEN_ADDRESS,
    MIM_ADDRESS
  );
  await ico.deployed();

  let iskeen = iSKEEN.attach(ISKEEN_ADDRESS);
  await iskeen.setICO(ico.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
