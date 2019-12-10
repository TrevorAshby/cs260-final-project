var app = new Vue({
    el: '#admin',
    data: {
        notAdmin: false, //<---SET TO TRUE
        showForm: false,
        user: null,
        username: '',
        password: '',
        error: '',
        name: '',
        price: null,
        path: '',
        Url: '',
        addItem: null,
        items: [],
        cart: [],
        admins: ["5dedbb8ed5e5ff0f3a9a94b3"]
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
        isAdmin() {
            if (this.user.admin == "true"){
                this.notAdmin = false;
                return true;
            }
            else {
                return false;
            }
        },
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
        async addProduct() {
            try {
                let p1 = await axios.post("/api/item", {
                    name: this.name,
                    price: this.price,
                    path: this.path,
                    ordered: null,
                    url: this.Url,
                });
                this.addItem = p1.data;
                this.getItems();
            } catch(error){
                console.log(error);
            }
        },
        async removeItem(toRemove) {
            try {
                let response = axios.delete("/api/item/" + toRemove._id);
                this.getItems();
                return true;
            } catch(error) {
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
    }
});