import { logging, PersistentSet, PersistentUnorderedMap } from "near-sdk-core";
import { Token } from "../model/token.model";

const gefi_Tokens = new PersistentUnorderedMap<String, Token>("_gtk");

export class TokenStorage {
    static get(owner: String, token: String): Token | null {
        if (!gefi_Tokens.contains(token)) {
            return null;
        }
        const pm_Token: Token = gefi_Tokens.getSome(owner);
        if (pm_Token.owner == owner) {
            return pm_Token;
        }
        return null;
    }

    static gets(owner: String): PersistentSet<Token> {
        const tokenLength = gefi_Tokens.length;
        const tokens = gefi_Tokens.values();
        const f_tokens = new PersistentSet<Token>("pms");
        for (let i = 0; i < tokenLength; i++) {
            if (tokens[i] != null && tokens[i].owner == owner) {
                f_tokens.add(tokens[i]);
            }
        }

        return f_tokens;
    }

    static set(token: Token): void {
        gefi_Tokens.set(token.name, token);
    }

    static contain(token: String): bool {
        return gefi_Tokens.contains(token);
    }

    static contains(owner: String, token: String): bool {
        if (!gefi_Tokens.contains(token)) {
            return false;
        }
        const pm_token = gefi_Tokens.getSome(token);
        if (pm_token.owner == owner) {
            return true;
        }
        return false;
    }

    static delete(owner: String, token: String): Token | null {
        if (!gefi_Tokens.contains(owner)) {
            return null;
        }
        const pm_Token = gefi_Tokens.getSome(token);
        if (pm_Token.owner != owner) {
            return null;
        }
        gefi_Tokens.delete(token);
        return pm_Token;
    }
}
