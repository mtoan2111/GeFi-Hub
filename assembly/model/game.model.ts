import { GameStorage } from "../storage/game.storage";
import { Space } from "./space.model";
import { Token } from "./token.model";

@nearBindgen
export class Game {
    public token: Token;
    constructor(public name: String, public symbol: String | null, public icon: String | null, public space: Space) {}

    register() {
        this.save();
    }

    update_token(token: Token) {
        if (!this.token.compare(token)) {
            this.token = token;
        }
        this.save();
    }

    update_symbol(symbol: String) {
        if (symbol != this.symbol) {
            this.symbol = symbol;
        }
        this.save();
    }

    update_icon(icon: String | null) {
        if (icon != this.icon) {
            this.icon = icon;
        }
        this.save();
    }

    save() {
        GameStorage.set(this.space.name, this);
    }
}
