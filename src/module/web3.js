import Web3 from "web3";

// const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
const web3 = new Web3(Web3.givenProvider);

export const WEB3 = {
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
};
