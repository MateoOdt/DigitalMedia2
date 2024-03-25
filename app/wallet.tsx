import React, { useEffect, useState } from "react";
import {
  createAccount,
  getAccountBalance,
  connectWalletByMetamask,
  getGasPrice,
  getNetworkId,
  getNetworkType,
  getAccounts,
  getTransaction,
  sendTransaction,
} from "../utils/Web3";
import TransactionPopup from "./popup";

const Wallet: React.FC = () => {
  const [account, setAccount] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [gasPrice, setGasPrice] = useState<string>("");
  const [networkId, setNetworkId] = useState<number>(0);
  const [networkType, setNetworkType] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [showTransactionPopup, setShowTransactionPopup] = useState<boolean>(false);
  const [transactionType, setTransactionType] = useState<"send" | "get">("send");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const balance = await getAccountBalance(account);
        setBalance(balance);

        const gasPrice = await getGasPrice();
        setGasPrice(gasPrice);

        const networkId = await getNetworkId();
        setNetworkId(networkId);

        const networkType = await getNetworkType();
        setNetworkType(networkType);

        setLoading(false);
      } catch (error) {
        setError("Error fetching account data");
        setLoading(false);
      }
    };
    if (account) {
      fetchData();
    }
  }, [account]);

  useEffect(() => {
    const fetchAllAccounts = async () => {
      const allAccounts = await getAccounts();
      setAccounts(allAccounts);
    };
    fetchAllAccounts();
  }, []);

  const handleCreateNewWallet = async () => {
    setLoading(true);
    try {
      const newAccount = await createAccount();
      setAccount(newAccount);
    } catch (error) {
      setError("Error creating new wallet");
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    setLoading(true);
    try {
      const connectedAccount = await connectWalletByMetamask();
      setAccount(connectedAccount);
    } catch (error) {
      setError("Error connecting wallet");
    } finally {
      setLoading(false);
    }
  };

  const handleSendTransaction = () => {
    setShowTransactionPopup(true);
    setTransactionType("send");
  };

  const handleGetTransaction = () => {
    setShowTransactionPopup(true);
    setTransactionType("get");
  };

  const handleTransactionSubmit = async (to: string, value: string) => {
    setShowTransactionPopup(false);
    setLoading(true);
    try {
      if (transactionType === "send") {
        const hash = await sendTransaction(account, to, value);
        setTransactionHash(hash);
      } else {
        const transaction = await getTransaction(to);
        console.log("Transaction:", transaction);
      }
    } catch (error) {
      setError("Error processing transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 gap-y-2 bg-primary-100">
      <div className="flex gap-x-4 mt-4">
        <Button onClick={handleCreateNewWallet}>Create New Wallet</Button>
        <Button onClick={handleConnectWallet}>Connect Wallet</Button>
      </div>
      <h2>Account Details:</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Detail label="Account Address" value={account} />
          <Detail label="Account Balance" value={`${balance} ETH`} />
          <Detail label="Gas Price" value={`${gasPrice} Gwei`} />
          <Detail label="Network ID" value={networkId.toString()} />
          <Detail label="Network Type" value={networkType} />
        </>
      )}
      <p className="text-red-500">{error}</p>

      <div className="mt-4">
        <Button onClick={handleSendTransaction}>Send Transaction</Button>
        <Button onClick={handleGetTransaction}>Get Transaction</Button>
      </div>

      {transactionHash && (
        <p className="text-green-500">Transaction Hash: {transactionHash}</p>
      )}

      <h2>Accounts ({accounts.length}):</h2>
      {accounts.map((account, index) => (
        <div key={index}>
          <p>{account}</p>
        </div>
      ))}

      {showTransactionPopup && (
        <TransactionPopup
          onClose={() => setShowTransactionPopup(false)}
          onSubmit={handleTransactionSubmit}
          transactionType={transactionType}
        />
      )}
    </div>
  );
};

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

export default Wallet;
