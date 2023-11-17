import Web3 from "web3";

const web3 = new Web3(Web3.givenProvider);

web3.eth.defaultAccount = process.env.REACT_APP_USER_ADDRESS;

export const WEB3 = {
  getAccounts: async () => {
    return await web3.eth.getAccounts();
  },
  Contract: async (ABICode, address) => {
    return new web3.eth.Contract(ABICode, address);
  },
  sendSignedTransaction: async (signedTx) => {
    return await web3.eth.sendSignedTransaction(signedTx);
  },
  estimateGas: async (txObj) => {
    return await web3.eth.estimateGas(txObj);
  },
  getCode: async (address) => {
    return await web3.eth.getCode(address);
  },
  getTransactionCount: async (address) => {
    return await web3.eth.getTransactionCount(address);
  },
  getBalance: async (address, block) => {
    return await web3.eth.getBalance(address);
  },
  getGasPrice: async () => {
    return await web3.eth.getGasPrice();
  },
  getDefaultAccount: () => {
    return web3.eth.Contract.defaultAccount;
  },
  getBalanceByDefaultAccount: async () => {
    const result = await web3.eth.getBalance(web3.eth.Contract.defaultAccount);
    return web3.utils.fromWei(result);
  },
  privateKeyToAddress: async (privateKey) => {
    return web3.eth.accounts.privateKeyToAccount(privateKey);
  },
  privateKeyToAccount: async (privateKey) => {
    return web3.eth.accounts.privateKeyToAccount(privateKey);
  },
  signTransaction: async (transaction, pk) => {
    return await web3.eth.accounts.signTransaction(transaction, pk);
  },
  toWei: (amount) => {
    return web3.utils.toWei(amount);
  },
  toHex: (mixed) => {
    console.log("mixed", mixed);
    return web3.utils.toHex(mixed);
  },
  fromWei: (wei) => {
    if (typeof wei === "number") {
      wei = String(wei);
    }
    return web3.utils.fromWei(wei, "ether");
  },
  fromDecimal: (number) => {
    return web3.utils.fromDecimal(number);
  },
  hexToNumber: (hex) => {
    return web3.utils.hexToNumber(hex);
  },
  isAddress: (address) => {
    return web3.utils.isAddress(address);
  },
};
