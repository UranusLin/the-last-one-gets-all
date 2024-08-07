// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/IGameContract.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";

contract GameContract is
IGameContract,
Initializable,
ReentrancyGuardUpgradeable,
PausableUpgradeable,
UUPSUpgradeable,
OwnableUpgradeable
{
    address public lastCaller;
    uint64 public lastCallTime;
    uint64 public lastBlockNumber;
    uint256 public constant CALL_COST = 0.01 ether;
    uint64 public constant GAME_DURATION = 24 hours;
    uint256 public gameBalance;

    event GameCalled(address caller, uint256 amount);
    event GameEnded(address winner, uint256 prize);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __ReentrancyGuard_init();
        __Pausable_init();
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();

        lastCallTime = uint64(block.timestamp);
        gameBalance = 0;
    }

    function initializeGameBalance() external payable onlyOwner {
        require(gameBalance == 0, "Game balance already initialized");
        gameBalance = msg.value;
    }

    receive() external payable {
        gameBalance += msg.value;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function call() external payable override whenNotPaused {
        require(msg.value == CALL_COST, "Call cost is 0.01 ETH");
        require(block.timestamp - lastCallTime < GAME_DURATION, "Game has ended");
        require(block.number > lastBlockNumber, "Must wait for next block");

        lastCaller = msg.sender;
        lastCallTime = uint64(block.timestamp);
        lastBlockNumber = uint64(block.number);
        gameBalance += msg.value;

        emit GameCalled(msg.sender, msg.value);
    }

    function claimPrize() external override nonReentrant whenNotPaused {
        require(block.timestamp - lastCallTime >= GAME_DURATION, "Game is still running");
        require(msg.sender == lastCaller, "Only last caller can claim the prize");

        uint256 prize = gameBalance;

        lastCallTime = uint64(block.timestamp);
        lastCaller = address(0);

        emit GameEnded(msg.sender, prize);

        gameBalance = 0;
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
            gameBalance,
            !paused() && (block.timestamp - lastCallTime < GAME_DURATION)
        );
    }

    function emergencyWithdraw() external onlyOwner {
        _pause();
        uint256 amount = gameBalance;
        gameBalance = 0;
        payable(owner()).transfer(amount);
    }
}