import { Product } from "../model/product.model";
import { Token } from "../model/token.model";
import { Space } from "../model/space.model";
import { SpaceStorage } from "../storage/space.storage";
import { Context } from "near-sdk-core";
import { TokenStorage } from "../storage/token.storage";
import { ProductStorage } from "../storage/product.storage";

export function gm_register(name: String, symbol: String, icon: String, space: String, token: String): Product | null {
    if (ProductStorage.contain(space, name)) {
        return null;
    }
    let existedSpace: Space | null = SpaceStorage.get(Context.sender, space);
    if (existedSpace == null) {
        return null;
    }
    let existedToken: Token | null = TokenStorage.get(Context.sender, token);
    if (existedToken == null) {
        return null;
    }
    // let reg_game: Product;
    const reg_game = new Product(name, symbol, icon, existedSpace);
    reg_game.update_token(existedToken);
    reg_game.register();

    // if (isSpace && isToken) {

    // } else if (!isSpace && isToken) {
    // } else if (isSpace && !isToken) {
    // }
    return reg_game;
}
// Delete Space which included games
export function gm_unregisters(space: String): Product[] | null {
    let ownerId = Context.sender;
    let cr_space: SpaceStorage | null;
    if (SpaceStorage.contain(ownerId) && ProductStorage.contains(space)) {
        return ProductStorage.deletes(space);
    }
    return null;
}
// Delete a game
export function gm_unregister(space: String, name: String): Product | null {
    return ProductStorage.delete(space, name);
}

export function gm_update(space: String, name: String, symbol: String, icon: String): bool {
    let game = ProductStorage.get(space, name);
    if (!game) {
        return false;
    }
    game.update_icon(icon);
    game.update_symbol(symbol);
    game.save();
    // ProductStorage.set(space, game);
    return true;
}
