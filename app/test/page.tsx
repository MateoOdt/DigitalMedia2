"use client";
import { use, useEffect, useState } from "react";
import Web3Utils, { delay } from "@/utils/Web3"; 
import { test } from "@/utils/test";

export default function Page() {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [accountBalances, setAccountBalances] = useState<string[]>([]);
  const handleTest = async () => {
    try {
      const testResult = await test();
      console.log("Test:", testResult);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    const fetchAccounts = async () => {
      const accounts = await Web3Utils.getAccounts();
      setAccounts(accounts);
      const balances = await Promise.all(
        accounts.map((account) => Web3Utils.getAccountBalance(account))
      );
      setAccountBalances(balances);
    };
    fetchAccounts();
  }, [accountBalances]);
  return (
    <div className="text-black">
      <p>This is the page</p>
      <button className="bg-blue-500 text-white rounded p-2" onClick={handleTest}>Test</button>
      {/* diplay accouncts and balance */}
      <div>
        <h2>Accounts</h2>
        <ul>
          {accounts.map((account, index) => (
            <li key={index}>
              {account} - {accountBalances[index]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
