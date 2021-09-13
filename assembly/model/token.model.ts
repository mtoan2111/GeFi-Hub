import { u128 } from "near-sdk-core";
import { TokenStorage } from "../storage/token.storage";

@nearBindgen
export class Token {
    private rate: f64;
    constructor(public name: String, public symbol: String, public icon: String | null) {
        this.rate = 0;
    }

    update_rate(value: f64) {
        if (this.rate != value && value > 0) {
            this.rate = value;
        }
    }

    update_symbol(symbol: String) {
        if (this.symbol != symbol) {
            this.symbol = symbol;
        }
    }

    update_icon(icon: String | null) {
        if (this.icon != icon) {
            this.icon = icon;
        }
    }

    compare(cp_token: Token): bool {
        if (this.name != cp_token.name) {
            return false;
        }

        if (this.symbol != cp_token.symbol) {
            return false;
        }

        if (this.icon != cp_token.icon) {
            return false;
        }

        if (this.rate != cp_token.rate) {
            return false;
        }

        return true;
    }

    save() {
        TokenStorage.set(this.name, this);
    }
}
