import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("Goblin", function () {
  it("Test contract", async function () {
    const ContractFactory = await ethers.getContractFactory("Goblin");

    const instance = await upgrades.deployProxy(ContractFactory);
    await instance.deployed();

    expect(await instance.name()).to.equal("Goblin");
  });
});
