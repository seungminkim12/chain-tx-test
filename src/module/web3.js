import Web3 from "web3";

const web3 = new Web3(Web3.givenProvider);

export const WEB3 = {
  getAccounts: async () => {
    return await web3.eth.getAccounts();
  },
  Contract: async (ABICode) => {
    return new web3.eth.Contract(ABICode);
  },
  getTransactionCount: async (address) => {
    return await web3.eth.getTransactionCount(address);
  },
  privateKeyToAddress: async (privateKey) => {
    return web3.eth.accounts.privateKeyToAccount(privateKey);
  },
  signTransaction: async (transaction, pk) => {
    return await web3.eth.accounts.signTransaction(transaction, pk);
  },
  toWei: (amount) => {
    return web3.utils.toWei(amount);
  },
  toHex: (mixed) => {
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
