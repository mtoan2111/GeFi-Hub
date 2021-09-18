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
        let tokenBalance = this.balance.get(token);
        if (tokenBalance == null) {
            tokenBalance = u128.Zero;
        }
        CrossDeposit(tokenExisted.ref);
        //TODO: Need to implement call back from contract promise then update user balance
        u128.add(tokenBalance, value);

        return tokenBalance;
    }

    subBalance(token: String, value: u128): u128 | null {
        const tokenExisted = TokenStorage.get(token);
        if (tokenExisted == null) {
            return null;
        }
        let tokenBalance = this.balance.get(token);
        if (tokenBalance == null) {
            return null;
        }
        if (u128.ge(tokenBalance, value)) {
            return null;
        }

        CrossWithdraw(tokenExisted.ref, value);
        //TODO: Need to implement call back from contract promise then update user balance
        u128.sub(tokenBalance, value);
        return tokenBalance;
    }

    save(): void {
        UserStorage.set(this);
    }
}
