import { PersistentSet, PersistentUnorderedMap } from "near-sdk-core";
import { Product } from "../model/product.model";
import { Space } from "../model/space.model";
import { Context } from "near-sdk-core";

const gefi_Products = new PersistentUnorderedMap<String, Product>("_gGm");

export class ProductStorage {
    static get(ownerId: String, space: String, name: String): Product | null {
        if (!gefi_Products.contains(name)) {
            return null;
        }
        let pm_products: Product = gefi_Products.getSome(name);
        if (pm_products.owner != ownerId && pm_products.space.name != space) {
            return null;
        }

        return pm_products;
    }

    static gets(owerId: String, space: String): PersistentSet<Product> {
        const productLength = gefi_Products.length;
        const products = gefi_Products.values();
        const f_products = new PersistentSet<Product>("pmpp");
        for (let i = 0; i < productLength; i++) {
            if (products[i] != null && products[i].owner == owerId && products[i].space.name == space) {
                f_products.add(products[i]);
            }
        }
        return f_products;
    }

    static set(product: Product): void {
        gefi_Products.set(product.name, product);
    }

    static contain(product: String): bool {
        return gefi_Products.contains(product);
    }

    static contains(ownerId: String, space: String, product: String): bool {
        if (!gefi_Products.contains(product)) {
            return false;
        }
        const pm_product = gefi_Products.getSome(product);
        if (pm_product.owner == ownerId && pm_product.space.name == space) {
            return true;
        }
        return false;
    }

    static delete(ownerId: String, space: String, name: String): Product | null {
        if (!gefi_Products.contains(name)) {
            return null;
        }
        const pm_product = gefi_Products.getSome(name);
        if (pm_product.owner != ownerId && pm_product.space.name != space) {
            return null;
        }
        gefi_Products.delete(name);
        return pm_product;
    }
}
