import { ContractPromise, u128, Context, ContractPromiseBatch } from "near-sdk-core";
import { DepositArgs, WithdrawArgs } from "../model/cross.model";

// const target_contract = "gefimatch.neutrino.testnet";
const GAS_AMOUNT = 100000000000000;

export function CrossDeposit(target_contract: String): ContractPromise {
    let args: DepositArgs = {};
    let promise = ContractPromise.create(target_contract.toString(), "deposit", args.encode(), GAS_AMOUNT, Context.attachedDeposit);
    return promise;
}

export function CrossWithdraw(target_contract: String, value: u128): ContractPromiseBatch {
    let args: WithdrawArgs = {
        value: value.toString(),
    };
    let promise = ContractPromise.create(target_contract.toString(), "withDraw", args.encode(), GAS_AMOUNT);
    // Send Near back for user
    return ContractPromiseBatch.create(Context.sender).transfer(value);
    // return promise;
}
