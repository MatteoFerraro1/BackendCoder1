import { Router } from "express";
import fs from "fs"

const router = Router();

const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'));
const cart = JSON.parse(fs.readFileSync('./data/carts.json', 'utf-8'));

router.post('/', (req, res) => {
    const newId = cart[cart.length -1].id + 1;
    const newCart = { 
        id: newId, 
        products: [] 
    };

    cart.push(newCart);
    fs.writeFileSync('./data/carts.json', JSON.stringify(cart, null, '\t'));
    res.json(cart);
})


router.get('/:cid', (req, res) => {
    const { cid } = req.params;

    const cart = cart.find(cart => cart.id == cid);
    if (cid > cart[cart.length - 1].id || cid < 1 || !cart) {
        res.status(400).json(`No se encuentra el carrito con el id: ${cid}, solicita uno entre el 1 y el ${cart[cart.length - 1].id}`)
    } else {
        try {
            res.json(cart);
        } catch (err) {
            console.log(err)
        }
    }
})

router.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    
    const cart = cart.find(cart => cart.id == cid);
    const product = products.find(product => product.id == pid);
    const exists = cart.products.find(product => product.product == pid);

    if (cid > cart[cart.length - 1].id || cid < 1 || !cart) {
        res.status(400).json(`No se encuentra el carrito con el id: ${cid}, solicita uno entre el 1 y el ${cart[cart.length - 1].id}`)
    } else if (!product) {
        res.status(400).json(`No se encuentra el producto con el id: ${pid}, solicita uno entre el 1 y el ${products[products.length - 1].id}`)
    } else {
        try {
            if (exists) {
                exists.quantity += 1;
            } else {
                cart.products.push({ product: product.id, quantity: 1 });
            }
            fs.writeFileSync('./data/carts.json', JSON.stringify(cart, null, '\t'));
            res.json(cart);
        } catch (err) {
            console.log(err)
        }
    }
})

export default router