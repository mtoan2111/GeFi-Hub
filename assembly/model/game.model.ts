import { Space } from "./space.model";
import { Token } from "./token.model";

@nearBindgen
export class Game {
    public token: Token;
    constructor(public name: String, public symbol: String, public icon: String | null, public space: Space) {}

    update_token(token: Token) {
        if (!this.token.compare(token)) {
            this.token = token;
        }
    }
}
