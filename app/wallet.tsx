import React, { useEffect, useState } from 'react';
import { createAccount, getAccountBalance, getTransaction, sendTransaction } from '../utils/walletService';

const Wallet: React.FC = () => {
  const [account, setAccount] = useState<string>('');
  const [balance, setBalance] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Create a new account
        const newAccount = await createAccount();
        setAccount(newAccount);
        
        // Get account balance
        const accountBalance = await getAccountBalance(newAccount);
        setBalance(accountBalance);
        
        setLoading(false);
      } catch (error) {
        setError('Error fetching account data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to handle sending a transaction
  const handleSendTransaction = async () => {
    try {
      setLoading(true);
      // Example: Sending 1 ETH to another address
      const from = account; // Sender's address
      const to = 'recipient_address'; // Recipient's address
      const value = '1'; // Ether value to send
      const transactionHash = await sendTransaction(from, to, value);
      
      // Check transaction status
      await checkTransactionStatus(transactionHash);

      // Update balance after transaction
      const updatedBalance = await getAccountBalance(account);
      setBalance(updatedBalance);
      
      setLoading(false);
    } catch (error) {
      setError('Error sending transaction');
      setLoading(false);
    }
  };

  const handleGetTransaction = async () => {
    try {
      setLoading(true);
      // Example: Get transaction details using transaction hash
      const transactionHash = 'transaction_hash';
      const transaction = await getTransaction(transactionHash);
      console.log('Transaction details:', transaction);
      setLoading(false);
    } catch (error) {
      setError('Error getting transaction details');
      setLoading(false);
    }
  };

  // Function to check transaction status
  const checkTransactionStatus = async (transactionHash: string) => {
    try {
      // Wait for the transaction to be confirmed
      const maxAttempts = 20;
      let attempts = 0;
      let receipt = null;
      while (attempts < maxAttempts) {
        receipt = await getTransaction(transactionHash);
        if (receipt && receipt.blockNumber) {
          console.log('Transaction confirmed');
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds before checking again
        attempts++;
      }
      if (!receipt || !receipt.blockNumber) {
        throw new Error('Transaction not confirmed within the expected time');
      }
    } catch (error) {
      throw new Error(`Error checking transaction status: ${error}`);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 gap-y-2 bg-primary-100">
      <h2>Account Details:</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className="flex flex-row items-center">
            <h3>Account Address: </h3>
            <p>{account}</p>
          </div>
          <div className="flex flex-row items-center">
            <h3>Account Balance: </h3>
            <p>{balance} ETH</p>
          </div>
          <button className="bg-blue-500 text-white rounded p-2 mt-4" onClick={handleSendTransaction}>
            Send Transaction
          </button>
          <button className="bg-blue-500 text-white rounded p-2 mt-4" onClick={handleGetTransaction}>
            Get Transaction
          </button>
        </>
      )}
    </div>
  );
};

export default Wallet;
