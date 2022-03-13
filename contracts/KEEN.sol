// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./lib/SafeMath8.sol";
import "./owner/Operator.sol";
import "./interfaces/IOracle.sol";

contract KEEN is ERC20Burnable, Operator {
    using SafeMath8 for uint8;
    using SafeMath for uint256;

    // Initial distribution for the first 24h genesis pools
    uint256 public constant INITIAL_GENESIS_POOL_DISTRIBUTION = 2400 ether;
    // Initial distribution for the day 2-5 KEEN-WETH LP -> KEEN pool
    uint256 public constant INITIAL_KEEN_POOL_DISTRIBUTION = 21600 ether;
    // Distribution for airdrops wallet
    uint256 public constant INITIAL_AIRDROP_WALLET_DISTRIBUTION = 0 ether;

    // Have the rewards been distributed to the pools
    bool public rewardPoolDistributed = false;

    address public keenOracle;

    /**
     * @notice Constructs the KEEN ERC-20 contract.
     */
    constructor() public ERC20("KEEN Token", "KEEN") {
        // Mints 1 KEEN to contract creator for initial pool setup
        _mint(msg.sender, 1 ether);
    }

    function _getKeenPrice() internal view returns (uint256 _keenPrice) {
        try IOracle(keenOracle).consult(address(this), 1e18) returns (uint144 _price) {
            return uint256(_price);
        } catch {
            revert("Keen: failed to fetch KEEN price from Oracle");
        }
    }

    function setKeenOracle(address _keenOracle) public onlyOperator {
        require(_keenOracle != address(0), "oracle address cannot be 0 address");
        keenOracle = _keenOracle;
    }

    /**
     * @notice Operator mints KEEN to a recipient
     * @param recipient_ The address of recipient
     * @param amount_ The amount of KEEN to mint to
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
        address _keenPool,
        address _airdropWallet
    ) external onlyOperator {
        require(!rewardPoolDistributed, "only can distribute once");
        require(_genesisPool != address(0), "!_genesisPool");
        require(_keenPool != address(0), "!_keenPool");
        require(_airdropWallet != address(0), "!_airdropWallet");
        rewardPoolDistributed = true;
        _mint(_genesisPool, INITIAL_GENESIS_POOL_DISTRIBUTION);
        _mint(_keenPool, INITIAL_KEEN_POOL_DISTRIBUTION);
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
