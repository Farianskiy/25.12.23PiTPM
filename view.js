const express = require('express');
const bodyParser = require('body-parser');
const ProductModel = require('./model');

const app = express();
const jsonParser = bodyParser.json();
const productModel = new ProductModel();

app.use(express.static(__dirname + '/public'));

app.get('/api/products', function (req, res) {
productModel.getAllProducts((err, products) => {
if (err) {
res.status(500).send(err.message);
return;
}
res.send(products);
});
});

app.get('/api/products/:id', function (req, res) {
const id = req.params.id;
productModel.getProductById(id, (err, product) => {
if (err) {
res.status(500).send(err.message);
return;
}
if (product) {
res.send(product);
} else {
res.status(404).send();
}
});
});

app.listen(3000, function () {
console.log('Сервер ожидает подключения... http://localhost:3000/api/products');
});