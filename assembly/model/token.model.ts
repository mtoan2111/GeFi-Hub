import { u128, u256 } from "near-sdk-core";
import { TokenStorage } from "../storage/token.storage";
import { Context } from "near-sdk-core"
const TRANSFORM_RATE: u128 = u128.fromString('1000000000');
@nearBindgen
export class Token {
    public rate: f64; // rate = token/near
    public balance: u128 = u128.Zero;
    public near_balance: u128 = u128.Zero; // For MVP product only
    private P: u128; // For MVP product only
    constructor(public name: String, public symbol: String, public icon: String) {
        this.rate = 0;
        this.near_balance = this.getTokenValue(Context.attachedDeposit);
        this.balance = this.near_balance;
        this.P = u128.mul(this.near_balance, this.balance);
    }

    // For MVP product only

    getWeiValue(value: u128): u128 {
        return u128.mul(value, TRANSFORM_RATE);
    }

    getTokenValue(value: u128): u128 {
        return u128.div(value, TRANSFORM_RATE);
    }

    add_near_balance(value: u128): u128 {
        let token_value = this.getTokenValue(value);
        this.near_balance = u128.add(this.near_balance, token_value);
        return this.getWeiValue(this.near_balance);
    }

    sub_near_balance(value: u128): u128 {
        let token_value = this.getTokenValue(value);
        // if (!u128.lt(token_value, this.near_balance)) {
        //     return this.near_balance;
        // }
        this.near_balance = u128.sub(this.near_balance, token_value);
        return this.getWeiValue(this.near_balance);
    }

    add_balance(value: u128): u128 {
        let token_value = this.getTokenValue(value);
        this.balance = u128.add(this.balance, token_value);
        return this.getWeiValue(this.balance);
    }

    sub_balance(value: u128): u128 {
        let token_value = this.getTokenValue(value);
        // if (!u128.lt(token_value, this.balance)) {
        //     return this.balance;
        // }
        this.balance = u128.sub(this.balance, token_value);
        return this.getWeiValue(this.balance);
    }

    get_rate(): f64 {
        this.rate = u128.div(this.balance, this.near_balance).toF64();
        return this.rate;
    }

    buy_near(amount: u128): void {
        let new_near_balance = this.sub_near_balance(amount);
        if (!new_near_balance) {
            return;
        }
        let spentToken: u128 = u128.sub(u128.div(this.P, new_near_balance), this.balance);
        this.add_balance(spentToken);
        this.save();
    }

    buy_token(amount: u128): void {
        let new_balance = this.sub_balance(amount);
        if (!new_balance) {
            return;
        }
        let spentNear: u128 = u128.sub(u128.div(this.P, new_balance), this.near_balance);
        this.add_near_balance(spentNear);
        this.save();
    }
    // -------------------

    update_rate(value: f64): void {
        if (this.rate != value && value > 0) {
            this.rate = value;
        }
    }

    update_symbol(symbol: String): void {
        if (this.symbol != symbol) {
            this.symbol = symbol;
        }
    }

    update_icon(icon: String): void {
        if (this.icon != icon) {
            this.icon = icon;
        }
    }

    compare(cp_token: Token): bool {
        if (this.name != cp_token.name) {
            return false;
        }

        if (this.symbol != cp_token.symbol) {
            return false;
        }

        if (this.icon != cp_token.icon) {
            return false;
        }

        if (this.rate != cp_token.rate) {
            return false;
        }

        return true;
    }

    save(): void {
        TokenStorage.set(Context.sender, this);
    }
}
