import { Context } from "near-sdk-core";
import { SpaceStorage } from "../storage/space.storage";

@nearBindgen
export class Space {
    public owner: String;
    constructor(public name: String, public symbol: String, public icon: String) {
        this.owner = Context.sender;
    }

    update_symbol(symbol: String): void {
        if (symbol != this.symbol) {
            this.symbol = symbol;
        }
    }

    update_icon(icon: String): void {
        if (icon != this.icon) {
            this.icon = icon;
        }
    }

    save(): void {
        SpaceStorage.set(this.owner, this);
    }
}
