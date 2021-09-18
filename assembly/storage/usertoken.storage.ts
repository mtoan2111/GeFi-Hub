import { PersistentUnorderedMap } from "near-sdk-core";

const gefi_usertk = new PersistentUnorderedMap<String, String>("__gftku");

export class UserTokenStorage {
    static get(userId: String): String {
        if (!gefi_usertk.contains(userId)) {
            gefi_usertk.set(userId, "");
            return "";
        }
        return gefi_usertk.getSome(userId);
    }

    static set(userId: String, balance: String): void {
        gefi_usertk.set(userId, balance);
    }

    static contains(userId: String): bool {
        return gefi_usertk.contains(userId);
    }
}
