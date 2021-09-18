import { Context, PersistentUnorderedMap, u128 } from "near-sdk-core";
import { CrossDeposit, CrossWithdraw } from "../helper/cross.helper";
import { TokenStorage } from "../storage/token.storage";
import { UserStorage } from "../storage/user.storage";

@nearBindgen
export class User {
    public id: String;
    public balance: PersistentUnorderedMap<String, u128>;

    constructor() {
        this.id = Context.sender;
        this.balance = new PersistentUnorderedMap<String, u128>(`${this.id}`);
    }

    addBalance(token: String, value: u128): u128 | null {
        const tokenExisted = TokenStorage.get(token);
        if (tokenExisted == null) {
            return null;
        }
        let tokenBalance: u128 = u128.Zero;
        let tmpToken = this.balance.get(token);
        if (tmpToken !== null) {
            tokenBalance = tmpToken;
        }
        CrossDeposit(tokenExisted.ref);
        //TODO: Need to implement call back from contract promise then update user balance
        tokenExisted.add_balance(value);
        u128.add(tokenBalance, value);

        return tokenBalance;
    }

    subBalance(token: String, value: u128): u128 | null {
        const tokenExisted = TokenStorage.get(token);
        if (tokenExisted == null) {
            return null;
        }
        let tokenBalance: u128 = u128.Zero;
        let tmpToken = this.balance.get(token);
        if (tmpToken !== null) {
            tokenBalance = tmpToken;
        } else {
            return null;
        }
        if (u128.ge(tokenBalance, value)) {
            return null;
        }

        CrossWithdraw(tokenExisted.ref, value);
        //TODO: Need to implement call back from contract promise then update user balance
        tokenExisted.sub_balance(value);
        u128.sub(tokenBalance, value);
        return tokenBalance;
    }

    save(): void {
        UserStorage.set(this);
    }
}
