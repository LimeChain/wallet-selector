import isMobile from "is-mobile";
import { BN } from "bn.js";
import { utils, transactions as nearTransactions } from "near-api-js";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Action } from "../../../core/src";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { AddKeyPermission } from "../../../core/src/lib/wallet/transactions.types";

const parseNearAmount = utils.format.parseNearAmount;
const parseBigNumber = (value: string) => new BN(value);

const getAccessKey = (permission: AddKeyPermission) => {
  if (permission === "FullAccess") {
    return nearTransactions.fullAccessKey();
  }

  const { receiverId, methodNames = [] } = permission;
  const allowance = permission.allowance
    ? parseBigNumber(permission.allowance)
    : undefined;

  return nearTransactions.functionCallAccessKey(
    receiverId,
    methodNames,
    allowance
  );
};

const createAction = (actions: Array<Action>) => {
  return actions.map((action) => {
    switch (action.type) {
      case "CreateAccount":
        return nearTransactions.createAccount();
      case "DeployContract": {
        const { code } = action.params;

        return nearTransactions.deployContract(code);
      }
      case "FunctionCall": {
        const { methodName, args, gas, deposit } = action.params;

        return nearTransactions.functionCall(
          methodName,
          args,
          parseBigNumber(gas),
          parseBigNumber(deposit)
        );
      }
      case "Transfer": {
        const { deposit } = action.params;

        return nearTransactions.transfer(parseBigNumber(deposit));
      }
      case "Stake": {
        const { stake, publicKey } = action.params;

        return nearTransactions.stake(
          parseBigNumber(stake),
          utils.PublicKey.from(publicKey)
        );
      }
      case "AddKey": {
        const { publicKey, accessKey } = action.params;

        return nearTransactions.addKey(
          utils.PublicKey.from(publicKey),
          // TODO: Use accessKey.nonce? near-api-js seems to think 0 is fine?
          getAccessKey(accessKey.permission)
        );
      }
      case "DeleteKey": {
        const { publicKey } = action.params;

        return nearTransactions.deleteKey(utils.PublicKey.from(publicKey));
      }
      case "DeleteAccount": {
        const { beneficiaryId } = action.params;

        return nearTransactions.deleteAccount(beneficiaryId);
      }
      default:
        throw new Error("Invalid action type");
    }
  });
};
interface CreateTransactionParams {
  accountId: string;
  publicKey: string;
  receiverId: string;
  nonce: number;
  actions: Array<Action>;
  hash: string;
}

const createTransaction = ({
  accountId,
  publicKey,
  receiverId,
  nonce,
  actions,
  hash,
}: CreateTransactionParams) => {
  const tx = nearTransactions.createTransaction(
    accountId,
    utils.PublicKey.from(publicKey),
    receiverId,
    nonce,
    createAction(actions),
    utils.serialize.base_decode(hash)
  );

  return tx;
};

export { isMobile, parseNearAmount, parseBigNumber, createTransaction };
