const { request, response } = require("express")
const Product = require('../models/product.model');
const Category = require('../models/category.model')

const getProducts = async (req = request, res = response) => {

    let {limit = 10, page = 0, fields = ''} = req.query;

    if(fields.length > 0){
        fields = fields.replaceAll(',', ' ');
    }

    console.log(fields)

    const [countDocuments, products] = await Promise.all([
        Product.countDocuments(),
        Product.find().limit(limit).skip(page).select(fields)
    ]);

    res.json({
        data: {
            countDocuments,
            items: products
        }
    })
}

const getProductById = (req = request, res = response) => {
    res.json({
        ok: true
    })
}

const postProduct = async(req = request, res = response) => {
    
    const { name, price, stock, active, category } = req.body;

    const productDB = await Product.findOne({ name });

    if(productDB){
        return res.json({
            errors: [
                {
                    errorCode: 'xxxx',
                    description: `Product ${name} already exists`
                }
            ]
        });
    }

    const categoryDB = await Category.findById(category);

    if(!categoryDB){
        return res.json({
            errors: [
                {
                    errorCode: 'xxxx',
                    description: `Category ${category} does not exists`
                }
            ]
        });
    }

    const product = new Product({
        name,
        price,
        stock,
        active,
        category
    });

    await product.save();
    
    res.json({
        data: {
            ...product.toJSON()
        }
    })
}

const putProduct = (req = request, res = response) => {
    res.json({
        ok: true
    })
}

const deleteProduct = (req = request, res = response) => {
    res.json({
        ok: true
    })
}

module.exports = {
    getProducts,
    getProductById,
    postProduct,
    putProduct,
    deleteProduct
}
