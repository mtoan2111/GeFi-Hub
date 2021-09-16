import { PersistentUnorderedMap } from "near-sdk-core";
import { Token } from "../model/token.model";

const gefi_Tokens = new PersistentUnorderedMap<String, PersistentUnorderedMap<String, Token>>("gtk");

export class TokenStorage {
    static get(owner: String, token: String): Token | null {
        if (!gefi_Tokens.contains(owner)) {
            return null;
        }
        const pm_Tokens: PersistentUnorderedMap<String, Token> = gefi_Tokens.getSome(owner);
        if (!pm_Tokens.contains(token)) {
            return null;
        }

        return pm_Tokens.getSome(token);
    }

    static gets(owner: String): Token[] {
        if (!gefi_Tokens.contains(owner)) {
            return new Array<Token>(0);
        }
        return gefi_Tokens.getSome(owner).values();
    }

    static set(owner: String, token: Token): void {
        if (!gefi_Tokens.contains(owner)) {
            const pm_Tokens = new PersistentUnorderedMap<String, Token>(`${owner}::${token.name}`);
            pm_Tokens.set(token.name, token);
            gefi_Tokens.set(owner, pm_Tokens);
            return;
        }
        const pm_Tokens = gefi_Tokens.getSome(owner);
        pm_Tokens.set(token.name, token);
        gefi_Tokens.set(owner, pm_Tokens);
    }

    static contain(owner: String): bool {
        return gefi_Tokens.contains(owner);
    }

    static contains(owner: String, token: String): bool {
        if (!gefi_Tokens.contains(owner)) {
            return false;
        }
        return gefi_Tokens.getSome(owner).contains(token);
    }

    static delete(owner: String, token: String): Token | null {
        if (!gefi_Tokens.contains(owner)) {
            return null;
        }
        const pm_Tokens = gefi_Tokens.getSome(owner);
        if (!pm_Tokens.contains(token)) {
            return null;
        }
        const dl_Token = pm_Tokens.getSome(token);
        gefi_Tokens.delete(owner);
        return dl_Token;
    }

    static deletes(owner: String): Token[] | null {
        if (!gefi_Tokens.contains(owner)) {
            return null;
        }
        const dl_Tokens = gefi_Tokens.getSome(owner).values();
        gefi_Tokens.delete(owner);
        return dl_Tokens;
    }
}
