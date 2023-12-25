const sqlite3 = require('sqlite3').verbose();

class ProductModel {
constructor() {
this.db = new sqlite3.Database('products.db');
}

getAllProducts(callback) {
this.db.all('SELECT * FROM products', callback);
}

getProductById(id, callback) {
this.db.get('SELECT * FROM products WHERE id = ?', [id], callback);
}

addProduct(name, price, callback) {
this.db.run('INSERT INTO products (name, price) VALUES (?, ?)', [name, price], function (err) {
if (err) return callback(err);
const productId = this.lastID;
callback(null, { id: productId, name, price });
});
}

deleteProductById(id, callback) {
this.db.run('DELETE FROM products WHERE id = ?', [id], function (err) {
if (err) return callback(err);
if (this.changes > 0) {
callback(null, { id });
} else {
callback({ message: 'Product not found' });
}
});
}

updateProductById(id, name, price, callback) {
this.db.run('UPDATE products SET name = ?, price = ? WHERE id = ?', [name, price, id], function (err) {
if (err) return callback(err);
if (this.changes > 0) {
callback(null, { id, name, price });
} else {
callback({ message: 'Product not found' });
}
});
}
}

module.exports = ProductModel;