import React, { useState } from "react";
import { connectToContract } from "../lib/ethers";
import { ethers } from "ethers";
import { encrypt } from "@metamask/eth-sig-util";

export function AllowAccessToAddress({ setStatusMessage }) {
    const [allowedAddress, setAllowedAddress] = useState("");

    const allowAccessToAddress = async () => {
        if (!allowedAddress) {
            setStatusMessage("Please fill in all fields.");
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const studentAddress = await signer.getAddress();

            const contract = await connectToContract();
            const recipientKey = await contract.retrieveRecipientEncrpytKey(
                allowedAddress,
                studentAddress
            );

            const student = await contract.getStudent(studentAddress);
            const studentEncryptedInformation = student.selfEncryptedInformation;

            const studentInformation = await window.ethereum.request({
                "method": "eth_decrypt",
                "params": [
                    studentEncryptedInformation,
                    studentAddress
                ],
            });

            console.log(studentInformation);

            const buf = Buffer.from(
                JSON.stringify(
                    encrypt(
                        { publicKey: recipientKey, data: studentInformation, version: 'x25519-xsalsa20-poly1305' },
                    )
                ),
                'utf8'
            )
            const encryptedValue = '0x' + buf.toString('hex');

            const tx = await contract.addEncryptedInfoWithRecipientKey(allowedAddress, studentAddress, encryptedValue);

            setStatusMessage("Transaction submitted, waiting for confirmation...");
            await tx.wait(); // Espera a transação ser confirmada
            setStatusMessage("Allowed address added successfully!");

            setAllowedAddress("");
        } catch (error) {
            console.error("Error adding allowed address:", error);
            setStatusMessage("Failed to add allowed address. Check the console for more details.");
        }
    };

    return (
        <div>
            <h2>Allow Address to access personal information</h2>
            <form className="form">
                <input
                    type="text"
                    placeholder="Allowed Address"
                    value={allowedAddress}
                    onChange={(e) => {
                        setAllowedAddress(e.target.value);
                        setStatusMessage("");
                    }}
                />
                <button type="button" onClick={allowAccessToAddress}>Submit</button>
            </form>
        </div>
    );
}
