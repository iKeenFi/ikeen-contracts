const KEEN_ADDRESS = "0x7254000925E19d9bEF3B156E9b0ADC24C9761E0E";
const ISKEEN_ADDRESS = "0xAC53b3dFB93CCcEaE015E7B5C1Cef4681a2D3d9e";
const BOND_ADDRESS = "0x1B5195c40adB6D1d3fdB17E6fb98b80726D1Aa9e";
const BOARDROOM_ADDRESS = "0x74FDfe319eedF8b44e97E5d9FE2f5fea97d16de2";
const TREASURY_ADDRESS = "0xDF2127A8099AF98f401eF7cb8d5eae68d7F2716c";

// length of epoch, in seconds
const PERIOD_LENGTH = 6 * 60 * 60;

// in UTC timestamp. 2022-3-24 10:00:00 PM UTC
// pool start time.
const START_TIME = 1648159200;

// a while
// next year
const END_TIME = 1679695200;

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

  // We get the contracts
  const iBKEEN = await ethers.getContractFactory("iBKEEN");
  const KEEN = await ethers.getContractFactory("KEEN");
  const Boardroom = await ethers.getContractFactory("Boardroom");
  const iSKEEN = await ethers.getContractFactory("iSKEEN");
  const Treasury = await ethers.getContractFactory("Treasury");

  // Connect the contracts
  const keen = KEEN.attach(KEEN_ADDRESS);
  const boardroom = Boardroom.attach(BOARDROOM_ADDRESS);
  const iskeen = iSKEEN.attach(ISKEEN_ADDRESS);
  const ibkeen = iBKEEN.attach(BOND_ADDRESS);
  const treasury = Treasury.attach(TREASURY_ADDRESS);

  /*// Grant operator of KEEN, iSKEEN, iBKEEN & Boardroom to the treasury
  // This is IRREVERSIBLE!
  let keenTx = await keen.transferOperator(treasury.address);
  console.log(
    "KEEN has been renounced: https://snowtrace.io/tx/" + keenTx.hash
  );

  let iskeenTx = await iskeen.transferOperator(treasury.address);
  console.log(
    "iSKEEN has been renounced: https://snowtrace.io/tx/" + iskeenTx.hash
  );

  let ibkeenTx = await ibkeen.transferOperator(treasury.address);
  console.log(
    "iBKEEN has been renounced: https://snowtrace.io/tx/" + ibkeenTx.hash
  );

  // The boardroom is a special pickle,
  // it has setOperator() instead of
  // transfer.
  let boardroomTx = await boardroom.setOperator(treasury.address);
  console.log(
    "Boardroom has been renounced: https://snowtrace.io/tx/" + boardroomTx.hash
  );*/

  // We still have operator control over Treasury,
  // so let's use that and ACTIVATE THE BOARDROOM!
  let allocateTx = await treasury.allocateSeigniorage();
  console.log(
    "Boardroom has been allocated seigniorage: https://snowtrace.io/tx/" +
      allocateTx.hash
  );
  console.log("Don't stop the rocket!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
