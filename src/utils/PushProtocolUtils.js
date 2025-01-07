import { chat, user, CONSTANTS ,PushAPI } from "@pushprotocol/restapi";
import { ethers } from "ethers";

class PushProtocolUtil {
  constructor() {
    console.log("Constructor called");
    this.env = CONSTANTS?.ENV?.PROD || "prod";
  }

  async inituser(signer,env) {
    const user  = await PushAPI.initialize(signer,env);
    return user;
  };

  async fetchUserData(walletAddress, signer) {
    console.log("Fetching user data for:", walletAddress);

    // Step 1: Fetch user data
    const userData = await user.get({
      account: walletAddress,
      env: this.env,
    });

    if (!userData || !userData.encryptedPrivateKey) {
      throw new Error("User data or encrypted private key not found.");
    }

    console.log("User data fetched:", userData);

    // Step 2: Use ethers.js to sign and decrypt the private key
    const decryptedPGPPrivateKey = await this.decryptPGPPrivateKey(
      userData.encryptedPrivateKey,
      signer
    );

    console.log("Decrypted PGP Private Key:", decryptedPGPPrivateKey);

    return { ...userData, pgpPrivateKey: decryptedPGPPrivateKey };
  }

  async decryptPGPPrivateKey(encryptedKey, signer) {
    console.log("Decrypting PGP private key...");
    const message = JSON.stringify(encryptedKey); // Convert encrypted key to a string
    const signature = await signer.signMessage(message); // Sign the encrypted message

    // Simulate decryption using subtleCrypto (replace with actual logic if required)
    const keyBuffer = new TextEncoder().encode(signature);
    const subtle = window.crypto.subtle;
    const decrypted = await subtle.digest("SHA-256", keyBuffer);

    console.log("Decryption complete:", decrypted);
    return new TextDecoder().decode(decrypted);
  }
  async fetchChats(user) {
    const chats = await user.chat.list('CHATS')
    return chats;
  }


  // async fetchChats(walletAddress, pgpPrivateKey) {
  //   console.log("Fetching chats for:", walletAddress);

  //   const chats = await chat.chats({
  //     account: walletAddress,
  //     pgpPrivateKey,
  //     env: this.env,
  //   });

  //   return chats.map((chat) => ({
  //     id: chat.id,
  //     from: chat.fromDID,
  //     to: chat.toDID,
  //     lastMessage: chat.latestMessage
  //       ? chat.latestMessage.messageContent
  //       : "No messages yet",
  //   }));
  // }
}

export default PushProtocolUtil;
