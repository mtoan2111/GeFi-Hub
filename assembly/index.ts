import * as game from "./controller/product.controller";
import * as space from "./controller/space.controller";
import * as token from "./controller/token.controller";
import { Product } from "./model/product.model"
import { Space } from "./model/space.model";
import { Token } from "./model/token.model";
import { u128, ContractPromise } from "near-sdk-as";

export function gm_register(name: String, symbol: String, icon: String, space: String, token: String): Product | null {
    return game.gm_register(name, symbol, icon, space, token);
}

export function gm_unregisters(space: String): Product[] | null {
    return game.gm_unregisters(space);
}

export function gm_unregister(space: String, name: String): Product | null {
    return game.gm_unregister(space, name);
}

export function gm_update(space: String, name: String, symbol: String, icon: String): bool {
    return game.gm_update(space, name, symbol, icon);
}



export function sp_register(name: String, symbol: String, icon: String): Space | null {
    return space.sp_register(name, symbol, icon);
}

export function sp_unregisters(): Space[] | null {
    return space.sp_unregisters();
}

export function sp_unregister(name: String): Space | null {
    return space.sp_unregister(name);
}

export function sp_update(name: String, symbol: String, icon: String): bool {
    return space.sp_update(name, symbol, icon);
}



export function tk_register(name: String, symbol: String, icon: String): Token | null {
    return token.tk_register(name, symbol, icon);
}

export function tk_unregisters(): Token[] | null {
    return token.tk_unregisters();
}

export function tk_unregister(name: String): Token | null {
    return token.tk_unregister(name);
}

export function tk_update(name: String, symbol: String, icon: String): bool {
    return token.tk_update(name, symbol, icon);
}

export function get_rate(ownerId: String, name: String): f64 {
    return token.get_rate(ownerId, name);
}

export function buy_near(ownerId: String, name: String, amount: u128): ContractPromise | null {
    return token.buy_near(ownerId, name, amount);
}

export function buy_token(ownerId: String, name: String):  ContractPromise | null {
    return token.buy_token(ownerId, name);
}