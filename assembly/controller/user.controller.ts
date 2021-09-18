import { Context, u128 } from "near-sdk-core";
import { User } from "../model/user.model";
import { UserStorage } from "../storage/user.storage";

export function us_deposit(to: String): void {
    const userId = Context.sender;
    const userExisted = UserStorage.get(userId);
    if (userExisted == null) {
        let user = new User();
        user.addBalance(to, Context.attachedDeposit);
        user.save();
        return;
    }

    userExisted.addBalance(to, Context.attachedDeposit);
    userExisted.save();
    return;
}

export function us_withDraw(from: String, amount: u128): void {
    const userId = Context.sender;
    const userExisted = UserStorage.get(userId);
    if (userExisted == null) {
        return;
    }

    userExisted.subBalance(from, amount);
    userExisted.save();
    return;
}

export function us_get(): String | null {
    const userId = Context.sender;
    const user = UserStorage.get(userId);
    if (user != null){
        return user.toString();
    }

    return null;
}
