const KEEN_LP = "0xa96C4f4960C43D2649Ac4eDc281e2172d632866f";
const KEEN_ADDRESS = "0x7254000925E19d9bEF3B156E9b0ADC24C9761E0E";
const ISKEEN_ADDRESS = "0xAC53b3dFB93CCcEaE015E7B5C1Cef4681a2D3d9e";
const BOND_ADDRESS = "0x1B5195c40adB6D1d3fdB17E6fb98b80726D1Aa9e";

// length of epoch, in seconds
const PERIOD_LENGTH = 6 * 60 * 60;

// in UTC timestamp. 2022-3-22 6:00:00 PM UTC
// NOT the same as pool start time, this is for
// boardroom & stuff
const START_TIME = 1647972000;

// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Treasury = await ethers.getContractFactory("Treasury");
  const Oracle = await ethers.getContractFactory("Oracle");
  const Boardroom = await ethers.getContractFactory("Boardroom");
  const KEEN = await ethers.getContractFactory("KEEN");

  // and first, there was Oracle
  let oracle = await Oracle.deploy(KEEN_LP, PERIOD_LENGTH, START_TIME);
  await oracle.deployed();
  console.log(`Oracle: ` + oracle.address);

  // oh and also add the oracle to the keen contract
  let keen = KEEN.attach(KEEN_ADDRESS);
  await keen.setKeenOracle(oracle.address);

  // deploy boardroom
  let boardroom = await Boardroom.deploy();
  await boardroom.deployed();

  console.log(`Boardroom: ` + boardroom.address);

  // deployitus treasuryus
  let treasury = await Treasury.deploy();
  await treasury.deployed();
  console.log(`Treasury: ` + treasury.address);

  await treasury.initialize(
    KEEN_ADDRESS,
    BOND_ADDRESS,
    ISKEEN_ADDRESS,
    oracle.address,
    boardroom.address,
    START_TIME
  );
  console.log("TREASURY INITIALIZED");

  await boardroom.initialize(KEEN_ADDRESS, ISKEEN_ADDRESS, treasury.address);
  console.log("BOARDROOM INITIALIZED");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
