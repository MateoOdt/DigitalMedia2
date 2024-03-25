import React, { useEffect, useState } from "react";
import Web3Utils, { delay } from "../utils/Web3";
import TransactionPopup from "./popup";

interface Account {
  address: string;
  privateKey: string;
}

const Wallet: React.FC = () => {
  const [account, setAccount] = useState<Account | null>(null);
  const [balance, setBalance] = useState<string>("");
  const [gasPrice, setGasPrice] = useState<string>("");
  const [networkId, setNetworkId] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [transactionDetails, setTransactionDetails] = useState<any | null>(null);
  const [showTransactionPopup, setShowTransactionPopup] = useState<boolean>(false);
  const [transactionType, setTransactionType] = useState<string>("send");
  const [showConnectAccountPopup, setShowConnectAccountPopup] = useState<boolean>(false);
  const [connectAccountInput, setConnectAccountInput] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (account) {
          const [balance, gasPrice, networkId] = await Promise.all([
            Web3Utils.getAccountBalance(account.address),
            Web3Utils.getGasPrice(),
            Web3Utils.getNetworkId()
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
      setAccount(prevAccount =>
        prevAccount?.address === connectedAccount ? null : { address: connectedAccount, privateKey: "" }
      );
    } catch (error) {
      setError("Error connecting wallet");
    } finally {
      setLoading(false);
    }
  };

  const handleConnectAccount = () => {
    setShowConnectAccountPopup(true);
  };

  const handleConnectAccountSubmit = async () => {
    setShowConnectAccountPopup(false);
    setLoading(true);
    try {
      const connectedAccount = await Web3Utils.connectToExistingAccount(connectAccountInput);
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
      const info = await Web3Utils.sendTransaction(account?.address || "", to, value);
      console.log("Transaction info:", info);
      // setTransactionDetails(info);
      await checkTransactionStatus(info.receipt.transactionHash);
    } catch (error) {
      setError("Error processing transaction");
    } finally {
      setLoading(false);
    }
  };

  const checkTransactionStatus = async (hash: string) => {
    try {
      let receipt: any = null;
      while (!receipt) {
        receipt = await Web3Utils.checkTransactionStatus(hash);
        console.log("Transaction receipt:", receipt);
        setTransactionDetails(receipt);
        if (!receipt) {
          console.log("Transaction is not yet mined. Checking again in 5 seconds...");
          await delay(5000);
        }
      }
      console.log("Transaction mined. Receipt:", receipt);
      // Handle transaction receipt
    } catch (error) {
      console.error("Error checking transaction status:", error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col items-center p-4 gap-y-2 bg-primary-100 overflow-scroll">
      {!showTransactionPopup && (
        <>
          <div className="flex gap-x-4 mt-4">
            <Button onClick={handleCreateNewWallet}>Create New Wallet</Button>
            <Button onClick={handleConnectAccountByMetaMask}>Connect Wallet</Button>
            <Button onClick={handleConnectAccount}>Connect Account</Button>
          </div>

          <h2>Account Details:</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <Detail label="Account Address" value={account ? account.address : ""} />
              <Detail label="Private Key" value={account ? account.privateKey : ""} />
              <Detail label="Account Balance" value={`${balance} ETH`} />
              <Detail label="Gas Price" value={`${gasPrice} Gwei`} />
              <Detail label="Network ID" value={networkId.toString()} />
            </>
          )}
          {error && <p className="text-red-500">{error}</p>}

          <div className="mt-4">
            <Button onClick={handleSendTransaction}>Send Transaction</Button>
            <Button onClick={handleGetTransaction}>Get Transaction</Button>
          </div>
          <br/>
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

      {showTransactionPopup && (
        <TransactionPopup
          onClose={() => setShowTransactionPopup(false)}
          onSubmit={handleTransactionSubmit}
          transactionType={transactionType}
        />
      )}

      {showConnectAccountPopup && (
        <ConnectAccountPopup
          onClose={() => setShowConnectAccountPopup(false)}
          onSubmit={handleConnectAccountSubmit}
          connectAccountInput={connectAccountInput}
          setConnectAccountInput={setConnectAccountInput}
        />
      )}
    </div>
  );
};

const Button: React.FC<{ onClick: () => void; children?: React.ReactNode }> = ({ onClick, children }) => (
  <button className="bg-blue-500 text-white rounded p-2" onClick={onClick}>
    {children}
  </button>
);

const Detail: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex flex-row items-center">
    <h3>{label}: </h3>
    <p>{value}</p>
  </div>
);

const ConnectAccountPopup: React.FC<{
  onClose: () => void;
  onSubmit: () => void;
  connectAccountInput: string;
  setConnectAccountInput: (input: string) => void;
}> = ({ onClose, onSubmit, connectAccountInput, setConnectAccountInput }) => (
  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-8 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Connect Account</h2>
      <input
        type="text"
        value={connectAccountInput}
        onChange={(e) => setConnectAccountInput(e.target.value)}
        placeholder="Enter address"
        className="border border-gray-300 rounded px-3 py-2 mb-4 w-full text-primary-100"
      />
      <div className="flex justify-end">
        <button onClick={onSubmit} className="bg-blue-500 text-white rounded px-4 py-2">
          Connect
        </button>
        <button onClick={onClose} className="bg-gray-200 text-gray-800 rounded px-4 py-2 ml-2">
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export default Wallet;

