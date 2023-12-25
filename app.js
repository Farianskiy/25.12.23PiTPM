var express = require('express');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();

var app = express();
var jsonParser = bodyParser.json();

// Подключение к базе данных SQLite
var db = new sqlite3.Database('products.db');

// Получение списка данных
app.get('/api/products', function (req, res) {
	db.all('SELECT * FROM products', function (err, rows) {
		if (err) {
			res.status(500).send(err.message);
			return;
		}
		res.send(rows);
	});
});

// Получение товара по id
app.get('/api/products/:id', function (req, res) {
	var id = req.params.id;
	db.get('SELECT * FROM products WHERE id = ?', [id], function (err, row) {
		if (err) {
			res.status(500).send(err.message);
			return;
		}
		if (row) {
			res.send(row);
		} else {
			res.status(404).send();
		}
	});
});

// Получение отправленных данных
app.post('/api/products', jsonParser, function (req, res) {
	if (!req.body) return res.sendStatus(400);

	var productName = req.body.name;
	var productPrice = req.body.price;

	db.run('INSERT INTO products (name, price) VALUES (?, ?)', [productName, productPrice], function (err) {
		if (err) {
			res.status(500).send(err.message);
			return;
		}
		var productId = this.lastID;
		var product = { id: productId, name: productName, price: productPrice };
		res.send(product);
	});
});

// Удаление пользователя по id
app.delete('/api/products/:id', function (req, res) {
	var id = req.params.id;
	db.run('DELETE FROM products WHERE id = ?', [id], function (err) {
		if (err) {
			res.status(500).send(err.message);
			return;
		}
		if (this.changes > 0) {
			res.send({ id: id });
		} else {
			res.status(404).send();
		}
	});
});

// Изменение пользователя
app.put('/api/products/:id', jsonParser, function (req, res) {
	if (!req.body) return res.sendStatus(400);

	var productId = req.params.id;
	var productName = req.body.name;
	var productPrice = req.body.price;

	db.run('UPDATE products SET name = ?, price = ? WHERE id = ?', [productName, productPrice, productId], function (err) {
		if (err) {
			res.status(500).send(err.message);
		return;
		}
		if (this.changes > 0) {
			var product = { id: productId, name: productName, price: productPrice };
			res.send(product);
		} else {
			res.status(404).send();
		}
	});
});

app.listen(3000, function () {
console.log('Сервер ожидает подключения... http://localhost:3000/api/products');
});