// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./Oracle.sol";

// it looks like an oracle...
// but under the hood, it actually
// passes messages to the real oracle
// and then adjusts the result of
// consult() and twap()
// by a ratio.

contract CustomPegOracle is Operator {
    uint144 public ratio;
    Oracle public oracle;

    constructor(Oracle _oracle, uint144 _ratio) {
        oracle = _oracle;

        // ratio out of 1000. for example:
        // 1000:1000 = 1x
        // 10,000:1000 = 10x
        // 1:1000 = 0.001x
        ratio = _ratio;
    }

    function setNewRatio(uint144 _ratio) external onlyOperator {
        ratio = _ratio;
    }

    function _adjustForRatio(uint144 _value) internal view returns (uint144) {
        return (_value * ratio) / 1000;
    }

    // note this will always return 0 before update has been called successfully for the first time.
    function consult(address _token, uint256 _amountIn) external view returns (uint144 amountOut) {
        return _adjustForRatio(oracle.consult(_token, _amountIn));
    }

    function twap(address _token, uint256 _amountIn) external view returns (uint144 _amountOut) {
        return _adjustForRatio(oracle.twap(_token, _amountIn));
    }

    function setUnderlyingOracle(Oracle _oracle) external onlyOperator {
        oracle = _oracle;
    }

    // fallback for everything else
    fallback() external {
        address _oracle = address(oracle);

        assembly {
            let ptr := mload(0x40)

            // (1) copy incoming call data
            calldatacopy(ptr, 0, calldatasize())

            // (2) forward call to logic contract
            let result := call(gas(), _oracle, 0, ptr, calldatasize(), 0, 0)
            let size := returndatasize()

            // (3) retrieve return data
            returndatacopy(ptr, 0, size)

            // (4) forward return data back to caller
            switch result
            case 0 { revert(ptr, size) }
            default { return(ptr, size) }
        }
    }
}