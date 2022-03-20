// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./lib/Crowdsale.sol";

contract iSKEENCrowdsale is ERC20Crowdsale {

    constructor(
        uint256 rate,    // rate in TKNbits
        address payable wallet,
        IERC20 tokenSold,
        IERC20 tokenPayment
    )
        ERC20Crowdsale(rate, wallet, tokenSold, tokenPayment)
    {}

}