import Web3 from "web3";

let web3: Web3 | undefined;

export const initializeWeb3 = async (): Promise<Web3> => {
  if (!web3) {
    const provider = new Web3.providers.HttpProvider(
      "https://fluent-quick-gadget.quiknode.pro/9a76620cf31dd8c6e483f4a8c89fe2f934c803a6/"
    );
    web3 = new Web3(provider);
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

// Add similar functions for other operations (getBlock, estimateGas, etc.)

// Add other functions here...

// export const getBlock = async (hash: string): Promise<any> => {
//   // Ensure web3 is initialized
//   const web3Instance = await getWeb3();

//   // Get block details
//   const block = await web3Instance.eth.getBlock(hash);
//   return block;
// };

// export const getBlockNumber = async (): Promise<bigint> => {
//     // Ensure web3 is initialized
//     const web3Instance = await getWeb3();

//     // Get the latest block number
//     const blockNumber = await web3Instance.eth.getBlockNumber();
//     return blockNumber;
// };

// export const getBlockByNumber = async (number: bigint): Promise<any> => {
//     // Ensure web3 is initialized
//     const web3Instance = await getWeb3();

//     // Get block details
//     const block = await web3Instance.eth.getBlock(number.toString());
//     return block;
// };


// export const getTransactionReceipt = async (hash: string): Promise<any> => {
//     // Ensure web3 is initialized
//     const web3Instance = await getWeb3();

//     // Get transaction receipt
//     const receipt = await web3Instance.eth.getTransactionReceipt(hash);
//     return receipt;
// };

// export const getGasPrice = async (): Promise<string> => {
//     // Ensure web3 is initialized
//     const web3Instance = await getWeb3();

//     // Get the current gas price
//     const gasPrice = await web3Instance.eth.getGasPrice();
//     return web3Instance.utils.fromWei(gasPrice, "gwei");
// };

// export const estimateGas = async (
//   from: string,
//   to: string,
//   value: string
// ): Promise<string> => {
//     // Ensure web3 is initialized
//     const web3Instance = await getWeb3();

//     // Estimate gas for transaction
//     const transaction = {
//         from,
//         to,
//         value: web3Instance.utils.toWei(value, "ether"),
//     };
//     const gas = await web3Instance.eth.estimateGas(transaction);
//     return gas.toString();
// };

// export const getNetworkId = async (): Promise<number> => {
//     // Ensure web3 is initialized
//     const web3Instance = await getWeb3();

//     // Get the network ID
//     const networkId = await web3Instance.eth.net.getId();
//     return Number(networkId);
// };

// export const getNetworkType = async (): Promise<string> => {
//     // Ensure web3 is initialized
//     const web3Instance = await getWeb3();

//     // Get the network type
//     const networkType = await (web3Instance.eth.net as any).getNetworkType();
//     return networkType;
// };

// export const getNetworkName = async (): Promise<string> => {
//     // Ensure web3 is initialized
//     const web3Instance = await getWeb3();

//     // Get the network ID
//     const networkId = await web3Instance.eth.net.getId();

//     // Map network ID to network name
//     let networkName: string;
//     switch (Number(networkId)) {
//         case 1:
//             networkName = 'Mainnet';
//             break;
//         case 3:
//             networkName = 'Ropsten';
//             break;
//         case 4:
//             networkName = 'Rinkeby';
//             break;
//         case 5:
//             networkName = 'Goerli';
//             break;
//         case 42:
//             networkName = 'Kovan';
//             break;
//         default:
//             networkName = 'Unknown';
//             break;
//     }

//     return networkName;
// };
