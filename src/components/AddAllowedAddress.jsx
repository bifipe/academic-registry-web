import React, { useState } from "react";
import { connectToContract } from "../lib/ethers";
import { encrypt } from "@metamask/eth-sig-util";

export function AddAllowedAddress({ setStatusMessage }) {
    const [allowedAddress, setAllowedAddress] = useState("");
    const [studentAddress, setStudentAddress] = useState("");

    const addAllowedAddress = async () => {
        if (!allowedAddress || !studentAddress) {
            setStatusMessage("Please fill in all fields.");
            return;
        }

        try {
            const contract = await connectToContract();
            const recipientKey = await contract.retrieveRecipientEncrpytKey(
                allowedAddress,
                studentAddress
            );

            const studentEncryptedInformation = await contract.retrieveStudentInformation(studentAddress);

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
                        { publicKey: recipientKey, data: JSON.stringify(studentInformation), version: 'x25519-xsalsa20-poly1305' },
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
            setStudentAddress("");
        } catch (error) {
            console.error("Error adding allowed address:", error);
            setStatusMessage("Failed to add allowed address. Check the console for more details.");
        }
    };

    return (
        <div>
            <h2>Add Allowed Address</h2>
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
                <input
                    type="text"
                    placeholder="Student Address"
                    value={studentAddress}
                    onChange={(e) => {
                        setStudentAddress(e.target.value);
                        setStatusMessage("");
                    }}
                />
                <button type="button" onClick={addAllowedAddress}>Submit</button>
            </form>
        </div>
    );
}
