import React, { useState } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import PushProtocolUtil from "../utils/PushProtocolUtils";
import "react-toastify/dist/ReactToastify.css";

const ChatApp = () => {
  const [userData, setUserData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const pushUtil = new PushProtocolUtil();

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast.error("MetaMask is not installed!");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const walletAddress = await signer.getAddress();

      setLoading(true);

      // Step 1: Fetch user data and decrypt the private key
      const user = await pushUtil.fetchUserData(`eip155:${walletAddress}`, signer);

      // Step 2: Fetch chats using the decrypted PGP private key
      const chats = await pushUtil.fetchChats(`eip155:${walletAddress}`, user.pgpPrivateKey);

      setUserData({ user, chats });
      setIsConnected(true);
      toast.success("Wallet connected and data fetched!");
    } catch (error) {
      console.error("Error connecting wallet:", error.message || error);
      toast.error("Failed to connect wallet: " + (error.message || error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      {!isConnected ? (
        <button onClick={connectWallet} disabled={loading}>
          {loading ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : (
        <div>
          <h3>User Data</h3>
          {userData && (
            <div>
              <pre>{JSON.stringify(userData.user, null, 2)}</pre>
              <h4>Chats</h4>
              <pre>{JSON.stringify(userData.chats, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatApp;
