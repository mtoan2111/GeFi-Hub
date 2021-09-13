import { Context } from "near-sdk-core";
import { SpaceStorage } from "../storage/space.storage";

@nearBindgen
export class Space {
    public owner: String;
    constructor(public name: String, public symbol: String, public icon: String | null) {
        this.owner = Context.sender;
    }

    update_symbol(symbol: String) {
        if (symbol != this.symbol) {
            this.symbol = symbol;
        }
    }

    update_icon(icon: String | null) {
        if (icon != this.icon) {
            this.icon = icon;
        }
    }

    save() {
        SpaceStorage.set(this.owner, this);
    }
}
