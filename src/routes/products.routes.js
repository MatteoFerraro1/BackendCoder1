import { Router } from "express";
import fs from "fs"

const router = Router();

const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'));

router.get('/', (req, res) => {
    res.json(products);
})

router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    const product = await products.find(product => product.id == pid);

    if(!product) {
        res.status(404).json({ error: 'No se encuentra el producto con el id solicitado' })
    } else {
        res.json(product);
    }
})

router.post('/', (req, res) => {
    const { title, description, code, price, stock, category } = req.body;
    const newId = products[products.length - 1].id + 1;

    if(!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    } else {
            const newProduct = {
                id: newId,
                title,
                description,
                code,
                price,
                status: true,
                stock,
                category
            }

            products.push(newProduct);
            fs.writeFileSync('./data/products.json', JSON.stringify(products, null, '\t'));
        }
        res.json(products); 
} 
)
router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, stock, category } = req.body;

    if(!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    } else {
        const product = products.find(product => product.id == pid);

        if(!product) {
            res.status(404).json({ error: 'No se encuentra el producto con el id solicitado' })
        } else {
            product.title = title;
            product.description = description;
            product.code = code;
            product.price = price;
            product.stock = stock;
            product.category = category;
            fs.writeFileSync('./data/products.json', JSON.stringify(products, null, '\t'));
            res.json(product);
        }
    }
})
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    const productIndex = products.findIndex(product => product.id == pid)
    
    if (pid > products[products.length - 1].id) {
        res.status(400).json(`No se encuentra el producto con el id: ${pid} solicitado`);
    } else {
        try{
            const product = await products.splice(productIndex, 1)
            res.json(product);
        } catch(err) {
            res.status(400).json(`Ocurrió un error al realizar la petición: ${err}`);
        };
    }
})
export default router