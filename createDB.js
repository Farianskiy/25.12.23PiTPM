const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('products.db');

// Создание таблицы продуктов
db.serialize(() => {
db.run(`
CREATE TABLE IF NOT EXISTS products (
id INTEGER PRIMARY KEY,
name TEXT NOT NULL,
price REAL NOT NULL
)
`);
});

// Вставка начальных данных
db.serialize(() => {
const initialProducts = [
{ name: 'Product_1', price: 9.99 },
{ name: 'Product_2', price: 19.99 },
];

const insertProduct = db.prepare('INSERT INTO products (name, price) VALUES (?, ?)');

initialProducts.forEach(product => {
insertProduct.run(product.name, product.price);
});

insertProduct.finalize();
});

db.close();