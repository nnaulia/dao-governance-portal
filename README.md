# DAO Governance Portal ⚖️

A decentralized voting interface powered by Ethereum smart contracts. This repository establishes a "Shareholder DAO" where holding the native Governance Token grants voting rights on proposals.

## Features
- **Governance Token:** ERC-20 standard token representing voting power.
- **Proposal Lifecycle:** Create -> Vote -> Execute.
- **Token Locking:** Basic security mechanism to prevent double-voting across accounts (tokens locked until vote ends).
- **Quorum Check:** Proposals require a minimum total vote count to pass.

## Architecture
- **Contracts:** Solidity v0.8.19
- **Frontend:** React + Ethers.js
- **Style:** Minimalist CSS grid

## Quick Start

1. **Install:**
   ```bash
   npm install
