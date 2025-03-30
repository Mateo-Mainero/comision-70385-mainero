import productModel from "../models/product.js";

export class ProductsRepository {
    async getProducts(id) {
        return await productModel.find(id).lean();
    }

    async getProductById(id) {
        return await productModel.findById(id).lean();
    }

    async createProduct(product) {
        return await productModel.create(product);
    }

    async updateProduct(id, updateData) {
        return await productModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    async deleteProduct(id) {
        return await productModel.findByIdAndDelete(id);
    }
}