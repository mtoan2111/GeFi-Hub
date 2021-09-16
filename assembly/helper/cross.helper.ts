import { ContractPromise, u128, Context, ContractPromiseBatch } from "near-sdk-core";
import { DepositArgs, WithdrawArgs } from "../model/cross.model";

const target_contract = "gefimatch.neutrino.testnet";
const GAS_AMOUNT = 100000000000000;

export function CrossDeposit(): ContractPromise {
    let args: DepositArgs = {};
    let promise = ContractPromise.create(target_contract, 'deposit', args.encode(), GAS_AMOUNT, Context.attachedDeposit);
    return promise;
}

export function CrossWithdraw(value: u128):ContractPromise {
    let args: WithdrawArgs = {
        value: value.toString()
    }
    let promise = ContractPromise.create(target_contract, 'withDraw', args.encode(), GAS_AMOUNT);
    // Send Near back for user
    ContractPromiseBatch.create(Context.sender).transfer(value);
    return promise;
}