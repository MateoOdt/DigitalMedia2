import React, { useEffect, useState } from "react";
import {
  createAccount,
  getAccountBalance,
  connectWalletByMetamask,
  getGasPrice,
  getNetworkId,
  getNetworkType,
} from "../utils/Web3";

const Wallet: React.FC = () => {
  const [account, setAccount] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [gasPrice, setGasPrice] = useState<string>("");
  const [networkId, setNetworkId] = useState<number>(0);
  const [networkType, setNetworkType] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
  const handleCreateNewWallet = async () => {
    setLoading(true);
    try {
      const newAccount = await createAccount();
      setAccount(newAccount);
      console.log("create", newAccount);
    } catch (error) {
      setError("Error creating new wallet");
    }
    setLoading(false);
  };

  const handleConnectWallet = async () => {
    setLoading(true);
    try {
      const connectedAccount = await connectWalletByMetamask();
      setAccount(connectedAccount);
      console.log("conncet",connectedAccount);
    } catch (error) {
      setError("Error connecting wallet");
    }
    setLoading(false);
  };

  console.log("accountState", account);
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
