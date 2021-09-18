import { logging, PersistentSet, PersistentUnorderedMap } from "near-sdk-core";
import { User } from "../model/user.model";

const gefi_Users = new PersistentUnorderedMap<String, User>("_gtk");

export class UserStorage {
    static get(user: String): User | null {
        if (!gefi_Users.contains(user)) {
            return null;
        }
        return gefi_Users.getSome(user);
    }

    static gets(): User[] {
        return gefi_Users.values();
    }

    static set(user: User): void {
        gefi_Users.set(user.id, user);
    }

    static contains(user: String): bool {
        return gefi_Users.contains(user);
    }

    static delete(user: String): User | null {
        if (!gefi_Users.contains(user)) {
            return null;
        }
        const pm_user = gefi_Users.getSome(user);
        gefi_Users.delete(user);
        return pm_user;
    }
}
