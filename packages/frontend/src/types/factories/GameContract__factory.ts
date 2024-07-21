/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { PayableOverrides } from "../common";
import type { GameContract, GameContractInterface } from "../GameContract";

const _abi = [
  {
    inputs: [],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "GameCalled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "winner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "prize",
        type: "uint256",
      },
    ],
    name: "GameEnded",
    type: "event",
  },
  {
    inputs: [],
    name: "CALL_COST",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "GAME_DURATION",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "call",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimPrize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getGameStatus",
    outputs: [
      {
        internalType: "address",
        name: "_lastCaller",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_lastCallTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_balance",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_isGameRunning",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lastCallTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lastCaller",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405267016345785d8a0000341461004e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610045906100b7565b60405180910390fd5b426001819055506100d7565b600082825260208201905092915050565b7f496e697469616c2066756e64696e67206d75737420626520302e312045544800600082015250565b60006100a1601f8361005a565b91506100ac8261006b565b602082019050919050565b600060208201905081810360008301526100d081610094565b9050919050565b610817806100e66000396000f3fe6080604052600436106100705760003560e01c8063382396ee1161004e578063382396ee146100d557806370740ac914610103578063bb7831fc1461011a578063c31b29ce1461014557610070565b80632113522a1461007557806328b5e32b146100a05780632cfc8aa1146100aa575b600080fd5b34801561008157600080fd5b5061008a610170565b60405161009791906104bf565b60405180910390f35b6100a8610194565b005b3480156100b657600080fd5b506100bf6102b1565b6040516100cc91906104f3565b60405180910390f35b3480156100e157600080fd5b506100ea6102bc565b6040516100fa9493929190610529565b60405180910390f35b34801561010f57600080fd5b50610118610308565b005b34801561012657600080fd5b5061012f610471565b60405161013c91906104f3565b60405180910390f35b34801561015157600080fd5b5061015a610477565b60405161016791906104f3565b60405180910390f35b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b662386f26fc1000034146101dd576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101d4906105cb565b60405180910390fd5b62015180600154426101ef919061061a565b1061022f576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102269061069a565b60405180910390fd5b336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550426001819055507fda007612ee4cae55bcdee414427b0bbb0403cbf0820b752c014973f7be56bb3f33346040516102a79291906106ba565b60405180910390a1565b662386f26fc1000081565b60008060008060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff166001544762015180600154426102f9919061061a565b10935093509350935090919293565b620151806001544261031a919061061a565b101561035b576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103529061072f565b60405180910390fd5b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146103e9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103e0906107c1565b60405180910390fd5b60004790503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015610434573d6000803e3d6000fd5b507fd4ba6fec82d9b0e8ffe50b9fed9e4be3b25c984ce1e0e016405a5528726e8a2c33826040516104669291906106ba565b60405180910390a150565b60015481565b6201518081565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006104a98261047e565b9050919050565b6104b98161049e565b82525050565b60006020820190506104d460008301846104b0565b92915050565b6000819050919050565b6104ed816104da565b82525050565b600060208201905061050860008301846104e4565b92915050565b60008115159050919050565b6105238161050e565b82525050565b600060808201905061053e60008301876104b0565b61054b60208301866104e4565b61055860408301856104e4565b610565606083018461051a565b95945050505050565b600082825260208201905092915050565b7f43616c6c20636f737420697320302e3031204554480000000000000000000000600082015250565b60006105b560158361056e565b91506105c08261057f565b602082019050919050565b600060208201905081810360008301526105e4816105a8565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610625826104da565b9150610630836104da565b9250828203905081811115610648576106476105eb565b5b92915050565b7f47616d652068617320656e646564000000000000000000000000000000000000600082015250565b6000610684600e8361056e565b915061068f8261064e565b602082019050919050565b600060208201905081810360008301526106b381610677565b9050919050565b60006040820190506106cf60008301856104b0565b6106dc60208301846104e4565b9392505050565b7f47616d65206973207374696c6c2072756e6e696e670000000000000000000000600082015250565b600061071960158361056e565b9150610724826106e3565b602082019050919050565b600060208201905081810360008301526107488161070c565b9050919050565b7f4f6e6c79206c6173742063616c6c65722063616e20636c61696d20746865207060008201527f72697a6500000000000000000000000000000000000000000000000000000000602082015250565b60006107ab60248361056e565b91506107b68261074f565b604082019050919050565b600060208201905081810360008301526107da8161079e565b905091905056fea264697066735822122097032c8afab7b4a1da419b9516cecfb4b5056ba1bff3611818241bef6409156764736f6c63430008180033";

type GameContractConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: GameContractConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class GameContract__factory extends ContractFactory {
  constructor(...args: GameContractConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: PayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: PayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      GameContract & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): GameContract__factory {
    return super.connect(runner) as GameContract__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): GameContractInterface {
    return new Interface(_abi) as GameContractInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): GameContract {
    return new Contract(address, _abi, runner) as unknown as GameContract;
  }
}