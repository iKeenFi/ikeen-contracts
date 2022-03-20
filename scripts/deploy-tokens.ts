// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

// in UTC timestamp
const START_TIME = Math.floor(Date.now() / 1000);

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const KEEN = await ethers.getContractFactory("KEEN");
  const iSKEEN = await ethers.getContractFactory("iSKEEN");
  const iBKEEN = await ethers.getContractFactory("iBKEEN");

  // Deploy KEEN first
  //const keen = await KEEN.deploy();

  // Deploy iSKEEN then
  const iskeen = await iSKEEN.deploy(
    START_TIME,
    "0x94500E9d54E092B32bA89156805672b9aAe6ab43",
    "0x94500E9d54E092B32bA89156805672b9aAe6ab43"
  );

  // Deploy iBKEEN
  const ibkeen = await iBKEEN.deploy();

  //console.log("KEEN: " + keen.address);
  console.log("iSKEEN: " + iskeen.address);
  console.log("iBKEEN: " + ibkeen.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
