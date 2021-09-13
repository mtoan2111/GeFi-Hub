import { Context, Storage } from "near-sdk-core";
import { Space } from "../model/space.model";
import { SpaceStorage } from "../storage/space.storage";

export function sp_register(name: String, symbol: String, icon: String | null): Space | null {
    const ownerId = Context.sender;
    if (SpaceStorage.contain(ownerId) && SpaceStorage.contains(ownerId, name)) {
        return SpaceStorage.get(ownerId, name);
    }

    const new_space = new Space(name, symbol, icon);
    SpaceStorage.set(ownerId, new_space);
    return new_space;
}

export function sp_unregisters(): Space[] | null {
    const ownerId = Context.sender;
    return SpaceStorage.deletes(ownerId);
}

export function sp_unregister(name: String): Space | null {
    const ownerId = Context.sender;
    return SpaceStorage.delete(ownerId, name);
}

export function sp_update(name: String, symbol: String, icon: String | null): bool {
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
