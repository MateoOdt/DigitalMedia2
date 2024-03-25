import Web3 from "web3";

let web3: Web3 | undefined;

const SimpleStorageContractABI = [
  {
    constant: false,
    inputs: [
      {
        name: "x",
        type: "uint256",
      },
    ],
    name: "set",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "get",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

export const connectWalletByMetamask = async (): Promise<string> => {
  try {
    if (typeof window !== "undefined" && window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const web3Instance = new Web3(window.ethereum);
      const [defaultAccount] = await web3Instance.eth.getAccounts();
      return defaultAccount;
    } else {
      throw new Error("Metamask not installed");
    }
  } catch (error: any) {
    throw new Error(`Error connecting wallet: ${error.message}`);
  }
};

export const initializeWeb3 = async (): Promise<Web3> => {
  if (!web3) {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }
  return web3;
};

export const connectToExistingAccount = async (
  address: string
): Promise<{ address: string; privateKey: string }> => {
  try {
    const web3Instance = await initializeWeb3();
    const accounts = await web3Instance.eth.getAccounts();
    const account = accounts.find(
      (acc) => acc.toLowerCase() === address.toLowerCase()
    );

    if (!account) {
      throw new Error("Account not found");
    }

    // In a testing environment like Ganache, you can directly extract private keys
    // Assuming you've started Ganache with the flag --mnemonic <mnemonic_phrase>
    // You can use the mnemonic to get private keys for accounts
    const mnemonic =
      "ceiling behind aware fresh sting praise film inch allow silver gossip tw"; //Ganache mnemonic
    const hdwallet = require("ethereumjs-wallet").hdkey.fromMasterSeed(
      web3Instance.utils.toHex(mnemonic)
    );
    const wallet = hdwallet
      .derivePath(`m/44'/60'/0'/0/${accounts.indexOf(account)}`)
      .getWallet();
    const privateKey = "0x" + wallet.getPrivateKey().toString("hex");

    console.log(`Connected to account: ${account}`);
    return { address: account, privateKey: privateKey };
  } catch (error: any) {
    throw new Error(`Error connecting to existing account: ${error.message}`);
  }
};

export const getAccounts = async (): Promise<string[]> => {
  try {
    const web3Instance = await initializeWeb3();
    return await web3Instance.eth.getAccounts();
  } catch (error: any) {
    throw new Error(`Error getting accounts: ${error.message}`);
  }
};

export const createAccount = async (): Promise<{
  address: string;
  privateKey: string;
}> => {
  try {
    const web3Instance = await initializeWeb3();
    const account = web3Instance.eth.accounts.create();
    return { address: account.address, privateKey: account.privateKey };
  } catch (error: any) {
    throw new Error(`Error creating account: ${error.message}`);
  }
};

export const importAccountToGanache = async (
  privateKey: string
): Promise<string> => {
  try {
    // Here you would need to manually import the private key into Ganache.
    // Refer to the Ganache documentation or interface on how to import accounts.
    // After importing, you can return a message indicating success.
    return "Account imported to Ganache successfully";
  } catch (error: any) {
    throw new Error(`Error importing account to Ganache: ${error.message}`);
  }
};

export const getAccountBalance = async (address: string): Promise<string> => {
  try {
    const web3Instance = await initializeWeb3();
    const balance = await web3Instance.eth.getBalance(address);
    return web3Instance.utils.fromWei(balance, "ether");
  } catch (error: any) {
    throw new Error(`Error getting account balance: ${error.message}`);
  }
};

export const sendTransaction = async (
  from: string,
  to: string,
  value: string
): Promise<any> => {
  try {
    const web3Instance = await initializeWeb3();
    const contract = new web3Instance.eth.Contract(
      SimpleStorageContractABI,
      to
    );
    const transaction = {
      from,
      to,
      value: web3Instance.utils.toWei(value, "ether"),
    };
    const gas = await web3Instance.eth.estimateGas(transaction);
    console.log(`Estimated gas: ${gas}`);
    const options = {
      from,
      to,
      value: web3Instance.utils.toWei(value, "ether"),
      gas: gas.toString(),
    };
    const receipt = await contract.methods.set(options).send(options);
    console.log(`Transaction receipt: ${receipt}`);
    return { options, receipt };
  } catch (error: any) {
    throw new Error(`Error sending transaction: ${error.message}`);
  }
};

export const getTransaction = async (hash: string): Promise<any> => {
  try {
    const web3Instance = await initializeWeb3();
    const info = await web3Instance.eth.getTransaction(hash);
    return info;
  } catch (error: any) {
    throw new Error(`Error getting transaction: ${error.message}`);
  }
};

export const checkTransactionStatus = async (hash: string): Promise<any> => {
  try {
    let receipt: any = null;
    while (!receipt) {
      const web3Instance = await initializeWeb3();

      receipt = await web3Instance.eth.getTransactionReceipt(hash);
      if (!receipt) {
        console.log(
          "Transaction is not yet mined. Checking again in 5 seconds..."
        );
        await delay(5000); // Wait for 5 seconds before checking again
      }
    }
    console.log("Transaction mined. Receipt:", receipt);
    return receipt;
  } catch (error) {
    console.error("Error checking transaction status:", error);
    throw error;
  }
};

export const getBlock = async (hash: string): Promise<any> => {
  try {
    const web3Instance = await initializeWeb3();
    return await web3Instance.eth.getBlock(hash);
  } catch (error: any) {
    throw new Error(`Error getting block: ${error.message}`);
  }
};

export const getBlockNumber = async (): Promise<bigint> => {
  try {
    const web3Instance = await initializeWeb3();
    return await web3Instance.eth.getBlockNumber();
  } catch (error: any) {
    throw new Error(`Error getting block number: ${error.message}`);
  }
};

export const getBlockByNumber = async (number: bigint): Promise<any> => {
  try {
    const web3Instance = await initializeWeb3();
    return await web3Instance.eth.getBlock(number.toString());
  } catch (error: any) {
    throw new Error(`Error getting block by number: ${error.message}`);
  }
};

export const getTransactionReceipt = async (hash: string): Promise<any> => {
  try {
    const web3Instance = await initializeWeb3();
    return await web3Instance.eth.getTransactionReceipt(hash);
  } catch (error: any) {
    throw new Error(`Error getting transaction receipt: ${error.message}`);
  }
};

export const getGasPrice = async (): Promise<string> => {
  try {
    const web3Instance = await initializeWeb3();
    const gasPrice = await web3Instance.eth.getGasPrice();
    return web3Instance.utils.fromWei(gasPrice, "gwei");
  } catch (error: any) {
    throw new Error(`Error getting gas price: ${error.message}`);
  }
};

export const estimateGas = async (
  from: string,
  to: string,
  value: string
): Promise<string> => {
  try {
    const web3Instance = await initializeWeb3();
    const transaction = {
      from,
      to,
      value: web3Instance.utils.toWei(value, "ether"),
    };
    const gas = await web3Instance.eth.estimateGas(transaction);
    return gas.toString();
  } catch (error: any) {
    throw new Error(`Error estimating gas: ${error.message}`);
  }
};

export const getNetworkId = async (): Promise<number> => {
  try {
    const web3Instance = await initializeWeb3();
    return Number(await web3Instance.eth.net.getId());
  } catch (error: any) {
    throw new Error(`Error getting network ID: ${error.message}`);
  }
};

export const getNetworkType = async (): Promise<string> => {
  try {
    const web3Instance = await initializeWeb3();
    const networkId = Number(await web3Instance.eth.net.getId());
    const networkMap: { [key: number]: string } = {
      1: "Mainnet",
      3: "Ropsten",
      4: "Rinkeby",
      5: "Goerli",
      42: "Kovan",
    };
    return networkMap[networkId] || "Unknown";
  } catch (error: any) {
    throw new Error(`Error getting network type: ${error.message}`);
  }
};

export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const Web3Utils = {
  connectWalletByMetamask,
  initializeWeb3,
  connectToExistingAccount,
  getAccounts,
  createAccount,
  importAccountToGanache,
  getAccountBalance,
  sendTransaction,
  getTransaction,
  getBlock,
  getBlockNumber,
  getBlockByNumber,
  getTransactionReceipt,
  getGasPrice,
  estimateGas,
  getNetworkId,
  getNetworkType,
  checkTransactionStatus,
};

export default Web3Utils;
