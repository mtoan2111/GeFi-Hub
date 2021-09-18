import { u128 } from "near-sdk-core";
import { PoolStorage } from "../storage/pool.storage";
import { Token } from "./token.model";

@nearBindgen
export class Pool {
    private rate: f64;
    public name: String;
    constructor(public token1: Token, public token2: Token) {
        this.rate = 0;
        this.name = `${token1.name}_${token2.name}`;
    }

    save(): void {
        PoolStorage.set(``, this);
    }
}
