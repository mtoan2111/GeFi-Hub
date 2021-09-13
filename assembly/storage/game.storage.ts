import { PersistentUnorderedMap } from "near-sdk-core";
import { Game } from "../model/game.model";
import { Space } from "../model/space.model";

const gefi_Games = new PersistentUnorderedMap<String, PersistentUnorderedMap<String, Game>>("gGm");
/**
 * spaces(games())
 */

export class GameStorage {
    static get(space: String, name: String): Game | null {
        if (!gefi_Games.contains(space)) {
            return null;
        }
        const pm_games: PersistentUnorderedMap<String, Game> = gefi_Games.getSome(space);
        if (!pm_games.contains(space)) {
            return null;
        }

        return pm_games.getSome(space);
    }

    static gets(space: String): Game[] {
        if (!gefi_Games.contains(space)) {
            return new Array<Game>(0);
        }
        return gefi_Games.getSome(space).values();
    }

    static set(space: String, game: Game): void {
        if (!gefi_Games.contains(space)) {
            const pm_spaces = new PersistentUnorderedMap<String, Game>(`${space}::${game.name}`);
            pm_spaces.set(game.name, game);
            gefi_Games.set(space, pm_spaces);
            return;
        }
        const pm_spaces = gefi_Games.getSome(space);
        pm_spaces.set(game.name, game);
        gefi_Games.set(space, pm_spaces);
    }

    static contain(owner: String): bool {
        return gefi_Games.contains(owner);
    }

    static contains(owner: String, space: String): bool {
        if (!gefi_Games.contains(owner)) {
            return false;
        }
        return gefi_Games.getSome(owner).contains(space);
    }

    static delete(owner: String, space: String): Space | null {
        if (!gefi_Games.contains(owner)) {
            return null;
        }
        const pm_spaces = gefi_Games.getSome(owner);
        if (!pm_spaces.contains(space)) {
            return null;
        }
        const dl_space = pm_spaces.getSome(space);
        gefi_Games.delete(owner);
        return dl_space;
    }

    static deletes(owner: String): Space[] | null {
        if (!gefi_Games.contains(owner)) {
            return null;
        }
        const dl_spaces = gefi_Games.getSome(owner).values();
        gefi_Games.delete(owner);
        return dl_spaces;
    }
}
