"use client";
import React, { useEffect, useState } from "react";
import Popup from "@/components/Popup"; // Adjust the path as per your project structure
import Web3Utils, { delay } from "../utils/Web3";

interface Account {
  address: string;
  privateKey: string;
}

export default function Home() {
  const [account, setAccount] = useState<Account | null>(null);
  const [balance, setBalance] = useState<string>("");
  const [gasPrice, setGasPrice] = useState<string>("");
  const [networkId, setNetworkId] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [transactionDetails, setTransactionDetails] = useState<any | null>(
    null
  );
  const [transactionStatus, setTransactionStatus] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupType, setPopupType] = useState<"connectAccount" | "transaction">(
    "connectAccount"
  );
  const togglePopup = (popupType: "connectAccount" | "transaction") => {
    setPopupType(popupType);
    setShowPopup((prevShowPopup) => !prevShowPopup);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (account) {
          const [balance, gasPrice, networkId] = await Promise.all([
            Web3Utils.getAccountBalance(account.address),
            Web3Utils.getGasPrice(),
            Web3Utils.getNetworkId(),
          ]);
          setBalance(balance);
          setGasPrice(gasPrice);
          setNetworkId(networkId);
        }
      } catch (error) {
        setError("Error fetching account data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [account]);

  useEffect(() => {
    const fetchAllAccounts = async () => {
      const allAccounts = await Web3Utils.getAccounts();
      setAccounts(allAccounts);
    };
    fetchAllAccounts();
  }, []);

  useEffect(() => {
    const checkTransactionStatus = async (hash: string) => {
      try {
        let receipt: any = null;
        while (!receipt) {
          receipt = await Web3Utils.checkTransactionStatus(hash);
          setTransactionStatus(receipt);
          if (!receipt) {
            await delay(5000);
          }
        }
      } catch (error) {
        console.error("Error checking transaction status:", error);
        throw error;
      }
    };
    if (transactionDetails?.receipt?.transactionHash) {
      checkTransactionStatus(transactionDetails.receipt.transactionHash);
    }
  }, [transactionDetails?.receipt?.transactionHash]);

  const handleCreateNewWallet = async () => {
    setLoading(true);
    try {
      const newAccount = await Web3Utils.createAccount();
      setAccount(newAccount);
    } catch (error) {
      setError("Error creating new wallet");
    } finally {
      setLoading(false);
    }
  };

  const handleConnectAccountByMetaMask = async () => {
    setLoading(true);
    try {
      const connectedAccount = await Web3Utils.connectWalletByMetamask();
      setAccount((prevAccount) =>
        prevAccount?.address === connectedAccount
          ? null
          : { address: connectedAccount, privateKey: "" }
      );
    } catch (error) {
      setError("Error connecting wallet");
    } finally {
      setLoading(false);
    }
  };

  const handleConnectAccount = () => {
    setShowPopup(true);
    setPopupType("connectAccount");
  };

  const handleConnectAccountSubmit = async (formData: {
    address: string;
    mnemonic: string;
  }) => {
    setShowPopup(false);
    setLoading(true);
    try {
      const connectedAccount = await Web3Utils.connectToExistingAccount(
        formData.address,
        formData.mnemonic
      );
      setAccount(connectedAccount);
    } catch (error) {
      setError("Error connecting wallet");
    } finally {
      setLoading(false);
    }
  };

  const handleSendTransaction = () => {
    setShowPopup(true);
    setPopupType("transaction");
  };

  const handleTransactionSubmit = async (formData: {
    to: string;
    value: string;
  }) => {
    setShowPopup(false);
    setLoading(true);
    try {
      const info = await Web3Utils.sendTransaction(
        account?.address as string,
        formData.to,
        formData.value
      );
      console.log("Transaction info:", info);
      setTransactionDetails(info);
    } catch (error) {
      setError("Error processing transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center overflow-auto text-primary-50">
      {!showPopup && (
        <>
          <div className="flex gap-x-4 mt-4">
            <Button onClick={handleCreateNewWallet}>Create New Wallet</Button>
            <Button onClick={handleConnectAccountByMetaMask}>
              Connect Wallet
            </Button>
            <Button onClick={handleConnectAccount}>Connect Account</Button>
          </div>

          <h2>Account Details:</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <Detail
                label="Account Address"
                value={account ? account.address : ""}
              />
              <Detail
                label="Private Key"
                value={account ? account.privateKey : ""}
              />
              <Detail label="Account Balance" value={`${balance} ETH`} />
              <Detail label="Gas Price" value={`${gasPrice} Gwei`} />
              <Detail label="Network ID" value={networkId.toString()} />
            </>
          )}
          {error && <p className="text-red-500">{error}</p>}

          <div className="mt-4">
            <Button onClick={handleSendTransaction}>Send Transaction</Button>
          </div>
          <br />
          <h2>Transaction Details:</h2>
          {transactionDetails && (
            <div>
              {Object.entries(transactionDetails).map(([key, value], index) => (
                <div key={index}>
                  <p>{`${key}: ${value}`}</p>
                </div>
              ))}
            </div>
          )}

          <h2>Accounts ({accounts.length}):</h2>
          {accounts.map((acc, index) => (
            <div key={index}>
              <p>{acc}</p>
            </div>
          ))}
        </>
      )}

      <Popup
        onClose={() => setShowPopup(false)}
        onSubmit={(formData) => {
          if (popupType === "connectAccount") {
            handleConnectAccountSubmit(
              formData as { address: string; mnemonic: string }
            );
          } else if (popupType === "transaction") {
            handleTransactionSubmit(formData as { to: string; value: string });
          }
        }}
        popupType={popupType}
        visible={showPopup} // Pass visibility state to Popup
      />
    </div>
  );
}

const Button: React.FC<{ onClick: () => void; children?: React.ReactNode }> = ({
  onClick,
  children,
}) => (
  <button className="bg-blue-500 text-white rounded p-2" onClick={onClick}>
    {children}
  </button>
);

const Detail: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="flex flex-row items-center">
    <h3>{label}: </h3>
    <p>{value}</p>
  </div>
);
