// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./lib/SafeMath8.sol";
import "./owner/Operator.sol";
import "./interfaces/IOracle.sol";

contract LODGE is ERC20Burnable, Operator {
    using SafeMath8 for uint8;
    using SafeMath for uint256;

    // Initial distribution for the first 24h genesis pools
    uint256 public constant INITIAL_GENESIS_POOL_DISTRIBUTION = 10000 ether;
    // Initial distribution for the day 2-5 LODGE-AVAX LP -> LODGE pool
    uint256 public constant INITIAL_LODGE_POOL_DISTRIBUTION = 0 ether;
    // Distribution for airdrops wallet
    uint256 public constant INITIAL_AIRDROP_WALLET_DISTRIBUTION = 0 ether;

    // Have the rewards been distributed to the pools
    bool public rewardPoolDistributed = false;

    address public lodgeOracle;

    /**
     * @notice Constructs the LODGE ERC-20 contract.
     */
    constructor() ERC20("LODGE Token", "LODGE") {
        // Mints 1 LODGE to contract creator for initial pool setup
        _mint(msg.sender, 1 ether);
    }

    function _getLodgePrice() internal view returns (uint256 _LodgePrice) {
        try IOracle(lodgeOracle).consult(address(this), 1e18) returns (uint144 _price) {
            return uint256(_price);
        } catch {
            revert("Lodge: failed to fetch LODGE price from Oracle");
        }
    }

    function setLodgeOracle(address _lodgeOracle) public onlyOperator {
        require(_lodgeOracle != address(0), "oracle address cannot be 0 address");
        lodgeOracle = _lodgeOracle;
    }

    /**
     * @notice Operator mints LODGE to a recipient
     * @param recipient_ The address of recipient
     * @param amount_ The amount of LODGE to mint to
     * @return whether the process has been done
     */
    function mint(address recipient_, uint256 amount_) public onlyOperator returns (bool) {
        uint256 balanceBefore = balanceOf(recipient_);
        _mint(recipient_, amount_);
        uint256 balanceAfter = balanceOf(recipient_);

        return balanceAfter > balanceBefore;
    }

    function burn(uint256 amount) public override {
        super.burn(amount);
    }

    function burnFrom(address account, uint256 amount) public override onlyOperator {
        super.burnFrom(account, amount);
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(sender, _msgSender(), allowance(sender, _msgSender()).sub(amount, "ERC20: transfer amount exceeds allowance"));
        return true;
    }

    /**
     * @notice distribute to reward pool (only once)
     */
    function distributeReward(
        address _genesisPool,
        address _lodgePool,
        address _airdropWallet
    ) external onlyOperator {
        require(!rewardPoolDistributed, "only can distribute once");
        require(_genesisPool != address(0), "!_genesisPool");
        require(_lodgePool != address(0), "!_lodgePool");
        require(_airdropWallet != address(0), "!_airdropWallet");
        rewardPoolDistributed = true;
        _mint(_genesisPool, INITIAL_GENESIS_POOL_DISTRIBUTION);
        _mint(_lodgePool, INITIAL_LODGE_POOL_DISTRIBUTION);
        _mint(_airdropWallet, INITIAL_AIRDROP_WALLET_DISTRIBUTION);
    }

    function governanceRecoverUnsupported(
        IERC20 _token,
        uint256 _amount,
        address _to
    ) external onlyOperator {
        _token.transfer(_to, _amount);
    }
}
