// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/IGameContract.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract GameContract is IGameContract, ReentrancyGuard, Pausable {
    address public lastCaller;
    address private owner;
    uint64 public lastCallTime;
    uint64 public lastBlockNumber;
    uint256 public constant CALL_COST = 0.01 ether;
    uint64 public constant GAME_DURATION = 24 hours;

    event GameCalled(address caller, uint256 amount);
    event GameEnded(address winner, uint256 prize);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    constructor() payable Pausable() {
        require(msg.value == 0.1 ether, "Initial funding must be 0.1 ETH");
        lastCallTime = uint64(block.timestamp);
        owner = msg.sender;
    }

    function call() external payable override whenNotPaused {
        require(msg.value == CALL_COST, "Call cost is 0.01 ETH");
        require(block.timestamp - lastCallTime < GAME_DURATION, "Game has ended");
        require(block.number > lastBlockNumber, "Must wait for next block");

        lastCaller = msg.sender;
        lastCallTime = uint64(block.timestamp);
        lastBlockNumber = uint64(block.number);

        emit GameCalled(msg.sender, msg.value);
    }

    function claimPrize() external override nonReentrant whenNotPaused {
        require(block.timestamp - lastCallTime >= GAME_DURATION, "Game is still running");
        require(msg.sender == lastCaller, "Only last caller can claim the prize");

        uint256 prize = address(this).balance;

        lastCallTime = uint64(block.timestamp);
        lastCaller = address(0);

        emit GameEnded(msg.sender, prize);

        payable(msg.sender).transfer(prize);
    }

    function getGameStatus() external view override returns (
        address _lastCaller,
        uint256 _lastCallTime,
        uint256 _balance,
        bool _isGameRunning
    ) {
        return (
            lastCaller,
            lastCallTime,
            address(this).balance,
            !paused() && (block.timestamp - lastCallTime < GAME_DURATION)
        );
    }

    function emergencyWithdraw() external onlyOwner {
        _pause();
        payable(owner).transfer(address(this).balance);
    }
}