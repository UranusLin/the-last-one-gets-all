// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IGameContract {
    function call() external payable;
    function claimPrize() external;
    function getGameStatus() external view returns (
        address _lastCaller,
        uint256 _lastCallTime,
        uint256 _balance,
        bool _isGameRunning
    );
    function pause() external;
    function unpause() external;
    function emergencyWithdraw() external;
}