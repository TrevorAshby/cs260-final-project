var app = new Vue({
  el: '#app',
  data: {
    showForm: false,
    user: null,
    username: '',
    password: '',
    error: '',
    items: [],
    cart: [],
  },
  created() {
    this.getUser();
    this.getItems();
    this.getCart();
  },
  watch: {
    cart: function() {
      this.getCart();
    }
  },
  methods: {
    closeForm() {
      this.showForm = false;
    },
    toggleForm() {
      this.error = "";
      this.username = "";
      this.password = "";
      this.showForm = !this.showForm;
    },
    async register() {
      this.error = "";
      try {
        let response = await axios.post("/api/users", {
          username: this.username,
          password: this.password,
          admin: false,
        });
        this.user = response.data;
        // close the dialog
        this.toggleForm();
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    async login() {
      this.error = "";
      try {
        let response = await axios.post("/api/users/login", {
          username: this.username,
          password: this.password
        });
        this.user = response.data;
        // close the dialog
        this.toggleForm();
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    async logout() {
      try {
        let response = await axios.delete("/api/users");
        this.user = null;
      } catch (error) {
        // don't worry about it
      }
    },
    async getUser() {
      try {
        let response = await axios.get("/api/users");
        this.user = response.data;
      } catch (error) {
        // Not logged in. That's OK!
      }
    },
    async getItems() {
      try {
        let response = await axios.get("/api/item");
        this.items = response.data;
        console.log(items);
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async getCart() {
      try {
        let response = await axios.get("/api/cart");
        this.cart = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    
    
    
    
    async addToCart(addCartItem) {
        try {
          await axios.post("/api/cart/" + addCartItem._id);
          console.log("Item added to Cart");
        } catch (error) {
            console.log(error);
        }
    },
    
    async updateOrdered(addCartItem) {
      try {
        await axios.put("/api/item", addCartItem);
      } catch (error) {
        console.log(error);
      }
    }
    
    
    
    
    
    
    
    
  }
});

/*const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();


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


router.post('/addCart', async (req, res) => {
      const item = await items.findOne({name: req.body.name});
      console.log(item);
      
});*/