import { expect } from "chai";
import { ethers } from "hardhat";
import {BaseContract, Contract, ContractTransactionResponse} from "ethers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";

interface GameContractMethods {
    call(overrides?: { value: bigint }): Promise<ContractTransactionResponse>;
    claimPrize(): Promise<ContractTransactionResponse>;
    getGameStatus(): Promise<[string, bigint, bigint, boolean]>;
    pause(): Promise<ContractTransactionResponse>;
    unpause(): Promise<ContractTransactionResponse>;
    emergencyWithdraw(): Promise<ContractTransactionResponse>;
}

type GameContract = BaseContract & GameContractMethods & {
    connect(signer: HardhatEthersSigner): GameContract;
};
async function deployGameContractFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const GameContract = await ethers.getContractFactory("GameContract");
    const gameContract = (await GameContract.deploy({ value: ethers.parseEther("0.1") })) as unknown as GameContract;
    await gameContract.waitForDeployment();
    return { gameContract, owner, addr1, addr2 };
}

describe("GameContract", function () {
    let gameContract: GameContract;
    let owner: HardhatEthersSigner;
    let addr1: HardhatEthersSigner;
    let addr2: HardhatEthersSigner;

    beforeEach(async function () {
        ({ gameContract, owner, addr1, addr2 } = await loadFixture(deployGameContractFixture));
    });

    it("Should be initialized with 0.1 ETH", async function () {
        const balance = await ethers.provider.getBalance(await gameContract.getAddress());
        expect(balance).to.equal(ethers.parseEther("0.1"));
    });

    it("Should allow a call with 0.01 ETH", async function () {
        await expect(gameContract.connect(addr1).call({ value: ethers.parseEther("0.01") }))
            .to.emit(gameContract, "GameCalled")
            .withArgs(addr1.address, ethers.parseEther("0.01"));

        const [_lastCaller] = await gameContract.getGameStatus();
        expect(_lastCaller).to.equal(addr1.address);
    });

    it("Should not allow a call with incorrect ETH amount", async function () {
        await expect(
            gameContract.connect(addr1).call({ value: ethers.parseEther("0.02") })
        ).to.be.revertedWith("Call cost is 0.01 ETH");
    });

    it("Should not allow claiming prize before game ends", async function () {
        await gameContract.connect(addr1).call({ value: ethers.parseEther("0.01") });
        await expect(gameContract.connect(addr1).claimPrize()).to.be.revertedWith("Game is still running");
    });

    it("Should allow last caller to claim prize after game ends", async function () {
        await gameContract.connect(addr1).call({ value: ethers.parseEther("0.01") });
        await time.increase(24 * 60 * 60 + 1); // Increase time by 24 hours + 1 second

        const initialBalance = await ethers.provider.getBalance(addr1.address);
        const tx = await gameContract.connect(addr1).claimPrize();
        await tx.wait();
        const finalBalance = await ethers.provider.getBalance(addr1.address);

        expect(finalBalance - initialBalance).to.be.closeTo(
            ethers.parseEther("0.11"),
            ethers.parseEther("0.01") // Allow for gas costs
        );
    });

    it("Should not allow non-last caller to claim prize", async function () {
        await gameContract.connect(addr1).call({ value: ethers.parseEther("0.01") });
        await time.increase(24 * 60 * 60 + 1);

        await expect(gameContract.connect(addr2).claimPrize()).to.be.revertedWith("Only last caller can claim the prize");
    });

    it("Should update game status correctly", async function () {
        await gameContract.connect(addr1).call({ value: ethers.parseEther("0.01") });
        const [_lastCaller, _lastCallTime, _balance, _isGameRunning] = await gameContract.getGameStatus();

        expect(_lastCaller).to.equal(addr1.address);
        expect(_balance).to.equal(ethers.parseEther("0.11"));
        expect(_isGameRunning).to.be.true;

        const blockTimestamp = (await ethers.provider.getBlock("latest"))!.timestamp;
        expect(Number(_lastCallTime)).to.be.closeTo(blockTimestamp, 2); // Allow for small-time discrepancy
    });

    it("Should allow owner to pause the contract", async function () {
        await expect(gameContract.connect(owner).pause())
            .to.not.be.reverted;
        const [,,, _isGameRunning] = await gameContract.getGameStatus();
        expect(_isGameRunning).to.be.false;
    });

    it("Should not allow non-owner to pause the contract", async function () {
        await expect(gameContract.connect(addr1).pause())
            .to.be.revertedWith("Not the owner");
    });

    it("Should not allow calls when paused", async function () {
        await gameContract.connect(owner).pause();
        await expect(gameContract.connect(addr1).call({ value: ethers.parseEther("0.01") }))
            .to.be.reverted;
    });

    it("Should allow owner to perform emergency withdraw", async function () {
        const initialBalance = await ethers.provider.getBalance(owner.address);
        await gameContract.connect(owner).emergencyWithdraw();
        const finalBalance = await ethers.provider.getBalance(owner.address);
        expect(finalBalance - initialBalance).to.be.closeTo(
            ethers.parseEther("0.1"),
            ethers.parseEther("0.01") // Allow for gas costs
        );
    });
});