import React, { useState } from "react";
import { encryptMessage, decryptMessage } from "../service/EncryptionService";

export function TestEncryption({ setStatusMessage }) {
    const [publicKey, setPublicKey] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [data, setData] = useState("");

    const testEncryption = async () => {

        if (!publicKey || !data) {
            setStatusMessage("Please fill in all fields.");
            return;
        }

        try {

            const encryptedData = await encryptMessage(publicKey, data);

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
                    placeholder="Public Key"
                    value={publicKey}
                    onChange={(e) => {
                        setPublicKey(e.target.value);
                        setStatusMessage("");
                    }}
                />
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
                    placeholder="Data"
                    value={data}
                    onChange={(e) => {
                        setData(e.target.value);
                        setStatusMessage("");
                    }}
                />
                <button type="button" onClick={testEncryption}>Test Encryption</button>
            </form>
        </div>
    );
}
