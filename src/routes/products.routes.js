import { Router } from "express";
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from "../controllers/productsController.js";
import { authorization } from "../config/middlewares.js";
const productRouter = Router()

productRouter.get('/', getProducts)
productRouter.get('/:pid', getProduct)
productRouter.post("/", authorization("admin"), createProduct);
productRouter.put("/:pid", authorization("admin"), updateProduct);
productRouter.delete("/:pid", authorization("admin"), deleteProduct);

export default productRouter