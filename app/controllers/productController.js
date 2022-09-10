const { sendResponse, getRequestBody } = require('../../helper/utils');
const Product = require('../models/productsModel');

var products = {
    getAllProducts: async (req, res) => {
        try {
            const products = await Product.findAll();
            sendResponse(res, 200, {status: 1, result: products});
        } catch (error) {
            console.error(error);
            sendResponse(res, 500, {status: 0, message: "Something Went Wrong!!"});
        }
    },
    getProduct: async (req, res) => {
        try {
            let id = req.params.id;
            const product = await Product.findById(id);

            if(!product) {
                return sendResponse(res, 404, {status: 0, message: 'Product Not Found'});
            }
            sendResponse(res, 200, {status: 1, result: product});
        } catch (error) {
            console.error(error);
            sendResponse(res, 500, {status: 0, message: "Something Went Wrong!!"});
        }
    },
    createProduct: async (req, res) => {
        try {
            let body = await getRequestBody(req);
            const { title, type, description, filename, height=600, width=400, price, rating=4.5 } = body;

            if(!title || !type || !description || !filename || !price) throw new Error('Data Missing');
            
            let product = {
                title,
                type,
                description,
                filename,
                height,
                width,
                price, 
                rating
            }

            const createdProduct = await Product.create(product);
            sendResponse(res, 200, {status: 1, result: createdProduct});
        } catch (error) {
            console.error(error);
            sendResponse(res, 500, {status: 0, message: "Something Went Wrong!!"});
        }
    },
    updateProduct: async (req, res) => {
        try {
            let id = req.params.id;
            let product = await Product.findById(id);

            if(!product) {
                return sendResponse(res, 404, {status: 0, message: 'Product Not Found'});
            }

            let body = await getRequestBody(req);
            const { title, type, description, filename, height, width, price, rating } = body;

            if(title) product.title = title;
            if(type) product.type = type;
            if(description) product.description = description;
            if(filename) product.filename = filename;
            if(height) product.height = height;
            if(width) product.width = width;
            if(price) product.price = price;
            if(rating) product.rating = rating;

            let updatedProduct = await Product.update(product);

            sendResponse(res, 200, {status: 1, result: updatedProduct});
        } catch (error) {
            console.error(error);
            sendResponse(res, 500, {status: 0, message: "Something Went Wrong!!"});
        } 
    },
    deleteProduct: async (req, res) => {
        try {
            let id = req.params.id;
            const product = await Product.findById(id);

            if(!product) {
                return sendResponse(res, 404, {status: 0, message: 'Product Not Found'});
            }

            let removedProduct = await Product.remove(product);
            
            sendResponse(res, 200, {status: 1, result: removedProduct});
        } catch (error) {
            console.error(error);
            sendResponse(res, 500, {status: 0, message: "Something Went Wrong!!"});
        }
    },
}

module.exports = products