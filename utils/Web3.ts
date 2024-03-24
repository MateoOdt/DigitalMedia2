import Web3 from "web3";

let web3: Web3 | undefined;
let isConnecting: boolean = false;

export const connectWalletByMetamask = async (): Promise<string> => {
  try {
    if (isConnecting) {
      throw new Error("Already processing eth_requestAccounts. Please wait.");
    }

    isConnecting = true;

    if (
      typeof window !== "undefined" &&
      typeof (window as any).ethereum !== "undefined"
    ) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const web3Instance = new Web3(window.ethereum);
      const defaultAccount = await web3Instance.eth.getAccounts();
      isConnecting = false;
      return defaultAccount[0];
    } else {
      isConnecting = false;
      throw new Error("Metamask not installed");
    }
  } catch (error) {
    isConnecting = false;
    throw new Error(`Error connecting wallet: ${error}`);
  }
};

export const initializeWeb3 = async (): Promise<Web3> => {
  if (!web3) {
    // Update to use Ganache RPC URL
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }
  return web3;
};

export const createAccount = async (): Promise<string> => {
  try {
    const web3Instance = await initializeWeb3();
    const account = web3Instance.eth.accounts.create();
    return account.address;
  } catch (error) {
    throw new Error(`Error creating account: ${error}`);
  }
};

export const getAccountBalance = async (address: string): Promise<string> => {
  try {
    const web3Instance = await initializeWeb3();
    const balance = await web3Instance.eth.getBalance(address);
    return web3Instance.utils.fromWei(balance, "ether");
  } catch (error) {
    throw new Error(`Error getting account balance: ${error}`);
  }
};

export const sendTransaction = async (
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
    const receipt = await web3Instance.eth.sendTransaction(transaction);
    return receipt.transactionHash.toString();
  } catch (error) {
    throw new Error(`Error sending transaction: ${error}`);
  }
};

export const getTransaction = async (hash: string): Promise<any> => {
  try {
    const web3Instance = await initializeWeb3();
    return await web3Instance.eth.getTransaction(hash);
  } catch (error) {
    throw new Error(`Error getting transaction: ${error}`);
  }
};

export const getBlock = async (hash: string): Promise<any> => {
  try {
    const web3Instance = await initializeWeb3();
    return await web3Instance.eth.getBlock(hash);
  } catch (error) {
    throw new Error(`Error getting block: ${error}`);
  }
};

export const getBlockNumber = async (): Promise<bigint> => {
  try {
    const web3Instance = await initializeWeb3();
    return await web3Instance.eth.getBlockNumber();
  } catch (error) {
    throw new Error(`Error getting block number: ${error}`);
  }
};

export const getBlockByNumber = async (number: bigint): Promise<any> => {
  try {
    const web3Instance = await initializeWeb3();
    return await web3Instance.eth.getBlock(number.toString());
  } catch (error) {
    throw new Error(`Error getting block by number: ${error}`);
  }
};

export const getTransactionReceipt = async (hash: string): Promise<any> => {
  try {
    const web3Instance = await initializeWeb3();
    return await web3Instance.eth.getTransactionReceipt(hash);
  } catch (error) {
    throw new Error(`Error getting transaction receipt: ${error}`);
  }
};

export const getGasPrice = async (): Promise<string> => {
  try {
    const web3Instance = await initializeWeb3();
    const gasPrice = await web3Instance.eth.getGasPrice();
    return web3Instance.utils.fromWei(gasPrice, "gwei");
  } catch (error) {
    throw new Error(`Error getting gas price: ${error}`);
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
  } catch (error) {
    throw new Error(`Error estimating gas: ${error}`);
  }
};

export const getNetworkId = async (): Promise<number> => {
  try {
    const web3Instance = await initializeWeb3();
    return Number(await web3Instance.eth.net.getId());
  } catch (error) {
    throw new Error(`Error getting network ID: ${error}`);
  }
};

export const getNetworkType = async (): Promise<string> => {
  try {
    const web3Instance = await initializeWeb3();
    const networkId = await web3Instance.eth.net.getId();
    let networkType: string;

    switch (Number(networkId)) {
      case 1:
        networkType = "Mainnet";
        break;
      case 3:
        networkType = "Ropsten";
        break;
      case 4:
        networkType = "Rinkeby";
        break;
      case 5:
        networkType = "Goerli";
        break;
      case 42:
        networkType = "Kovan";
        break;
      default:
        networkType = "Unknown";
        break;
    }

    return networkType;
  } catch (error) {
    console.error("Error getting network type:", error);
    throw new Error(`Error getting network type: ${error}`);
  }
};
