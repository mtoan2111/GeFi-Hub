import { PersistentUnorderedMap } from "near-sdk-core";
import { Product } from "../model/product.model";
import { Space } from "../model/space.model";
import {Context} from "near-sdk-core";

// User => spaces => products
const gefi_Products = new PersistentUnorderedMap<String, PersistentUnorderedMap<String, PersistentUnorderedMap<String, Product>>>("gGm");
/**
 * spaces(products())
 */

export class ProductStorage {
    static get(space: String, name: String): Product | null {
        let userId = Context.sender;
        if (!gefi_Products.contains(userId)) {
            return null;
        }
        let pm_products: PersistentUnorderedMap<String, PersistentUnorderedMap<String, Product>> = gefi_Products.getSome(userId);
        if (!pm_products.contains(space)) {
            return null;
        }
        let op_products: PersistentUnorderedMap<String, Product> = pm_products.getSome(space);
        if (!op_products.contains(name)) {
            return null;
        }
        return op_products.getSome(name);
    }

    static gets(space: String): Product[] | null {
        let userId = Context.sender;
        if (!gefi_Products.contains(userId)) {
            return null;
        }
        let pm_products: PersistentUnorderedMap<String, PersistentUnorderedMap<String, Product>> = gefi_Products.getSome(userId);
        if (!pm_products.contains(space)) {
            return null;
        }
        return pm_products.getSome(space).values();
    }

    static set(space: String, product: Product): void {
        let userId = Context.sender;
        let products = new PersistentUnorderedMap<String, Product>(`products`);
        products.set(product.name, product);
        if (!gefi_Products.contains(userId)) {
            let gm_spaces = new PersistentUnorderedMap<String, PersistentUnorderedMap<String, Product>>(`${space}`);
            gm_spaces.set(space, products);
            gefi_Products.set(userId, gm_spaces);
            return;
        }
        let usr_spaces = gefi_Products.getSome(userId);
        usr_spaces.set(space, products);
    }

    static contain(space: String, name: String): bool {
        let userId = Context.sender;
        if (!gefi_Products.contains(userId) || !gefi_Products.getSome(userId).contains(space)) {
            return false;
        }
        return gefi_Products.getSome(userId).getSome(space).contains(name);
    }

    static contains(space: String): bool {
        let userId = Context.sender;
        if (!gefi_Products.contains(userId) || !gefi_Products.getSome(userId).contains(space)) {
            return false;
        }
        return gefi_Products.getSome(userId).contains(space);
    }

    static delete(space: String, name: String): Product | null {
        let userId = Context.sender;
        if (!gefi_Products.contains(userId)) {
            return null;
        }
        const pm_spaces = gefi_Products.getSome(userId);
        if (!pm_spaces.contains(space)) {
            return null;
        }
        const pm_product = pm_spaces.getSome(space).get(name);
        pm_spaces.getSome(space).delete(name);
        return pm_product;
    }

    static deletes(space: String): Product[] | null {
        let userId = Context.sender;
        if (!gefi_Products.contains(userId)) {
            return null;
        }
        const dl_spaces = gefi_Products.getSome(userId).getSome(space).values();
        gefi_Products.getSome(userId).delete(space);
        return dl_spaces;
    }
}
