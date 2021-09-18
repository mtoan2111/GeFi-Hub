import { Context } from "near-sdk-core";
import { Token } from "../model/token.model";
import { TokenStorage } from "../storage/token.storage";
import { u128, ContractPromise } from "near-sdk-core";
import { CrossDeposit, CrossWithdraw } from "../helper/cross.helper";

export function tk_register(name: String, symbol: String, icon: String): Token | null {
    const ownerId = Context.sender;
    if (TokenStorage.contain(ownerId) && TokenStorage.contains(ownerId, name)) {
        return TokenStorage.get(ownerId, name);
    }

    const new_token = new Token(name, symbol, icon);
    new_token.update_rate(1);
    new_token.save();
    return new_token;
}

export function tk_unregisters(): Token[] | null {
    const ownerId = Context.sender;
    return TokenStorage.deletes(ownerId);
}

export function tk_unregister(name: String): Token | null {
    const ownerId = Context.sender;
    return TokenStorage.delete(ownerId, name);
}

export function tk_update(name: String, symbol: String, icon: String): bool {
    const ownerId = Context.sender;
    const token = TokenStorage.get(ownerId, name);
    if (token == null) {
        return false;
    }

    token.update_symbol(symbol);
    token.update_icon(icon);
    token.save();

    return true;
}

export function get_rate(ownerId: String , name: String): f64{
    let token: Token | null;
    if (!TokenStorage.contain(ownerId) || !TokenStorage.contains(ownerId, name)) {
        return -1;
    }
    token = TokenStorage.get(ownerId, name);
    // Call something to confirmed user has transfered token
    if (!token) { return -1; }
    return token.get_rate();
};

// For MVP product only
export function buy_near(ownerId: String , name: String, amount: u128): ContractPromise | null {
    let token: Token | null;
    if (!TokenStorage.contain(ownerId) || !TokenStorage.contains(ownerId, name)) {
        return null;
    }
    token = TokenStorage.get(ownerId, name);
    // Call something to confirmed user has transfered token
    if (!token) { return null; }
    token.buy_near(amount);
    // TODO: Transfer near to sender
    return CrossWithdraw(amount);
}

export function buy_token(ownerId: String , name: String): ContractPromise | null {
    let token: Token | null;
    if (!TokenStorage.contain(ownerId) || !TokenStorage.contains(ownerId, name)) {
        return null;
    }
    token = TokenStorage.get(ownerId, name);
    if (!token) { return null; }
    let amount = Context.attachedDeposit;
    token.buy_token(amount);
    // TODO: Cross contract call to add token
    return CrossDeposit();
}