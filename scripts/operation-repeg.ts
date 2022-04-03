// extreme hack, but i'm all for it
// SHOULD NOT be needed for other projects,
// but this is for iKeen.

// deploys a new Oracle contract that allows for
// adjusting values by a ratio.
// afterwards, it sets treasury to use this new oracle.

import { ethers } from "hardhat";

const TREASURY_ADDRESS = "0xDF2127A8099AF98f401eF7cb8d5eae68d7F2716c";
const ORACLE_ADDRESS = "0x2734d6557c2dd7c65448334b1ff98525609917b0";
const RATIO = 10000; // 10,000:1000 = 10 KEEN:1 AVAX

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Treasury = await ethers.getContractFactory("Treasury");
  const CROracle = await ethers.getContractFactory("CustomPegOracle");

  // NOTE: Technically the KEEN.sol contract
  // calls the oracle in one function,
  // but that function is never used.
  // We don't need to change the oracle on
  // KEEN.sol.

  const treasury = Treasury.attach(TREASURY_ADDRESS);
  const oracle = await CROracle.deploy(ORACLE_ADDRESS, RATIO);

  await oracle.deployed();
  console.log("oracle deployed at " + oracle.address);
  let setTx = await treasury.setKeenOracle(oracle.address);
  console.log("set keen oracle: https://snowtrace.io/tx/" + setTx.hash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
