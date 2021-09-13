import { Game } from "../model/game.model";
import { Token } from "../model/token.model";
import { Space } from "../model/space.model";
import { SpaceStorage } from "../storage/space.storage";
import { Context } from "near-sdk-core";
import { TokenStorage } from "../storage/token.storage";
import { GameStorage } from "../storage/game.storage";

export function gm_register(name: String, symbol: String, icon: String | null, space: String, token: String): String {
    if (GameStorage.contain(name)) {
        return 'This game already registered, please chose another name!';
    }
    let isSpace: Space | null = SpaceStorage.get(Context.sender, space);
    let isToken: Token | null = TokenStorage.get(Context.sender, token);
    let reg_game: Game;
    if (isSpace && isToken) {
        reg_game = new Game(name, symbol, icon, isSpace);
        reg_game.update_token(isToken);
        reg_game.register();
    } else if (!isSpace && isToken) {
        return 'Space Not Found!';
    } else if (isSpace && !isToken) {
        return 'Token Not Found!';
    }
    return 'Register Done!';
}

export function gm_unregisters(): Game[] | null {
    const ownerId = Context.sender;
    return GameStorage.deletes(ownerId);
}

export function gm_unregister(name: String): Game | null {
    const ownerId = Context.sender;
    return GameStorage.delete(ownerId, ownerId);
}

export function gm_update(name: String, symbol: String, icon: String | null): bool {
    const ownerId = Context.sender;
    const space = SpaceStorage.get(ownerId, name);
    if (space == null) {
        return false;
    }
    
    space.update_symbol(symbol);
    space.update_icon(icon);
    space.save();

    return true;
}