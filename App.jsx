import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";

const DAO_ADDRESS = "YOUR_DAO_ADDRESS"; 
// Minimal ABI
const DAO_ABI = [
  "function createProposal(string) external",
  "function vote(uint256, bool) external",
  "function executeProposal(uint256) external",
  "function nextProposalId() view returns (uint256)",
  "function proposals(uint256) view returns (uint256, string, uint256, uint256, uint256, bool, address)"
];

function App() {
  const [proposals, setProposals] = useState([]);
  const [desc, setDesc] = useState("");
  const [contract, setContract] = useState(null);

  useEffect(() => {
    connect();
  }, []);

  const connect = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setContract(new ethers.Contract(DAO_ADDRESS, DAO_ABI, signer));
    }
  };

  const fetchProposals = async () => {
    if (!contract) return;
    const count = await contract.nextProposalId();
    let arr = [];
    for (let i = 0; i < count; i++) {
      const p = await contract.proposals(i);
      arr.push(p);
    }
    setProposals(arr);
  };

  const create = async () => {
    const tx = await contract.createProposal(desc);
    await tx.wait();
    fetchProposals();
  };

  const vote = async (id, support) => {
    try {
      const tx = await contract.vote(id, support);
      await tx.wait();
      alert("Vote Cast!");
      fetchProposals();
    } catch (e) { console.error(e); alert("Vote failed"); }
  };

  return (
    <div className="dao-container">
      <header>
        <h1>🏛️ Governance Dashboard</h1>
        <button onClick={fetchProposals}>Refresh Proposals</button>
      </header>

      <div className="create-section">
        <input 
          value={desc} 
          onChange={(e) => setDesc(e.target.value)} 
          placeholder="Proposal Description"
        />
        <button onClick={create}>Create Proposal</button>
      </div>

      <div className="proposal-list">
        {proposals.map((p, index) => (
          <div key={index} className="card">
            <h3>ID: {index} - {p[1]}</h3>
            <div className="stats">
              <span className="green">For: {ethers.utils.formatEther(p[2])}</span>
              <span className="red">Against: {ethers.utils.formatEther(p[3])}</span>
            </div>
            <p>Status: {p[5] ? "Executed" : "Active"}</p>
            {!p[5] && (
              <div className="actions">
                <button onClick={() => vote(index, true)} className="btn-yes">Vote YES</button>
                <button onClick={() => vote(index, false)} className="btn-no">Vote NO</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
