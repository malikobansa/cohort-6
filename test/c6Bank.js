const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect, should } = require("chai");
const { ethers } = require("hardhat");

// util function to deploy our Counter contract
const deployERC20Util = async () => {
  const [owner, addr1, addr2, addr3] = await ethers.getSigners();
  const CrowdTokenContract = await ethers.getContractFactory("CrowdToken"); // reference to CrowdToken contract
  const CrowdToken = await CrowdTokenContract.deploy(); // deploy C6Bank contract
  return { CrowdToken, owner, addr1, addr2, addr3 }; // return an instance of the deployed C6Bank
};

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

describe ("CrowdToken Token Test Suite", () => {
    describe("CrowdToken Deployment", () => {
        it("Should successfully deploy CrowdToken", async () => {
            const {CrowdToken, owner, addr1, addr2, addr3} = await loadFixture(deployERC20Util);
            let ownerBalance = await CrowdToken.balanceOf(owner.address);
            let addr1Balance = await CrowdToken.balanceOf(addr1.address);
            let addr2Balance = await CrowdToken.balanceOf(addr2.address);
            let addr3Balance = await CrowdToken.balanceOf(addr3.address);
            expect(ownerBalance).to.eq(0);
            expect(addr1Balance).to.eq(0);
            expect(addr2Balance).to.eq(0);
            expect(addr3Balance).to.eq(0);
        });
        it("Should set the contract owner", async () => {
            const {CrowdToken, owner, addr1, addr2, addr3} = await loadFixture(deployERC20Util);
            expect(await CrowdToken.owner()).to.equal(owner.address);
        });
        it("Should set the correct name, symbol, and decimals", async () => {
            const {CrowdToken, owner, addr1, addr2, addr3} = await loadFixture(deployERC20Util);
            expect(await CrowdToken.name()).to.equal("CrowdToken");
            expect(await CrowdToken.symbol()).to.equal("CRWD");
            expect(await CrowdToken.decimals()).to.equal("18");
        });
        it("Should set the totalSupply to zero initially", async() => {
            const {CrowdToken, owner, addr1, addr2, addr3} = await loadFixture(deployERC20Util);
            expect(await CrowdToken.totalSupply()).to.equal(0);
        });
    });
    describe("Minting", async()=>{
        it("Should allow the owner to mint token", async () =>{
            const {CrowdToken, owner, addr1, addr2, addr3} = await loadFixture(deployERC20Util);
            const amount = ethers.parseEther("1.0");
            await CrowdToken.connect(owner).mint(addr1.address, amount);
            expect(await CrowdToken.totalSupply()).to.equal(amount);
            expect(await CrowdToken.balanceOf(addr1)).to.equal(amount);
        });
        it("Should revert if a non-owner tries to mint token", async() =>{
            const {CrowdToken, owner, addr1, addr2, addr3} = await loadFixture(deployERC20Util);
            const amount = ethers.parseEther("1.0");
            await expect(
                CrowdToken.connect(addr1).mint(addr1.address, amount)
            ).to.be.revertedWith("Not the contract owner");
        });
        it("Should revert if minting to the zero address", async() => {
            const {CrowdToken, owner, addr1, addr2, addr3} = await loadFixture(deployERC20Util);
            const amount = ethers.parseEther("1.0");
            console.log("Zero Address:",  ZERO_ADDRESS); 
            await expect(
                CrowdToken.connect(owner).mint( ZERO_ADDRESS, amount)
            ).to.be.revertedWith("Invalid address")
        });
        it("Should emit Mint events when minting", async() =>{
            const {CrowdToken, owner, addr1, addr2, addr3} = await loadFixture(deployERC20Util);
            const amount = ethers.parseEther("1.0");
            await expect (CrowdToken.connect(owner).mint(addr1.address, amount))
            .to.emit(CrowdToken, "Mint")
            .withArgs(addr1, amount)
        })
    })
})