import { Game } from "../model/game.model";
import { Token } from "../model/token.model";
import { Space } from "../model/space.model";
import { SpaceStorage } from "../storage/space.storage";
import { Context } from "near-sdk-core";
import { TokenStorage } from "../storage/token.storage";
import { GameStorage } from "../storage/game.storage";

export function gm_register(name: String, symbol: String, icon: String, space: String, token: String): String {
    if (GameStorage.contain(space, name)) {
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
// Delete Space which included games
export function gm_unregisters(space: String): Game[] | null {
    let ownerId = Context.sender;
    let cr_space: SpaceStorage | null;
    if (SpaceStorage.contain(ownerId) && GameStorage.contains(space)) {
        return GameStorage.deletes(space);
    }
    return null;
}
// Delete a game
export function gm_unregister(space: String, name: String): Game[] | null {
    return GameStorage.delete(space, name);
}

export function gm_update(space: String, name: String, symbol: String, icon: String): bool {
    let game = GameStorage.get(space, name);
    if(!game) {
        return false;
    }
    game.update_icon(icon);
    game.update_symbol(symbol);
    game.save();
    GameStorage.set(space, game);
    return true;
}