import React, { useEffect, useState } from 'react';
import { createAccount, getAccountBalance, connectWalletByMetamask } from '../utils/Web3';

const Wallet: React.FC = () => {
  const [account, setAccount] = useState<string>('');
  const [balance, setBalance] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const existingAccount = await connectWalletByMetamask();
        if (existingAccount) {
          setAccount(existingAccount);
          const accountBalance = await getAccountBalance(existingAccount);
          setBalance(accountBalance);
        } else {
          const newAccount = await createAccount();
          setAccount(newAccount);
          const accountBalance = await getAccountBalance(newAccount);
          setBalance(accountBalance);
        }
        setLoading(false);
      } catch (error) {
        setError('Error fetching account data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateNewWallet = async () => {
    try {
      setLoading(true);
      const newAccount = await createAccount();
      setAccount(newAccount);
      const accountBalance = await getAccountBalance(newAccount);
      setBalance(accountBalance);
      setLoading(false);
    } catch (error) {
      setError('Error creating new wallet');
      setLoading(false);
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
        </>
      )}
      <div className="flex gap-x-4 mt-4">
        <button className="bg-blue-500 text-white rounded p-2" onClick={handleCreateNewWallet}>
          Create New Wallet
        </button>
        <button className="bg-blue-500 text-white rounded p-2" onClick={connectWalletByMetamask}>
          Connect Existing Wallet
        </button>
      </div>
    </div>
  );
};

export default Wallet;
