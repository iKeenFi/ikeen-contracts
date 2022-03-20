import { expect } from "chai";
import { ethers } from "hardhat";

describe("ICO", function () {
  it("Should return 0.1 iSKEEN per 1 USDC", async function () {
    let [operator, addr2] = await ethers.getSigners();

    const ICO = await ethers.getContractFactory("ICOv2");
    const ExampleToken = await ethers.getContractFactory("ExampleToken");

    const exampletoken = await ExampleToken.deploy();
    await exampletoken.deployed();

    const paymenttoken = await ExampleToken.deploy();
    await paymenttoken.deployed();

    const ico = await ICO.deploy(
      exampletoken.address,
      paymenttoken.address,
      10000000
    );
    await ico.deployed();

    // mint me some and mint it some
    await paymenttoken.mint(operator.address, ethers.BigNumber.from("1000000"));
    // just give it everything it needs and way more
    await exampletoken.mint(
      ico.address,
      ethers.BigNumber.from("10000000000000000000000000000000")
    );

    // approval
    let approvetx = await paymenttoken.approve(
      ico.address,
      ethers.BigNumber.from(
        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      )
    );
    await approvetx.wait();

    // swap time, bring in 1 "USDC" and hopefully get 0.1 "iSKEEN"
    let buytx = await ico.buy("1000000");
    await buytx.wait();

    expect(await paymenttoken.balanceOf(operator.address)).to.equal("0");
    console.log("got here");
    expect(await exampletoken.balanceOf(operator.address)).to.equal(
      "100000000000000000"
    );
  });
});
