var { getUniqueId } = require('../../helper/utils')

const products = require('../../data/products.json');
const { writeDataToFile } = require('../../helper/utils');

function findAll() {
    return new Promise((resolve, reject) => {
        resolve(products);
    })
}

function findById(id) {
    return new Promise((resolve, reject) => {
        const product = products.find((p) => p.id == id);
        resolve(product);
    })
}

function create(product) {
    return new Promise((resolve, reject) => {
        product = {id: getUniqueId(), ...product};
        products.push(product);
        writeDataToFile('products.json',products);
        resolve({id: product.id});
    })
}

function update(product) {
    return new Promise((resolve, reject) => {
        let index = products.findIndex((p) => p.id == product.id);
        products[index] = product;
        writeDataToFile('products.json',products);
        resolve({id: product.id});
    })
}

function remove(product) {
    return new Promise((resolve, reject) => {
        let index = products.findIndex((p) => p.id == product.id);
        products.splice(index,1);
        writeDataToFile('products.json',products);
        resolve({id: product.id});
    })
}


module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
}