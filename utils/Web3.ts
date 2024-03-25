import Web3 from "web3";

const SimpleStorageContractABI: any[] = [
    // ABI definition here
];

let web3: Web3 | undefined;
let isConnecting: boolean = false;

export const connectWalletByMetamask = async (): Promise<string> => {
    try {
        if (isConnecting) {
            throw new Error("Already processing eth_requestAccounts. Please wait.");
        }

        isConnecting = true;

        if (typeof window !== "undefined" && window.ethereum) {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const web3Instance = new Web3(window.ethereum);
            const [defaultAccount] = await web3Instance.eth.getAccounts();
            isConnecting = false;
            return defaultAccount;
        } else {
            isConnecting = false;
            throw new Error("Metamask not installed");
        }
    } catch (error: any) {
        isConnecting = false;
        throw new Error(`Error connecting wallet: ${error.message}`);
    }
};

export const initializeWeb3 = async (): Promise<Web3> => {
    if (!web3) {
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    return web3;
};

export const getAccounts = async (): Promise<string[]> => {
    try {
        const web3Instance = await initializeWeb3();
        return await web3Instance.eth.getAccounts();
    } catch (error: any) {
        throw new Error(`Error getting accounts: ${error.message}`);
    }
};

export const createAccount = async (): Promise<string> => {
    try {
        const web3Instance = await initializeWeb3();
        const account = web3Instance.eth.accounts.create();
        return account.address;
    } catch (error: any) {
        throw new Error(`Error creating account: ${error.message}`);
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
): Promise<string> => {
    try {
        const web3Instance = await initializeWeb3();
        const contract = new web3Instance.eth.Contract(SimpleStorageContractABI, to);
        const transaction = {
            from,
            to,
            value: web3Instance.utils.toWei(value, "ether"),
        };
        const gas = await web3Instance.eth.estimateGas(transaction);
        const options = {
            from,
            to,
            value: web3Instance.utils.toWei(value, "ether"),
            gas: gas.toString(),
        };
        const receipt = await contract.methods.set(options).send(options);
        return receipt.transactionHash;
    } catch (error: any) {
        throw new Error(`Error sending transaction: ${error.message}`);
    }
};

export const getTransaction = async (hash: string): Promise<any> => {
    try {
        const web3Instance = await initializeWeb3();
        return await web3Instance.eth.getTransaction(hash);
    } catch (error: any) {
        throw new Error(`Error getting transaction: ${error.message}`);
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
