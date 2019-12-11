var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
  showDivs(slideIndex += n);
}

function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("mySlides");
  if (n > x.length) {slideIndex = 1}
  if (n < 1) {slideIndex = x.length} ;
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  x[slideIndex-1].style.display = "block";
}


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
    checkedItems: []
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
    async submitCart() {
        try {
            axios.put("/api/item", this.checkedItems);
            this.checkedItems = [];
            console.log("Cart Submitted");
            
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
    },
    
    
    
    /* NOT FINISHED YET
      async searchItems() {
      let response = await axios.get("/api/item", this.itemToSearch);
      this.searchResult = response.data;
      try {
        
      } catch(error) {
        console.log(error);
      }
    }*/
  }
});

