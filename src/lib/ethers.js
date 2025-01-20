import { ethers } from "ethers";
import AcademicRegistry from "../abis/AcademicRegistryABI.json";

//const CONTRACT_ADDRESS = "0xYourContractAddress";
const CONTRACT_ADDRESS = "0x4B7957b489d70aA2C1a3b28FD8C21078f91F9586";

let provider;
let signer;

// Conecta ao contrato usando o Metamask como provedor.
export const connectToContract = async () => {
    if (!window.ethereum) {
        throw new Error("Metamask is not installed");
    }

    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, AcademicRegistry.abi, signer);
    return contract;
};

export const getSigner = () => {
    if (!signer) {
        throw new Error("Signer not initialized. Call connectToContract first.");
    }
    return signer;
};
