const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();



app.listen(3000, () => {
  console.log('server is running on port 3000!');
});

app.use(express.static('.'));
app.use(bodyParser.json()); 


app.get('/goods', (req, res) => {
  fs.readFile('goods.json', 'utf-8', (err, data) => {
      if (!err) {
          res.setHeader('Content-Type', 'application/json');
          res.end(data);
      } else {
        console.log(err);
      }
  });
});

app.get('/cart', (req, res) => {
  fs.readFile('cart.json', 'utf-8', (err, data) => {
      if (!err) {
          res.setHeader('Content-Type', 'application/json');
          res.end(data);
      } else {
        console.log(err);
      }
  });
});

app.post('/addToCart', (req, res) => {
  let cart = [];

  fs.readFile('cart.json', 'utf-8', (err, data) => {
      if (!err) {
          cart = JSON.parse(data);
          cart.push(req.body);
  
          fs.writeFile('cart.json', JSON.stringify(cart), (err) => {
            console.log('done');
          })
      } else {
        console.log(err);
      }
  });

  res.send(cart);
});

app.post('/deleteItem', (req, res) => {
  let cart = [];

  fs.readFile('cart.json', 'utf-8', (err, data) => {
    if (!err) {
      cart = JSON.parse(data);

      let index = cart.findIndex((item) => item.id === req.body.id);
      if (index != -1) {
        cart.splice(index, 1);
      }

      fs.writeFile('cart.json', JSON.stringify(cart), (err) => {
        console.log('done');
      })
  } else {
    console.log(err);
  }
  });

  res.send(cart);
});
