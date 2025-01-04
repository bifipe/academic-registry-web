import React, { useState } from "react";
import { connectToContract } from "../lib/ethers";

export function GetInstitution({ setStatusMessage }) {
    const [queryInstitutionAddress, setQueryInstitutionAddress] = useState('');
    const [queriedInstitution, setQueriedInstitution] = useState(null);

    const getInstitution = async () => {
        setQueriedInstitution({
            name: "",
            document: "",
        });

        if (!queryInstitutionAddress) {
            setStatusMessage("Please fill in all fields.");
            return;
        }

        try {
            const contract = await connectToContract();
            const institution = await contract.getInstitution(queryInstitutionAddress);

            setQueriedInstitution({
                name: institution.name,
                document: institution.document,
            });
        } catch (error) {
            console.error("Error fetching institution:", error);
            setStatusMessage("Failed to fetch institution details.");
        }
    };

    return (
        <div>
            <h2>Get Institution</h2>
            <form className="form">
                <input
                    type="text"
                    placeholder="Institution Address"
                    value={queryInstitutionAddress}
                    onChange={(e) => {
                        setQueryInstitutionAddress(e.target.value);
                        setStatusMessage("");
                    }}
                />
                <button type="button" onClick={getInstitution}>Get Institution</button>
            </form>
            {queriedInstitution?.name && (
                <div>
                    <h3>Institution Details</h3>
                    <p>Name: {queriedInstitution.name}</p>
                    <p>Document: {queriedInstitution.document}</p>
                </div>
            )}
        </div>
    );
}
