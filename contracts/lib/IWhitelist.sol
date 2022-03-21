//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import "./IWrapperToken.sol";

interface Whitelist is IERC721 {
  /* ---------------------- *\
       STATE AND OTHER THINGS
    \* ---------------------- */

  struct TokenAndFee {
    address token; // 0xeeeeee... is native
    uint256 fee;
  }

  /// @notice Purchase a whitelist spot from this
  /// @notice smart contract.
  function buyWhitelistSpot(address token) external;

  /// @notice When refund capability is enabled,
  /// @notice allow user to burn their whitelist spot and
  /// @notice get back their money.
  function gimmeARefund(uint256 nftId) external;

  /// @notice Set the total number of available spots.
  function setTotalSpots(uint256 spots) external;

  /* ---------------------- *\
        VIEW FUNCTIONS
  \* ---------------------- */

  /// @notice Get the current amount of claimed spots
  function getClaimedSpots() external view returns (uint256);

  /// Get the whitelist price for that token.
  function whitelistPrice(address token) external view returns (uint256);

  /* ---------------------- *\
        OWNER-ONLY FUNCTIONS
    \* ---------------------- */

  /// @notice Withdraw either the native token or any ERC20
  /// @notice from this contract.
  function withdraw(address token) external;

  /// @notice Set refundable state.
  function setCanRefund(bool state) external;

  /// @notice Add a user to the whitelist.
  function addWhitelist(address user) external;

}
