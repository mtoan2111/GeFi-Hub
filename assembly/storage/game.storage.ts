import { PersistentUnorderedMap } from "near-sdk-core";
import { Game } from "../model/game.model";
import { Space } from "../model/space.model";
import {Context} from "near-sdk-core";

// User => spaces => games
const gefi_Games = new PersistentUnorderedMap<String, PersistentUnorderedMap<String, PersistentUnorderedMap<String, Game>>>("gGm");
/**
 * spaces(games())
 */

export class GameStorage {
    static get(space: String, name: String): Game | null {
        let userId = Context.sender;
        if (!gefi_Games.contains(userId)) {
            return null;
        }
        let pm_games: PersistentUnorderedMap<String, PersistentUnorderedMap<String, Game>> = gefi_Games.getSome(userId);
        if (!pm_games.contains(space)) {
            return null;
        }
        let op_games: PersistentUnorderedMap<String, Game> = pm_games.getSome(space);
        if (!op_games.contains(name)) {
            return null;
        }
        return op_games.getSome(name);
    }

    static gets(space: String): Game[] | null {
        let userId = Context.sender;
        if (!gefi_Games.contains(userId)) {
            return null;
        }
        let pm_games: PersistentUnorderedMap<String, PersistentUnorderedMap<String, Game>> = gefi_Games.getSome(userId);
        if (!pm_games.contains(space)) {
            return null;
        }
        return pm_games.getSome(space).values();
    }

    static set(space: String, game: Game): void {
        let userId = Context.sender;
        if (!gefi_Games.contains(userId)) {
            let gm_spaces = new PersistentUnorderedMap<String, PersistentUnorderedMap<String, Game>>(`${space}::${game.name}`);
            gm_spaces.set(game.name, game);
            let pm_spaces = 
            gefi_Games.set(userId, pm_spaces);
            return;
        }
        const pm_spaces = gefi_Games.getSome(space);
        pm_spaces.set(game.name, game);
        gefi_Games.set(space, pm_spaces);
    }

    static contain(space: String, name: String): bool {
        return gefi_Games.getSome(space).contains(name);
    }

    static contains(space: String, name: String): bool {
        if (!gefi_Games.contains(space)) {
            return false;
        }
        return gefi_Games.getSome(space).contains(name);
    }

    static delete(space: String, name: String): Game[] | null {
        if (!gefi_Games.contains(space)) {
            return null;
        }
        const pm_spaces = gefi_Games.getSome(space);
        if (!pm_spaces.contains(name)) {
            return null;
        }
        pm_spaces.delete(name);
        return pm_spaces.values();
    }

    static deletes(space: String): Game[] | null {
        if (!gefi_Games.contains(space)) {
            return null;
        }
        const dl_spaces = gefi_Games.getSome(space).values();
        gefi_Games.delete(space);
        return dl_spaces;
    }
}
