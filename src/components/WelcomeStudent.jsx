import React, { useState, useEffect } from "react";
import { verifyMessage, hashMessage } from "ethers";
import { recoverPublicKey } from "@ethersproject/signing-key";
import { connectToContract, getSigner } from "../lib/ethers";
import { encryptMessage } from "../service/EncryptionService";

export function WelcomeStudent({ setStatusMessage }) {
    const [name, setName] = useState("");
    const [document, setDocument] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (name && document) {
            setMessage(`Register user with name: ${name} and document: ${document}`);
        } else {
            setMessage("");
        }
    }, [name, document]);

    const signAndRegister = async () => {
        try {
            const personalInformation = {
                name: name,
                document: document
            };

            const message = `Register user with name: ${name} and document: ${document}`;
            
            // Conecta ao contrato inteligente
            const contract = await connectToContract();

            const signer = getSigner();

            // Solicita ao usuário que assine a mensagem
            const signature = await signer.signMessage(message);

            const studentAddress = verifyMessage(message, signature);
            console.log("Student Address:", studentAddress);

            // Deriva a chave pública a partir da assinatura
            const publicKey = recoverPublicKey(
                hashMessage(message),
                signature
            );
            console.log("Derived Public Key:", publicKey);

            const encryptedData = await encryptMessage(publicKey.slice(2), JSON.stringify(personalInformation));
            console.log(JSON.stringify(encryptedData));

            // Guardar end do aluno???
            const tx = await contract.addStudentInformation(
                publicKey,
                JSON.stringify(encryptedData)
            );
            //console.log(tx)

            setStatusMessage("Transaction submitted, waiting for confirmation...");
            await tx.wait(); // Espera a transação ser confirmada
            setStatusMessage("Student registered successfully!");

            setName("");
            setDocument("");
        } catch (error) {
            console.error("Error signing the message:", error);
            setStatusMessage("Registration failed. Check the console for more details.");
        }
    };

    return (
        <div>
            <h2>Welcome!!!</h2>
            <p>To register in this blockchain application, we kindly ask you to digitally sign a message to confirm your identity and authorization.</p>
            <form className="form">
                <input
                    type="text"
                    placeholder="Student Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Student Document"
                    value={document}
                    onChange={(e) => setDocument(e.target.value)}
                />
                <textarea
                    rows="4"
                    disabled
                    value={message}
                    placeholder="Generated message will appear here..."
                />
                <button type="button" onClick={signAndRegister} disabled={!message}>
                    Sign and Register
                </button>
            </form>
        </div>
    );
}
