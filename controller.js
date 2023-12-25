const express = require('express');
const bodyParser = require('body-parser');
const ProductModel = require('./model');

class ProductController {
constructor(app) {
this.app = app;
this.productModel = new ProductModel();
this.jsonParser = bodyParser.json();

this.registerRoutes();
}

registerRoutes() {
this.app.post('/api/products', this.jsonParser, this.addProduct.bind(this));
this.app.delete('/api/products/:id', this.deleteProduct.bind(this));
this.app.put('/api/products/:id', this.jsonParser, this.updateProduct.bind(this));
}

addProduct(req, res) {
const { name, price } = req.body;
if (!name || !price) {
res.status(400).send({ message: 'Invalid data' });
return;
}

this.productModel.addProduct(name, price, (err, product) => {
if (err) {
res.status(500).send(err.message);
return;
}
res.send(product);
});
}

deleteProduct(req, res) {
const id = req.params.id;
this.productModel.deleteProductById(id, (err, product) => {
if (err) {
res.status(500).send(err.message);
return;
}
res.send(product);
});
}

updateProduct(req, res) {
const { id } = req.params;
const { name, price } = req.body;

this.productModel.updateProductById(id, name, price, (err, product) => {
if (err) {
res.status(500).send(err.message);
return;
}
res.send(product);
});
}
}

module.exports = ProductController;
