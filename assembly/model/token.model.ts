import { u128, u256 } from "near-sdk-core";
import { TokenStorage } from "../storage/token.storage";
import { Context } from "near-sdk-core"

@nearBindgen
export class Token {
    public rate: f64; // rate = token/near
    public balance: u128;
    public near_balance: u128; // For MVP product only
    private P: u128; // For MVP product only
    constructor(public name: String, public symbol: String, public icon: String | null) {
        this.rate = 0;
        this.near_balance = Context.attachedDeposit;
        this.balance = this.near_balance;
        this.P = u128.mul(this.near_balance, this.balance);
    }

    // For MVP product only
    add_near_balance(value: u128): u128 {
        return this.near_balance = u128.add(this.near_balance, value);
    }

    sub_near_balance(value: u128): u128 {
        if (!u128.lt(value, this.near_balance)) {
            return this.near_balance;
        }
        return this.near_balance = u128.sub(this.near_balance, value);
    }

    add_balance(value: u128): u128 {
        return this.balance = u128.add(this.balance, value);
    }

    sub_balance(value: u128): u128 {
        if (!u128.lt(value, this.balance)) {
            return this.balance;
        }
        return this.balance = u128.sub(this.balance, value);
    }

    get_rate(): f64 {
        this.rate = u128.div(this.balance, this.near_balance).toF64();
        return this.rate;
    }

    buy_near(amount: u128) {
        let new_near_balance = this.sub_near_balance(amount);
        let spentToken: u128 = u128.sub(u128.div(this.P, new_near_balance), this.balance);
        this.add_balance(spentToken);
        this.save();
    }

    buy_token(amount: u128) {
        let new_balance = this.sub_balance(amount);
        let spentNear: u128 = u128.sub(u128.div(this.P, new_balance), this.near_balance);
        this.add_near_balance(spentNear);
        this.save();
    }
    // -------------------

    update_rate(value: f64) {
        if (this.rate != value && value > 0) {
            this.rate = value;
        }
    }

    update_symbol(symbol: String) {
        if (this.symbol != symbol) {
            this.symbol = symbol;
        }
    }

    update_icon(icon: String | null) {
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

    save() {
        TokenStorage.set(this.name, this);
    }
}
