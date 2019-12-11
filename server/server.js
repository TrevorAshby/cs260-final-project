const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));


app.use(express.static('../public'));
const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/store', {
  useNewUrlParser: true
});

// Create a scheme for items in the museum: a title and a path to an image.
const itemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  path: String, 
  ordered: Number,
  url: String,
});

// Create a model for items in the museum.
const Item = mongoose.model('Item', itemSchema);
const CartItem = mongoose.model('CartItem', itemSchema);

// Get a list of all of the items in the museum.
app.get('/api/item', async (req, res) => {
  try {
    let items = await Item.find().sort({ordered:-1});
    res.send(items);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all of the items in the museum.
app.get('/api/cart', async (req, res) => {
  try {
    let cartitem = await CartItem.find().sort({name:1});
    res.send(cartitem);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//add new item to products
app.post('/api/item', async (req, res) => {
    const item = new Item({
        name: req.body.name,
        price: req.body.price,
        path: req.body.path,
        ordered: 0,
        url: req.body.url,
    });
    try {
        await item.save();
        console.log("Done Saving");
        res.send(item);
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

//adding to cart
app.post('/api/cart/:id', async (req, res) => {
  item = await Item.findOne({ _id: req.params.id });
  //console.log(item);
  cartitem = new CartItem({
    _id: item._id,
    name: item.name,
    price: item.price,
    ordered: item.ordered,
    url: item.url
    });
  await cartitem.save();
  //console.log(cartitem);
  console.log("Added to Cart");
});

//updating ordered
app.put('/api/item', async (req, res) => {
    console.log("In Put Route");
    //console.log(req.body);
    item = await Item.findOne({ _id: req.body._id });
    //console.log(item);
    item.ordered += 1;
    item.save();
    console.log("Updated Votes");
});

//delete item from Cart
app.delete('/api/cart/:id', async (req, res) => {
    console.log("In Delete Route");
    await CartItem.deleteOne({ _id: req.params.id });
    console.log("Done Deleting");
});

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const users = require("./users.js");
app.use("/api/users", users);

app.listen(8080, () => console.log('Server listening on port 8080!'));