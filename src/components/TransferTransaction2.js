import React, { useState, useEffect } from "react";
import "./TransferTransaction2.css";
import BasicInput from "../componentLibrary/BasicInput";
import BasicButton from "../componentLibrary/BasicButton";
import { WEB3 } from "../module/web3";
import {
  SENDER_PRIVATE_KEY,
  SENDER_ADDRESS,
  SEND_AMOUNT,
  MY_MICRO_CHAIN_ID,
} from "../App";
import {
  getGasAction,
  getTransactionHashAction,
} from "action/transactionAction";
import {
  getTokenTransactionFromServer,
  getTransactionRecipientFromServer,
} from "server/dataAPI";
import { server } from "../server/utils/serverInstance";

const TransferTransaction2 = ({
  setTxReceipt,
  setIsList,
  isTokenBalance,
  defaultAddress,
  senderAddress,
  pk,
  isCoin,
  setIsCoin,
  setIsTransfer,
}) => {
  const targetChainId = MY_MICRO_CHAIN_ID;
  const [amount, setAmount] = useState("");
  const [receiveAddress, setRecieveAddress] = useState(
    process.env.REACT_APP_META_TARGET_ADDRESS
  );
  const [nonce, setNonce] = useState("");
  const [gasPrice, setGasPrice] = useState("");
  const [estimatedGas, setEstimatedGas] = useState("");
  const [contractByteCode, setContractByteCode] = useState("");

  const transferTransactionHandler = async () => {
    const data =
      "0x" +
      `61016060405234801562000011575f80fd5b506040518060400160405280600781526020017f4d79546f6b656e00000000000000000000000000000000000000000000000000815250806040518060400160405280600181526020017f31000000000000000000000000000000000000000000000000000000000000008152506040518060400160405280601081526020017f536d6b696d205465737420546f6b656e000000000000000000000000000000008152506040518060400160405280600381526020017f53545400000000000000000000000000000000000000000000000000000000008152508160039081620000fc91906200081d565b5080600490816200010e91906200081d565b50505062000127600583620001e760201b90919060201c565b610120818152505062000145600682620001e760201b90919060201c565b6101408181525050818051906020012060e08181525050808051906020012061010081815250504660a08181525050620001846200023c60201b60201c565b608081815250503073ffffffffffffffffffffffffffffffffffffffff1660c08173ffffffffffffffffffffffffffffffffffffffff1681525050505050620001e1336c01431e0fae6d7217caa00000006200029860201b60201c565b62000bec565b5f6020835110156200020c5762000204836200032260201b60201c565b905062000236565b826200021e836200038c60201b60201c565b5f0190816200022e91906200081d565b5060ff5f1b90505b92915050565b5f7f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60e0516101005146306040516020016200027d9594939291906200096f565b60405160208183030381529060405280519060200120905090565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036200030b575f6040517fec442f05000000000000000000000000000000000000000000000000000000008152600401620003029190620009ca565b60405180910390fd5b6200031e5f83836200039560201b60201c565b5050565b5f80829050601f815111156200037157826040517f305a27a900000000000000000000000000000000000000000000000000000000815260040162000368919062000a6f565b60405180910390fd5b8051816200037f9062000ac0565b5f1c175f1b915050919050565b5f819050919050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603620003e9578060025f828254620003dc919062000b5c565b92505081905550620004ba565b5f805f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205490508181101562000475578381836040517fe450d38c0000000000000000000000000000000000000000000000000000000081526004016200046c9392919062000b96565b60405180910390fd5b8181035f808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081905550505b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160362000503578060025f82825403925050819055506200054d565b805f808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051620005ac919062000bd1565b60405180910390a3505050565b5f81519050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f60028204905060018216806200063557607f821691505b6020821081036200064b576200064a620005f0565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f60088302620006af7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8262000672565b620006bb868362000672565b95508019841693508086168417925050509392505050565b5f819050919050565b5f819050919050565b5f62000705620006ff620006f984620006d3565b620006dc565b620006d3565b9050919050565b5f819050919050565b6200072083620006e5565b620007386200072f826200070c565b8484546200067e565b825550505050565b5f90565b6200074e62000740565b6200075b81848462000715565b505050565b5b818110156200078257620007765f8262000744565b60018101905062000761565b5050565b601f821115620007d1576200079b8162000651565b620007a68462000663565b81016020851015620007b6578190505b620007ce620007c58562000663565b83018262000760565b50505b505050565b5f82821c905092915050565b5f620007f35f1984600802620007d6565b1980831691505092915050565b5f6200080d8383620007e2565b9150826002028217905092915050565b6200082882620005b9565b67ffffffffffffffff811115620008445762000843620005c3565b5b6200085082546200061d565b6200085d82828562000786565b5f60209050601f83116001811462000893575f84156200087e578287015190505b6200088a858262000800565b865550620008f9565b601f198416620008a38662000651565b5f5b82811015620008cc57848901518255600182019150602085019450602081019050620008a5565b86831015620008ec5784890151620008e8601f891682620007e2565b8355505b6001600288020188555050505b505050505050565b5f819050919050565b620009158162000901565b82525050565b6200092681620006d3565b82525050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f62000957826200092c565b9050919050565b62000969816200094b565b82525050565b5f60a082019050620009845f8301886200090a565b6200099360208301876200090a565b620009a260408301866200090a565b620009b160608301856200091b565b620009c060808301846200095e565b9695505050505050565b5f602082019050620009df5f8301846200095e565b92915050565b5f82825260208201905092915050565b5f5b8381101562000a14578082015181840152602081019050620009f7565b5f8484015250505050565b5f601f19601f8301169050919050565b5f62000a3b82620005b9565b62000a478185620009e5565b935062000a59818560208601620009f5565b62000a648162000a1f565b840191505092915050565b5f6020820190508181035f83015262000a89818462000a2f565b905092915050565b5f81519050919050565b5f819050602082019050919050565b5f62000ab7825162000901565b80915050919050565b5f62000acc8262000a91565b8262000ad88462000a9b565b905062000ae58162000aaa565b9250602082101562000b285762000b237fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8360200360080262000672565b831692505b5050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f62000b6882620006d3565b915062000b7583620006d3565b925082820190508082111562000b905762000b8f62000b2f565b5b92915050565b5f60608201905062000bab5f8301866200095e565b62000bba60208301856200091b565b62000bc960408301846200091b565b949350505050565b5f60208201905062000be65f8301846200091b565b92915050565b60805160a05160c05160e051610100516101205161014051611b6e62000c3e5f395f610a1501525f6109da01525f610f0e01525f610eed01525f6108d801525f61092e01525f6109570152611b6e5ff3fe608060405234801561000f575f80fd5b50600436106100cd575f3560e01c806370a082311161008a57806395d89b411161006457806395d89b411461022d578063a9059cbb1461024b578063d505accf1461027b578063dd62ed3e14610297576100cd565b806370a08231146101a95780637ecebe00146101d957806384b0196e14610209576100cd565b806306fdde03146100d1578063095ea7b3146100ef57806318160ddd1461011f57806323b872dd1461013d578063313ce5671461016d5780633644e5151461018b575b5f80fd5b6100d96102c7565b6040516100e691906113de565b60405180910390f35b6101096004803603810190610104919061148f565b610357565b60405161011691906114e7565b60405180910390f35b610127610379565b604051610134919061150f565b60405180910390f35b61015760048036038101906101529190611528565b610382565b60405161016491906114e7565b60405180910390f35b6101756103b0565b6040516101829190611593565b60405180910390f35b6101936103b8565b6040516101a091906115c4565b60405180910390f35b6101c360048036038101906101be91906115dd565b6103c6565b6040516101d0919061150f565b60405180910390f35b6101f360048036038101906101ee91906115dd565b61040b565b604051610200919061150f565b60405180910390f35b61021161041c565b6040516102249796959493929190611708565b60405180910390f35b6102356104c1565b60405161024291906113de565b60405180910390f35b6102656004803603810190610260919061148f565b610551565b60405161027291906114e7565b60405180910390f35b610295600480360381019061029091906117de565b610573565b005b6102b160048036038101906102ac919061187b565b6106b8565b6040516102be919061150f565b60405180910390f35b6060600380546102d6906118e6565b80601f0160208091040260200160405190810160405280929190818152602001828054610302906118e6565b801561034d5780601f106103245761010080835404028352916020019161034d565b820191905f5260205f20905b81548152906001019060200180831161033057829003601f168201915b5050505050905090565b5f8061036161073a565b905061036e818585610741565b600191505092915050565b5f600254905090565b5f8061038c61073a565b9050610399858285610753565b6103a48585856107e5565b60019150509392505050565b5f6012905090565b5f6103c16108d5565b905090565b5f805f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20549050919050565b5f6104158261098b565b9050919050565b5f6060805f805f606061042d6109d1565b610435610a0c565b46305f801b5f67ffffffffffffffff81111561045457610453611916565b5b6040519080825280602002602001820160405280156104825781602001602082028036833780820191505090505b507f0f00000000000000000000000000000000000000000000000000000000000000959493929190965096509650965096509650965090919293949596565b6060600480546104d0906118e6565b80601f01602080910402602001604051908101604052809291908181526020018280546104fc906118e6565b80156105475780601f1061051e57610100808354040283529160200191610547565b820191905f5260205f20905b81548152906001019060200180831161052a57829003601f168201915b5050505050905090565b5f8061055b61073a565b90506105688185856107e5565b600191505092915050565b834211156105b857836040517f627913020000000000000000000000000000000000000000000000000000000081526004016105af919061150f565b60405180910390fd5b5f7f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c98888886105e68c610a47565b896040516020016105fc96959493929190611943565b6040516020818303038152906040528051906020012090505f61061e82610a9a565b90505f61062d82878787610ab3565b90508973ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16146106a157808a6040517f4b800e460000000000000000000000000000000000000000000000000000000081526004016106989291906119a2565b60405180910390fd5b6106ac8a8a8a610741565b50505050505050505050565b5f60015f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905092915050565b5f33905090565b61074e8383836001610ae1565b505050565b5f61075e84846106b8565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81146107df57818110156107d0578281836040517ffb8f41b20000000000000000000000000000000000000000000000000000000081526004016107c7939291906119c9565b60405180910390fd5b6107de84848484035f610ae1565b5b50505050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610855575f6040517f96c6fd1e00000000000000000000000000000000000000000000000000000000815260040161084c91906119fe565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036108c5575f6040517fec442f050000000000000000000000000000000000000000000000000000000081526004016108bc91906119fe565b60405180910390fd5b6108d0838383610cb0565b505050565b5f7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163073ffffffffffffffffffffffffffffffffffffffff1614801561095057507f000000000000000000000000000000000000000000000000000000000000000046145b1561097d577f00000000000000000000000000000000000000000000000000000000000000009050610988565b610985610ec9565b90505b90565b5f60075f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20549050919050565b6060610a0760057f0000000000000000000000000000000000000000000000000000000000000000610f5e90919063ffffffff16565b905090565b6060610a4260067f0000000000000000000000000000000000000000000000000000000000000000610f5e90919063ffffffff16565b905090565b5f60075f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f815480929190600101919050559050919050565b5f610aac610aa66108d5565b8361100b565b9050919050565b5f805f80610ac38888888861104b565b925092509250610ad38282611132565b829350505050949350505050565b5f73ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1603610b51575f6040517fe602df05000000000000000000000000000000000000000000000000000000008152600401610b4891906119fe565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610bc1575f6040517f94280d62000000000000000000000000000000000000000000000000000000008152600401610bb891906119fe565b60405180910390fd5b8160015f8673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20819055508015610caa578273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051610ca1919061150f565b60405180910390a35b50505050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610d00578060025f828254610cf49190611a44565b92505081905550610dce565b5f805f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905081811015610d89578381836040517fe450d38c000000000000000000000000000000000000000000000000000000008152600401610d80939291906119c9565b60405180910390fd5b8181035f808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081905550505b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610e15578060025f8282540392505081905550610e5f565b805f808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610ebc919061150f565b60405180910390a3505050565b5f7f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f7f00000000000000000000000000000000000000000000000000000000000000007f00000000000000000000000000000000000000000000000000000000000000004630604051602001610f43959493929190611a77565b60405160208183030381529060405280519060200120905090565b606060ff5f1b8314610f7a57610f7383611294565b9050611005565b818054610f86906118e6565b80601f0160208091040260200160405190810160405280929190818152602001828054610fb2906118e6565b8015610ffd5780601f10610fd457610100808354040283529160200191610ffd565b820191905f5260205f20905b815481529060010190602001808311610fe057829003601f168201915b505050505090505b92915050565b5f6040517f190100000000000000000000000000000000000000000000000000000000000081528360028201528260228201526042812091505092915050565b5f805f7f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0845f1c1115611087575f600385925092509250611128565b5f6001888888886040515f81526020016040526040516110aa9493929190611ac8565b6020604051602081039080840390855afa1580156110ca573d5f803e3d5ffd5b5050506020604051035190505f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff160361111b575f60015f801b93509350935050611128565b805f805f1b935093509350505b9450945094915050565b5f600381111561114557611144611b0b565b5b82600381111561115857611157611b0b565b5b0315611290576001600381111561117257611171611b0b565b5b82600381111561118557611184611b0b565b5b036111bc576040517ff645eedf00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600260038111156111d0576111cf611b0b565b5b8260038111156111e3576111e2611b0b565b5b0361122757805f1c6040517ffce698f700000000000000000000000000000000000000000000000000000000815260040161121e919061150f565b60405180910390fd5b60038081111561123a57611239611b0b565b5b82600381111561124d5761124c611b0b565b5b0361128f57806040517fd78bce0c00000000000000000000000000000000000000000000000000000000815260040161128691906115c4565b60405180910390fd5b5b5050565b60605f6112a083611306565b90505f602067ffffffffffffffff8111156112be576112bd611916565b5b6040519080825280601f01601f1916602001820160405280156112f05781602001600182028036833780820191505090505b5090508181528360208201528092505050919050565b5f8060ff835f1c169050601f81111561134b576040517fb3512b0c00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b80915050919050565b5f81519050919050565b5f82825260208201905092915050565b5f5b8381101561138b578082015181840152602081019050611370565b5f8484015250505050565b5f601f19601f8301169050919050565b5f6113b082611354565b6113ba818561135e565b93506113ca81856020860161136e565b6113d381611396565b840191505092915050565b5f6020820190508181035f8301526113f681846113a6565b905092915050565b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f61142b82611402565b9050919050565b61143b81611421565b8114611445575f80fd5b50565b5f8135905061145681611432565b92915050565b5f819050919050565b61146e8161145c565b8114611478575f80fd5b50565b5f8135905061148981611465565b92915050565b5f80604083850312156114a5576114a46113fe565b5b5f6114b285828601611448565b92505060206114c38582860161147b565b9150509250929050565b5f8115159050919050565b6114e1816114cd565b82525050565b5f6020820190506114fa5f8301846114d8565b92915050565b6115098161145c565b82525050565b5f6020820190506115225f830184611500565b92915050565b5f805f6060848603121561153f5761153e6113fe565b5b5f61154c86828701611448565b935050602061155d86828701611448565b925050604061156e8682870161147b565b9150509250925092565b5f60ff82169050919050565b61158d81611578565b82525050565b5f6020820190506115a65f830184611584565b92915050565b5f819050919050565b6115be816115ac565b82525050565b5f6020820190506115d75f8301846115b5565b92915050565b5f602082840312156115f2576115f16113fe565b5b5f6115ff84828501611448565b91505092915050565b5f7fff0000000000000000000000000000000000000000000000000000000000000082169050919050565b61163c81611608565b82525050565b61164b81611421565b82525050565b5f81519050919050565b5f82825260208201905092915050565b5f819050602082019050919050565b6116838161145c565b82525050565b5f611694838361167a565b60208301905092915050565b5f602082019050919050565b5f6116b682611651565b6116c0818561165b565b93506116cb8361166b565b805f5b838110156116fb5781516116e28882611689565b97506116ed836116a0565b9250506001810190506116ce565b5085935050505092915050565b5f60e08201905061171b5f83018a611633565b818103602083015261172d81896113a6565b9050818103604083015261174181886113a6565b90506117506060830187611500565b61175d6080830186611642565b61176a60a08301856115b5565b81810360c083015261177c81846116ac565b905098975050505050505050565b61179381611578565b811461179d575f80fd5b50565b5f813590506117ae8161178a565b92915050565b6117bd816115ac565b81146117c7575f80fd5b50565b5f813590506117d8816117b4565b92915050565b5f805f805f805f60e0888a0312156117f9576117f86113fe565b5b5f6118068a828b01611448565b97505060206118178a828b01611448565b96505060406118288a828b0161147b565b95505060606118398a828b0161147b565b945050608061184a8a828b016117a0565b93505060a061185b8a828b016117ca565b92505060c061186c8a828b016117ca565b91505092959891949750929550565b5f8060408385031215611891576118906113fe565b5b5f61189e85828601611448565b92505060206118af85828601611448565b9150509250929050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f60028204905060018216806118fd57607f821691505b6020821081036119105761190f6118b9565b5b50919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b5f60c0820190506119565f8301896115b5565b6119636020830188611642565b6119706040830187611642565b61197d6060830186611500565b61198a6080830185611500565b61199760a0830184611500565b979650505050505050565b5f6040820190506119b55f830185611642565b6119c26020830184611642565b9392505050565b5f6060820190506119dc5f830186611642565b6119e96020830185611500565b6119f66040830184611500565b949350505050565b5f602082019050611a115f830184611642565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f611a4e8261145c565b9150611a598361145c565b9250828201905080821115611a7157611a70611a17565b5b92915050565b5f60a082019050611a8a5f8301886115b5565b611a9760208301876115b5565b611aa460408301866115b5565b611ab16060830185611500565b611abe6080830184611642565b9695505050505050565b5f608082019050611adb5f8301876115b5565b611ae86020830186611584565b611af560408301856115b5565b611b0260608301846115b5565b95945050505050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602160045260245ffdfea26469706673582212201f275924214748b1825c49bfe79ab80c0054b79ab0d904496a24a6c68c28a43c64736f6c63430008160033`;

    //gas
    const gasResult = await WEB3.estimateGas({
      from: senderAddress,
      gasPrice,
      data,
    });
    console.log("gasResult", gasResult);
    // setEstimatedGas(gasResult);
    //value
    const signTransactionResult = await WEB3.signTransaction(
      {
        nonce,
        gasPrice,
        gas: gasResult,
        data: encodeParameter,
      },
      pk
    );
    const rawTransaction = signTransactionResult.rawTransaction;
    console.log("rawTransaction: ", rawTransaction);
    console.log("signTransactionResult", signTransactionResult);
    setTimeout(async () => {
      console.log("timeout in");
      const txResult = await WEB3.sendSignedTransaction(rawTransaction);
      console.log("txResult: ", txResult);
      if (txResult) {
        setIsTransfer(true);
      }
    }, 2000);
  };

  let encodeParameter = null;

  const sendTransactionHandler = async () => {
    if (!isCoin) {
      const amountToHex = WEB3.toHex(WEB3.toWei(amount));
      //token
      //ABICode
      const ABICode = await server
        .get(
          `/api/v2/contracts/address/${process.env.REACT_APP_CONTRACT_ADDRESS}/abi-code?microChainId=${MY_MICRO_CHAIN_ID}`
        )
        .then((res) => res.data);
      console.log("ABICode", ABICode);
      //contract
      const contract = await WEB3.Contract(
        ABICode,
        process.env.REACT_APP_META_CONTRACT_ADDRESS
      );
      console.log("contract", contract);

      const tansferParameter = [receiveAddress, amountToHex];
      console.log("tansferParameter", tansferParameter);
      encodeParameter = contract.methods["transfer"](
        ...tansferParameter
      ).encodeABI();

      console.log("encodeParameter: ", encodeParameter);
      // console.log("contractResult: ", contractResult);
      //transfer
      //transfer function call
      //data
    }
    console.log(
      "isCoin ? receiveAddress : process.env.REACT_APP_META_CONTRACT_ADDRESS",
      isCoin ? receiveAddress : process.env.REACT_APP_META_CONTRACT_ADDRESS
    );
    console.log("encodeParameter", encodeParameter);
    console.log("senderAddress", senderAddress);
    //gas
    const gasResult = await WEB3.estimateGas({
      from: senderAddress,
      value: isCoin ? WEB3.toHex(WEB3.toWei(amount)) : null,
      to: isCoin ? receiveAddress : process.env.REACT_APP_META_CONTRACT_ADDRESS,
      gasPrice,
      data: encodeParameter,
    });
    console.log("gasResult", gasResult);
    // setEstimatedGas(gasResult);
    //value
    const signTransactionResult = await WEB3.signTransaction(
      {
        nonce,
        gasPrice,
        gas: gasResult,
        value: isCoin ? WEB3.toHex(WEB3.toWei(amount)) : null,
        to: isCoin
          ? receiveAddress
          : process.env.REACT_APP_META_CONTRACT_ADDRESS,
        data: encodeParameter,
        // maxFeePerGas: 30000000,
      },
      pk
    );
    const rawTransaction = signTransactionResult.rawTransaction;
    console.log("rawTransaction: ", rawTransaction);
    console.log("signTransactionResult", signTransactionResult);
    setTimeout(async () => {
      const txResult = await WEB3.sendSignedTransaction(rawTransaction);
      console.log("txResult: ", txResult);
      if (txResult) {
        setIsTransfer(true);
      }
    }, 2000);
  };

  const getGasPrice = async () => {
    const result = await WEB3.getGasPrice();
    console.log("gas", result);
    console.log("gas", WEB3.fromWei(result));
    // setGasPrice(30000000);
    setGasPrice(result);
  };

  const getNonce = async () => {
    const result = await WEB3.getTransactionCount(senderAddress);
    console.log("result: ", result);
    setNonce(result);
  };

  useEffect(() => {
    //nonce
    getNonce();
    //gasPrice
    getGasPrice();
  }, []);

  return (
    <div className="transaction-input-wrapper">
      <BasicInput
        type="checkbox"
        checked={isCoin}
        onChangeFunc={() => setIsCoin(!isCoin)}
      />
      {isCoin ? "coin" : "token"}
      <BasicInput
        type="text"
        className="transactipn-input"
        value={receiveAddress}
        onChangeFunc={(e) => setRecieveAddress(e.target.value)}
      />
      <BasicInput
        type="text"
        className="transaction-value-input"
        value={amount}
        placeholder="Amount"
        onChangeFunc={(e) => setAmount(e.target.value)}
      />
      <BasicButton
        className="transaction-button"
        value="Transfer"
        onClickFunc={sendTransactionHandler}
      />
      <div className="transfer-tx-container">
        <BasicInput
          type={"text"}
          className={""}
          value={contractByteCode}
          onChangeFunc={(e) => setContractByteCode(e.target.value)}
        />
        <BasicButton
          className="transfer-transaction-button"
          value="Transfer"
          onClickFunc={transferTransactionHandler}
        />
      </div>
    </div>
  );
};

export default TransferTransaction2;