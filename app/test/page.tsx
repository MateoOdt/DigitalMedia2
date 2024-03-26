"use client";
import { useState } from "react";
import Web3Utils, { delay } from "@/utils/Web3"; 
import { test } from "@/utils/test";

export default function Page() {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [accountBalances, setAccountBalances] = useState<string[]>([]);
  const handleTest = async () => {
    try {
      // get account balance of al accounts
      const accounts = await Web3Utils.getAccounts();
      console.log("Accounts:", accounts);
      const accountBalances = await Promise.all(
        accounts.map(async (account: any) => {
          return await Web3Utils.getAccountBalance(account);
        })
      );
      setAccounts(accounts);
      setAccountBalances(accountBalances);

      const testResult = await test();
      console.log("Test:", testResult);
    } catch (error) {
      console.error("Error:", error);
    }
  };
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
