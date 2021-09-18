import { PersistentSet, PersistentUnorderedMap } from "near-sdk-core";
import { Space } from "../model/space.model";

// const gefi_Spaces = new PersistentUnorderedMap<String, PersistentUnorderedMap<String, Space>>("gSp");

// export class SpaceStorage {
//     static get(owner: String, space: String): Space | null {
//         if (!gefi_Spaces.contains(owner)) {
//             return null;
//         }
//         const pm_spaces: PersistentUnorderedMap<String, Space> = gefi_Spaces.getSome(owner);
//         if (!pm_spaces.contains(space)) {
//             return null;
//         }

//         return pm_spaces.getSome(space);
//     }

//     static gets(owner: String): Space[] {
//         if (!gefi_Spaces.contains(owner)) {
//             return new Array<Space>(0);
//         }
//         return gefi_Spaces.getSome(owner).values();
//     }

//     static set(owner: String, space: Space): void {
//         if (!gefi_Spaces.contains(owner)) {
//             const pm_spaces = new PersistentUnorderedMap<String, Space>(`${owner}::${space.name}`);
//             pm_spaces.set(space.name, space);
//             gefi_Spaces.set(owner, pm_spaces);
//             return;
//         }
//         const pm_spaces = gefi_Spaces.getSome(owner);
//         pm_spaces.set(space.name, space);
//         gefi_Spaces.set(owner, pm_spaces);
//     }

//     static contain(owner: String): bool {
//         return gefi_Spaces.contains(owner);
//     }

//     static contains(owner: String, space: String): bool {
//         if (!gefi_Spaces.contains(owner)) {
//             return false;
//         }
//         return gefi_Spaces.getSome(owner).contains(space);
//     }

//     static delete(owner: String, space: String): Space | null {
//         if (!gefi_Spaces.contains(owner)) {
//             return null;
//         }
//         const pm_spaces = gefi_Spaces.getSome(owner);
//         if (!pm_spaces.contains(space)) {
//             return null;
//         }
//         const dl_space = pm_spaces.getSome(space);
//         gefi_Spaces.delete(owner);
//         return dl_space;
//     }

//     static deletes(owner: String): Space[] | null {
//         if (!gefi_Spaces.contains(owner)) {
//             return null;
//         }
//         const dl_spaces = gefi_Spaces.getSome(owner).values();
//         gefi_Spaces.delete(owner);
//         return dl_spaces;
//     }
// }

const gefi_Spaces = new PersistentUnorderedMap<String, Space>("_gSp");

export class SpaceStorage {
    static get(owner: String, space: String): Space | null {
        if (!gefi_Spaces.contains(space)) {
            return null;
        }
        const pm_spaces: Space = gefi_Spaces.getSome(space);
        if (pm_spaces.owner != owner) {
            return null;
        }

        return pm_spaces;
    }

    static gets(owner: String): PersistentSet<Space> {
        const spaceLength = gefi_Spaces.length;
        const spaces = gefi_Spaces.values();
        const f_spaces = new PersistentSet<Space>("pmsp");
        for (let i = 0; i < spaceLength; i++) {
            if (spaces[i] != null && spaces[i].owner == owner) {
                f_spaces.add(spaces[i]);
            }
        }

        return f_spaces;
    }

    static set(space: Space): void {
        gefi_Spaces.set(space.name, space);
    }

    static contain(space: String): bool {
        return gefi_Spaces.contains(space);
    }

    static contains(owner: String, space: String): bool {
        if (!gefi_Spaces.contains(space)) {
            return false;
        }
        const pm_space = gefi_Spaces.getSome(space);
        if (pm_space.owner == owner) {
            return true;
        }
        return false;
    }

    static delete(owner: String, space: String): Space | null {
        if (!gefi_Spaces.contains(owner)) {
            return null;
        }
        const pm_spaces = gefi_Spaces.getSome(space);
        if (pm_spaces.owner != owner) {
            return null;
        }

        gefi_Spaces.delete(space);
        return pm_spaces;
    }
}
