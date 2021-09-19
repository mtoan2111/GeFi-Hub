import { Context, logging, PersistentMap, PersistentSet, PersistentUnorderedMap, PersistentVector, u128 } from "near-sdk-core";
import { CrossDeposit, CrossWithdraw } from "../helper/cross.helper";
import { TokenStorage } from "../storage/token.storage";
import { UserStorage } from "../storage/user.storage";
import { UserTokenStorage } from "../storage/usertoken.storage";

@nearBindgen
export class UserToken {
    private balance: u128;
    constructor(public id: String, public name: String) {
        this.balance = u128.Zero;
    }

    getBalance(): u128 {
        return this.balance;
    }

    updateBalance(value: u128): void {
        this.balance = value;
    }
}

@nearBindgen
export class User {
    public id: String;

    constructor() {
        this.id = Context.sender;
    }

    addBalance(token: String, value: u128): u128 | null {
        const tokenExisted = TokenStorage.contain(token);
        if (!tokenExisted) {
            return null;
        }

        const tk_blc = TokenStorage.get(token);

        const usr_tokens = this._getToken();

        let tokenBalance = this._findToken(usr_tokens, token);

        if (tokenBalance == null) {
            tokenBalance = new UserToken(this.id, token);
            // usr_tokens.add(tokenBalance);
        }
        // u128.mul(tokenBalance.getBalance(), u128.fromF64(tk_blc.rate))
        let n_value = u128.mul(value, u128.fromF64(tk_blc.rate));
        CrossDeposit(tk_blc.ref, n_value);
        let new_balance = tokenBalance.getBalance();
        new_balance = u128.add(new_balance, n_value);
        // //TODO: Need to implement call back from contract promise then update user balance
        tokenBalance.updateBalance(new_balance);
        usr_tokens.set(tokenBalance.name, tokenBalance);
        this._setToken(usr_tokens);
        tk_blc.sub_balance(n_value);
        return new_balance;
    }

    subBalance(token: String, value: u128): u128 | null {
        const tokenExisted = TokenStorage.contain(token);
        if (!tokenExisted) {
            return null;
        }

        const tk_blc = TokenStorage.get(token);

        const usr_tokens = this._getToken();

        let tokenBalance = this._findToken(usr_tokens, token);
        if (tokenBalance == null) {
            return null;
        }
        let new_balance = tokenBalance.getBalance();
        if (u128.le(new_balance, value)) {
            return null;
        }
        let n_value = u128.div(value, u128.fromF64(tk_blc.rate));
        CrossWithdraw(tk_blc.ref, n_value);
        //TODO: Need to implement call back from contract promise then update user balance
        new_balance = u128.sub(new_balance, n_value);
        tokenBalance.updateBalance(new_balance);
        usr_tokens.set(tokenBalance.name, tokenBalance);
        this._setToken(usr_tokens);
        tk_blc.add_balance(n_value);
        return new_balance;
    }

    toString(): String {
        const tokens = this._getToken().values();
        let rets = `{"id": "${this.id}",`;
        let token = `"token": {`;
        for (let i = 0; i < tokens.length; i++) {
            token += `"${tokens[i].name}":${tokens[i].getBalance()}`;
            if (i < tokens.length - 1) {
                token += ",";
            }
        }
        token += `}`;
        rets += `${token}}`;
        return rets;
    }

    save(): void {
        UserStorage.set(this);
    }

    _getToken(): PersistentUnorderedMap<String, UserToken> {
        const serializeUserTokens = UserTokenStorage.get(this.id);

        if (serializeUserTokens == "") {
            return new PersistentUnorderedMap<String, UserToken>("ss2tt");
        }
        const tokens = serializeUserTokens.split(";");
        let rest = new PersistentUnorderedMap<String, UserToken>("ss2tt");
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i] != "") {
                const sz_token = tokens[i].split(":");
                let uTk = new UserToken(this.id, sz_token[0]);
                uTk.updateBalance(u128.from(sz_token[1]));
                rest.set(uTk.name, uTk);
            }
        }
        return rest;
    }

    _findToken(tokens: PersistentUnorderedMap<String, UserToken>, name: String): UserToken | null {
        if (!tokens.contains(name)) {
            return null;
        }
        return tokens.getSome(name);
    }

    _setToken(userToken: PersistentUnorderedMap<String, UserToken>): void {
        let tokens = userToken.values();
        let str = "";
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i] != null) {
                if (str != "") {
                    str += ";";
                }
                str += `${tokens[i].name}:${tokens[i].getBalance()}`;
            }
        }

        UserTokenStorage.set(this.id, str);
    }
}
