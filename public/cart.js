var app = new Vue({
    el: '#app',
    data: {
        showForm: false,
        user: null,
        username: '',
        password: '',
        error: '',
        cart: [],
    },
    created() {
        this.getUser();
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
        async getCart() {
          try {
            let response = await axios.get("/api/cart");
            this.cart = response.data;
            return true;
          } catch (error) {
            console.log(error);
          }
        },
        async removeCart(itemToRemove) {
            try {
                console.log(itemToRemove);
                await axios.delete("/api/cart/" + itemToRemove._id);
                console.log("Item Deleted from Cart");
                return true;
            } catch (error) {
                console.log(error);
            }
        }
    }
});