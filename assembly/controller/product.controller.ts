import { Product } from "../model/product.model";
import { Token } from "../model/token.model";
import { Space } from "../model/space.model";
import { SpaceStorage } from "../storage/space.storage";
import { Context } from "near-sdk-core";
import { TokenStorage } from "../storage/token.storage";
import { ProductStorage } from "../storage/product.storage";

export function gm_register(name: String, symbol: String, icon: String, space: String, token: String): Product | null {
    const ownerId = Context.sender;
    if (ProductStorage.contain(name)) {
        return null;
    }
    let existedSpace: Space | null = SpaceStorage.get(Context.sender, space);
    if (existedSpace == null) {
        return null;
    }
    let existedToken: Token | null = TokenStorage.get(token);
    if (existedToken == null) {
        return null;
    }
    // let reg_game: Product;
    const reg_game = new Product(name, symbol, icon, existedSpace);
    reg_game.update_token(existedToken);
    reg_game.register();

    return reg_game;
}

// Delete a product
export function gm_unregister(space: String, name: String): Product | null {
    const ownerId = Context.sender;
    return ProductStorage.delete(ownerId, space, name);
}

export function gm_update(space: String, name: String, symbol: String, icon: String): bool {
    const ownerId = Context.sender;
    let product = ProductStorage.get(ownerId, space, name);
    if (!product) {
        return false;
    }
    product.update_icon(icon);
    product.update_symbol(symbol);
    product.save();
    // ProductStorage.set(space, game);
    return true;
}
