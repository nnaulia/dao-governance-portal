// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GovToken is ERC20 {
    constructor() ERC20("DAO Governance Token", "GT") {
        // Mint 100,000 tokens to deployer for testing
        _mint(msg.sender, 100000 * 10 ** 18);
    }
}
