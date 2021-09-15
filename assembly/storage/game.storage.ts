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
        let games = new PersistentUnorderedMap<String, Game>(`games`);
        games.set(game.name, game);
        if (!gefi_Games.contains(userId)) {
            let gm_spaces = new PersistentUnorderedMap<String, PersistentUnorderedMap<String, Game>>(`${space}`);
            gm_spaces.set(space, games);
            gefi_Games.set(userId, gm_spaces);
            return;
        }
        let usr_spaces = gefi_Games.getSome(userId);
        usr_spaces.set(space, games);
    }

    static contain(space: String, name: String): bool {
        let userId = Context.sender;
        if (!gefi_Games.contains(userId) || !gefi_Games.getSome(userId).contains(space)) {
            return false;
        }
        return gefi_Games.getSome(userId).getSome(space).contains(name);
    }

    static contains(space: String): bool {
        let userId = Context.sender;
        if (!gefi_Games.contains(userId) || !gefi_Games.getSome(userId).contains(space)) {
            return false;
        }
        return gefi_Games.getSome(userId).contains(space);
    }

    static delete(space: String, name: String): Game[] | null {
        let userId = Context.sender;
        if (!gefi_Games.contains(userId)) {
            return null;
        }
        const pm_spaces = gefi_Games.getSome(userId);
        if (!pm_spaces.contains(space)) {
            return null;
        }
        pm_spaces.getSome(space).delete(name);
        return pm_spaces.getSome(space).values();
    }

    static deletes(space: String): Game[] | null {
        let userId = Context.sender;
        if (!gefi_Games.contains(userId)) {
            return null;
        }
        const dl_spaces = gefi_Games.getSome(userId).getSome(space).values();
        gefi_Games.getSome(userId).delete(space);
        return dl_spaces;
    }
}
