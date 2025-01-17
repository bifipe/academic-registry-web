import React, { useState } from "react";
import { encryptMessage, decryptMessage } from "../service/EncryptionService";
import { ethers } from "ethers";
import { recoverPublicKey } from "@ethersproject/signing-key";

export function TestEncryption({ setStatusMessage }) {
    const [privateKey, setPrivateKey] = useState("");
    const [name, setName] = useState("");
    const [document, setDocument] = useState("");

    const testEncryption = async () => {

        if (!privateKey || !name || !document) {
            setStatusMessage("Please fill in all fields.");
            return;
        }

        try {

            const personalInformation = {
                name: name,
                document: document
            };

            const message = "Do you allow the system to register your personal information?";

            const messageHash = ethers.hashMessage(message);

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const signature = await signer.signMessage(message);
            
            const publicKey = recoverPublicKey(messageHash, signature);

            const encryptedData = await encryptMessage(publicKey.slice(2), JSON.stringify(personalInformation));

            console.log(JSON.stringify(encryptedData));

            const decryptedMessage = await decryptMessage(privateKey, encryptedData);

            console.log(decryptedMessage);

        } catch (error) {
            console.error("Error in test:", error);
            setStatusMessage("Failed to test.");
        }
    };

    return (
        <div>
            <h2>Test Encryption</h2>
            <form className="form">
                <input
                    type="text"
                    placeholder="Private Key"
                    value={privateKey}
                    onChange={(e) => {
                        setPrivateKey(e.target.value);
                        setStatusMessage("");
                    }}
                />
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setStatusMessage("");
                    }}
                />
                <input
                    type="text"
                    placeholder="Document"
                    value={document}
                    onChange={(e) => {
                        setDocument(e.target.value);
                        setStatusMessage("");
                    }}
                />
                <button type="button" onClick={testEncryption}>Test Encryption</button>
            </form>
        </div>
    );
}
