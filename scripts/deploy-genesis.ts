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

// in UTC timestamp. 2022-3-23 10:00:00 PM UTC
// pool start time.
const START_TIME = 1648072800;

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
  const Genesis = await ethers.getContractFactory("KeenGenesisRewardPool");
  let genesis = await Genesis.deploy(
    KEEN_ADDRESS,
    WHITELIST_ADDRESS,
    START_TIME
  );
  await genesis.deployed();

  console.log("Genesis pool launched: " + genesis.address);
  console.log("Adding tokens...");

  let iskeenAvaxTx = await genesis.add(45, iSKEEN_AVAX_LP, false, START_TIME);
  console.log("added ISKEEN-AVAX (45%): " + iskeenAvaxTx.hash);

  let wavaxTx = await genesis.add(10, WAVAX_ADDRESS, false, START_TIME);
  console.log("added WAVAX (10%): " + wavaxTx.hash);

  let keenAvaxTx = await genesis.add(30, KEEN_AVAX_LP, false, START_TIME);
  console.log("added KEEN-AVAX (30%): " + keenAvaxTx.hash);

  let grapeTx = await genesis.add(15, GRAPE_ADDRESS, true, START_TIME);
  console.log("added GRAPE (15%): " + grapeTx.hash);

  console.log("ALL DONE! ALL ENGINES FIRE!");
  console.log("GENESIS POOLS START AT 10PM UTC, MARCH 23RD 2022");
  console.log("SIT TIGHT & ENJOY THE GENESIS");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
