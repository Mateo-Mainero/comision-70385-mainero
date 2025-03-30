import cartModel from "../models/cart.js";

export class CartsRepository {
    async getCart(id) {
        return await cartModel.findById(id).populate("products.id_prod").lean();
    }

    async createCart() {
        return await cartModel.create({ products: [] });
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = await cartModel.findById(cartId);
        const productIndex = cart.products.findIndex(prod => prod.id_prod == productId);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
        } else {
            cart.products.push({ id_prod: productId, quantity });
        }

        return await cart.save();
    }

    async updateCart(cartId, newData) {
        // Se actualiza el carrito y se retorna el nuevo documento
        return await cartModel.findByIdAndUpdate(cartId, newData, { new: true });
    }

    async deleteProductFromCart(cartId, productId) {
        const cart = await cartModel.findById(cartId);
        cart.products = cart.products.filter(prod => prod.id_prod != productId);
        return await cart.save();
    }

    async deleteCart(id) {
        return await cartModel.findByIdAndDelete(id);
    }
}