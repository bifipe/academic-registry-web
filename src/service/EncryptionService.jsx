import * as EthCrypto from "eth-crypto";

export async function encryptMessage(publicKey, message) {

    const encrypted = await EthCrypto.encryptWithPublicKey(
        publicKey,
        message
    );

    return encrypted;
}

// Public Key: 'c264f479169ffec607a050dbeb6c894c0cfff4de632358d8e1850d99a290f785d129f4a5a71e8d4f767a753e8dccaaf17636755a6becd69c97baff8e978efb03'
// Private Key: '59ce1093128cd38a08b5fc6009e9e66d5b1bdd24e9e1d97f7dcf2d6ddfc16a2c'

export async function decryptMessage(privateKey, encryptedMessage) {
    const decrypted = await EthCrypto.decryptWithPrivateKey(
        privateKey,
        encryptedMessage
    );

    return decrypted;
}

