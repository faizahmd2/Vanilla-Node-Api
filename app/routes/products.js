const { getAllProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');


const paths = [
    {path:'/api/products',method: 'GET',controller: getAllProducts},
    {path:'/api/product/:id',method: 'GET',controller: getProduct},
    {path:'/api/products',method: 'POST',controller: createProduct},
    {path:'/api/product/:id',method: 'PUT',controller: updateProduct},
    {path:'/api/product/:id',method: 'DELETE',controller: deleteProduct}
]

module.exports = {
    paths
}