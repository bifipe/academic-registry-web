import React, { useState } from "react";
import { ethers } from "ethers";
import { connectToContract } from "../lib/ethers";

export function AddInstitutionPublicKey({ setStatusMessage }) {
    
    const addInstitutionPublicKey = async () => {

        try {

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            const contract = await connectToContract();

            const institution = await contract.getInstitution(address);

            if (institution.publicKey) {
                setStatusMessage("Institution's public key is already added!");
                return;
            }

            const encryptionPublicKey = await window.ethereum.request({
                "method": "eth_getEncryptionPublicKey",
                "params": [
                    address
               ],
            });

            const tx = await contract.addInstitutionPublicKey(address, encryptionPublicKey);

            setStatusMessage("Transaction submitted, waiting for confirmation...");
            await tx.wait(); // Espera a transação ser confirmada
            setStatusMessage("Institution's public key added successfully!");

        } catch (error) {
            console.error("Error in addInstitutionInformation:", error);
            setStatusMessage("Failed to add the intitution's public key.");
        }
    };

    return (
        <div>
            <h2>Add Institution's Public Key (only usable by the institution's account) </h2>
            <form className="form">
                <button type="button" onClick={addInstitutionPublicKey}>Add Public Key</button>
            </form>
        </div>
    );
}
