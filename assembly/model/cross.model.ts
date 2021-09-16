import { u128 } from "near-sdk-core";

@nearBindgen
export class DepositArgs {}

@nearBindgen
export class WithdrawArgs {
    value: String;
}
