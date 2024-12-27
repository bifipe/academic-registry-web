import React, { useState } from "react";
import { connectToContract } from "./lib/ethers";

export function App() {
  const [account, setAccount] = useState(null);
  const [institutionAddress, setInstitutionAddress] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [institutionDocument, setInstitutionDocument] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const connectWallet = async () => {
      if (!window.ethereum) {
          alert("Metamask is not installed");
          return;
      }
      try {
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          setAccount(accounts[0]);
          setStatusMessage("Wallet connected!");
      } catch (error) {
          console.error("Error connecting wallet:", error);
          setStatusMessage("Failed to connect wallet.");
      }
  };

  const addInstitution = async () => {
      if (!institutionAddress || !institutionName || !institutionDocument) {
          setStatusMessage("Please fill in all fields.");
          return;
      }

      try {
          const contract = await connectToContract();
          const tx = await contract.addInstitution(
              institutionAddress,
              institutionName,
              institutionDocument
          );

          setStatusMessage("Transaction submitted, waiting for confirmation...");
          await tx.wait(); // Espera a transação ser confirmada
          setStatusMessage(`Institution added successfully! TxHash: ${tx.hash}`);
      } catch (error) {
          console.error("Error adding institution:", error);
          setStatusMessage("Failed to add institution. Check the console for more details.");
      }
  };
  
  return (
    <div>
      <h1>Academic Registry DApp</h1>
      <button onClick={connectWallet}>
          {account ? `Connected: ${account}` : "Connect Wallet"}
      </button>

      <div style={{ marginTop: "20px" }}>
          <h2>Add Institution</h2>
          <input
              type="text"
              placeholder="Institution Address"
              value={institutionAddress}
              onChange={(e) => setInstitutionAddress(e.target.value)}
          />
          <input
              type="text"
              placeholder="Institution Name"
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
          />
          <input
              type="text"
              placeholder="Institution Document"
              value={institutionDocument}
              onChange={(e) => setInstitutionDocument(e.target.value)}
          />
          <button onClick={addInstitution}>Submit</button>
      </div>

      {statusMessage && <p>{statusMessage}</p>}
    </div>
  )
}
