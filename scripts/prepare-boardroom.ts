const KEEN_AVAX_LP = "0xa96C4f4960C43D2649Ac4eDc281e2172d632866f";
const KEEN_ADDRESS = "0x7254000925E19d9bEF3B156E9b0ADC24C9761E0E";
const ISKEEN_ADDRESS = "0xAC53b3dFB93CCcEaE015E7B5C1Cef4681a2D3d9e";
const iSKEEN_AVAX_LP = "0x01870c499db548c4de0da05180365d32603262a2";
const WAVAX_ADDRESS = "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7";
const MIM_ADDRESS = "0x130966628846bfd36ff31a822705796e8cb8c18d";
const GRAPE_ADDRESS = "0x5541d83efad1f281571b343977648b75d95cdac2";
const WHITELIST_ADDRESS = "0x463791E15CcAe33de02C2B247aa75E8d4c2d9980";

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

  // We get the contract to deploy
  const ISKEENRewardPool = await ethers.getContractFactory("iSKEENRewardPool");
  const iSKEEN = await ethers.getContractFactory("iSKEEN");

  // impersonation
  /*await ethers.provider.send("hardhat_impersonateAccount", [
    "0x3e86ab8925af073e1f1b3780d9cb77550ee19a6e",
  ]);
  let signer = await ethers.getSigner(
    "0x3e86ab8925af073e1f1b3780d9cb77550ee19a6e"
  );*/

  let pool = await ISKEENRewardPool.deploy(ISKEEN_ADDRESS, START_TIME);
  await pool.deployed();

  console.log("iSKEEN reward pool launched: " + pool.address);
  console.log("Adding tokens...");

  let iskeenAvaxTx = await pool.add(30, iSKEEN_AVAX_LP, false, START_TIME);
  console.log("added iSKEEN-AVAX: " + iskeenAvaxTx.hash);

  let wavaxTx = await pool.add(40, KEEN_AVAX_LP, false, START_TIME);
  console.log("added KEEN-AVAX: " + wavaxTx.hash);

  let usdcTx = await pool.add(30, KEEN_ADDRESS, true, START_TIME);
  console.log("added KEEN: " + usdcTx.hash);

  // beg for monies from the iSKEEN contract
  let iskeen = iSKEEN.attach(ISKEEN_ADDRESS);

  let rewardTx = await iskeen.distributeReward(pool.address);
  console.log("REWARDS HAVE BEEN ENGIVENED: " + rewardTx.hash);

  console.log("ALL DONE! ALL ENGINES FIRE!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
