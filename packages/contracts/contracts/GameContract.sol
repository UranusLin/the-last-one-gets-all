// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/IGameContract.sol";

contract GameContract is IGameContract {
    address public lastCaller;
    uint256 public lastCallTime;
    uint256 public constant CALL_COST = 0.01 ether;
    uint256 public constant GAME_DURATION = 24 hours;

    event GameCalled(address caller, uint256 amount);
    event GameEnded(address winner, uint256 prize);

    constructor() payable {
        require(msg.value == 0.1 ether, "Initial funding must be 0.1 ETH");
        lastCallTime = block.timestamp;
    }

    function call() external payable override {
        require(msg.value == CALL_COST, "Call cost is 0.01 ETH");
        require(block.timestamp - lastCallTime < GAME_DURATION, "Game has ended");

        lastCaller = msg.sender;
        lastCallTime = block.timestamp;

        emit GameCalled(msg.sender, msg.value);
    }

    function claimPrize() external override {
        require(block.timestamp - lastCallTime >= GAME_DURATION, "Game is still running");
        require(msg.sender == lastCaller, "Only last caller can claim the prize");

        uint256 prize = address(this).balance;
        payable(msg.sender).transfer(prize);

        emit GameEnded(msg.sender, prize);
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
            (block.timestamp - lastCallTime < GAME_DURATION)
        );
    }
}