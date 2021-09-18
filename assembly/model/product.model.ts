import { ProductStorage } from "../storage/product.storage";
import { Space } from "./space.model";
import { Token } from "./token.model";

@nearBindgen
export class Product {
    public token: Token;
    constructor(public name: String, public symbol: String, public icon: String, public space: Space) {}

    register(): void {
        this.save();
    }

    update_token(token: Token): void {
        if (!this.token.compare(token)) {
            this.token = token;
            this.save();
        }
    }

    update_symbol(symbol: String): void {
        if (symbol != this.symbol) {
            this.symbol = symbol;
            this.save();
        }
    }

    update_icon(icon: String): void {
        if (icon != this.icon) {
            this.icon = icon;
            this.save();
        }
    }

    save(): void {
        ProductStorage.set(this.space.name, this);
    }
}
