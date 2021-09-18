import { PersistentUnorderedMap } from "near-sdk-core";
import { Pool } from "../model/pool.model";

const gefi_Tokens = new PersistentUnorderedMap<String, PersistentUnorderedMap<String, Pool>>("gtk");

export class PoolStorage {
    static get(owner: String, pool: String): Pool | null {
        if (!gefi_Tokens.contains(owner)) {
            return null;
        }
        const pm_Tokens: PersistentUnorderedMap<String, Pool> = gefi_Tokens.getSome(owner);
        if (!pm_Tokens.contains(pool)) {
            return null;
        }

        return pm_Tokens.getSome(pool);
    }

    static gets(owner: String): Pool[] {
        if (!gefi_Tokens.contains(owner)) {
            return new Array<Pool>(0);
        }
        return gefi_Tokens.getSome(owner).values();
    }

    static set(owner: String, pool: Pool): void {
        if (!gefi_Tokens.contains(owner)) {
            const pm_Tokens = new PersistentUnorderedMap<String, Pool>(`${owner}::${pool}`);
            pm_Tokens.set(pool.name, pool);
            gefi_Tokens.set(owner, pm_Tokens);
            return;
        }
        const pm_Tokens = gefi_Tokens.getSome(owner);
        pm_Tokens.set(pool.name, pool);
        gefi_Tokens.set(owner, pm_Tokens);
    }

    static contain(owner: String): bool {
        return gefi_Tokens.contains(owner);
    }

    static contains(owner: String, pool: String): bool {
        if (!gefi_Tokens.contains(owner)) {
            return false;
        }
        return gefi_Tokens.getSome(owner).contains(pool);
    }

    static delete(owner: String, pool: String): Pool | null {
        if (!gefi_Tokens.contains(owner)) {
            return null;
        }
        const pm_Tokens = gefi_Tokens.getSome(owner);
        if (!pm_Tokens.contains(pool)) {
            return null;
        }
        const dl_Token = pm_Tokens.getSome(pool);
        gefi_Tokens.delete(owner);
        return dl_Token;
    }

    static deletes(owner: String): Pool[] | null {
        if (!gefi_Tokens.contains(owner)) {
            return null;
        }
        const dl_Tokens = gefi_Tokens.getSome(owner).values();
        gefi_Tokens.delete(owner);
        return dl_Tokens;
    }
}
