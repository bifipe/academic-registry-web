import { ethers } from "ethers";
import AcademicRegistry from "../abis/AcademicRegistryABI.json";

//const CONTRACT_ADDRESS = "0xYourContractAddress";
const CONTRACT_ADDRESS = "0xE33DfD1Fb0f6c99cbb45AF50BEc5178C9df33b9b";

// Conecta ao contrato usando o Metamask como provedor.
export const connectToContract = async () => {
    if (!window.ethereum) {
        throw new Error("Metamask is not installed");
    }
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, AcademicRegistry.abi, signer);
    return contract;
};
