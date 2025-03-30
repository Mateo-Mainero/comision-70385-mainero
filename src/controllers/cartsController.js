import { CartsRepository } from "../repositories/cartsRepository.js";
import { TicketsRepository } from "../repositories/ticketsRepository.js";
import { ProductsRepository } from "../repositories/productsRepository.js";
import crypto from "crypto";


const cartsRepository = new CartsRepository();
const ticketsRepository = new TicketsRepository();
const productsRepository = new ProductsRepository();

// Función para obtener un carrito
export const getCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartsRepository.getCart(cartId);
        if (cart) {
            res.status(200).send(cart);
        } else {
            res.status(404).send("Carrito no existe");
        }
    } catch (e) {
        res.status(500).render('templates/error', { e });
    }
};

// Función para crear un carrito
export const createCart = async (req, res) => {
    try {
        const newCart = await cartsRepository.createCart();
        res.status(201).send(newCart);
    } catch (e) {
        res.status(500).render('templates/error', { e });
    }
};

// Función para agregar un producto al carrito
export const insertProductCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;
        const updatedCart = await cartsRepository.addProductToCart(cartId, productId, quantity);
        res.status(200).send(updatedCart);
    } catch (e) {
        res.status(500).render('templates/error', { e });
    }
};

// Función para actualizar un carrito
export const updateProductCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const { newProducts } = req.body;
        const updatedCart = await cartsRepository.updateCart(cartId, newProducts);
        res.status(200).send(updatedCart);
    } catch (e) {
        res.status(500).render('templates/error', { e });
    }
};

// Función para actualizar la cantidad de un producto
export const updateQuantityProductCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;
        const updatedCart = await cartsRepository.updateProductQuantity(cartId, productId, quantity);
        res.status(200).send(updatedCart);
    } catch (e) {
        res.status(500).render('templates/error', { e });
    }
};

// Función para eliminar un carrito
export const deleteCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        await cartsRepository.deleteCart(cartId);
        res.status(200).send({ message: "Carrito eliminado" });
    } catch (e) {
        res.status(500).render('templates/error', { e });
    }
};

// Función para eliminar un producto del carrito
export const deleteProductCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const updatedCart = await cartsRepository.deleteProductFromCart(cartId, productId);
        res.status(200).send(updatedCart);
    } catch (e) {
        res.status(500).render('templates/error', { e });
    }
};

// Función para finalizar la compra (checkout)
export const checkout = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartsRepository.getCart(cartId);

        if (!cart) {
            return res.status(404).send({ message: "Carrito no existe" });
        }

        const unprocessedProducts = [];
        let totalAmount = 0;

        for (const prod of cart.products) {
            const product = await productsRepository.getProductById(prod.id_prod);
            if (product.stock >= prod.quantity) {
                product.stock -= prod.quantity;
                totalAmount += product.price * prod.quantity;
                await productsRepository.updateProduct(product._id, { stock: product.stock });
            } else {
                unprocessedProducts.push(prod.id_prod);
            }
        }
        if (unprocessedProducts.length === 0) {
            const ticket = await ticketsRepository.createTicket({
                code: crypto.randomUUID(),
                purchaser: req.user.email,
                amount: totalAmount,
                products: cart.products,
            });
        
            // Se elimina el carrito porque la compra se completó totalmente
            await cartsRepository.deleteCart(cartId);
            res.status(200).send(ticket);
        } else {
            // Actualizamos el carrito para que solo contenga los productos que NO se pudieron comprar
            await cartsRepository.updateCart(cartId, {
                products: cart.products.filter(prod => unprocessedProducts.includes(prod.id_prod)),
            });
            res.status(400).send({ unprocessedProducts });
        }
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
};