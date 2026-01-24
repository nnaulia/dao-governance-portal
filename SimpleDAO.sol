// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SimpleDAO is ReentrancyGuard {
    struct Proposal {
        uint256 id;
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 deadline;
        bool executed;
        address proposer;
    }

    IERC20 public govToken;
    uint256 public nextProposalId;
    uint256 public constant VOTE_DURATION = 5 minutes; 

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ProposalCreated(uint256 id, string description, uint256 deadline);
    event Voted(uint256 proposalId, address voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 id, bool passed);

    constructor(address _govToken) {
        govToken = IERC20(_govToken);
    }

    function createProposal(string memory _description) external {
        proposals[nextProposalId] = Proposal({
            id: nextProposalId,
            description: _description,
            votesFor: 0,
            votesAgainst: 0,
            deadline: block.timestamp + VOTE_DURATION,
            executed: false,
            proposer: msg.sender
        });

        emit ProposalCreated(nextProposalId, _description, block.timestamp + VOTE_DURATION);
        nextProposalId++;
    }

    function vote(uint256 _proposalId, bool _support) external nonReentrant {
        Proposal storage p = proposals[_proposalId];
        require(block.timestamp < p.deadline, "Voting period over");
        require(!hasVoted[_proposalId][msg.sender], "Already voted");

        uint256 balance = govToken.balanceOf(msg.sender);
        require(balance > 0, "No voting power");

        hasVoted[_proposalId][msg.sender] = true;

        if (_support) {
            p.votesFor += balance;
        } else {
            p.votesAgainst += balance;
        }

        emit Voted(_proposalId, msg.sender, _support, balance);
    }

    function executeProposal(uint256 _proposalId) external nonReentrant {
        Proposal storage p = proposals[_proposalId];
        require(block.timestamp >= p.deadline, "Voting still active");
        require(!p.executed, "Already executed");

        p.executed = true;
        bool passed = p.votesFor > p.votesAgainst;
        
        // In a real DAO, this would trigger a function call or treasury transfer
        emit ProposalExecuted(_proposalId, passed);
    }
}
