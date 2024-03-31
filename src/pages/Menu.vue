<template>
  <body>
  <div>
    <header class="app-header">
      <div class="header-controls"> <!-- link to cart and number of items in cart -->
        <button v-on:click="navigateTo('cart')" class="nav-button">View Cart</button>
        <span class="cart-indicator">{{ cart.length }} in cart</span>
      </div>
    </header>

    <main class="content">
      <div v-if="page === 'cart'">
        <Cart v-on:removeItemFromCart="removeItemFromCart" :cart="cart" />
      </div>

      <div v-if="page === 'products'">
        <Products v-on:addItemToCart="addItemToCart" />
      </div>
    </main>
  </div>
  </body>
</template>

<script>
import Products from "./Products.vue"; // imports products for the menu. In hindsight i should have made a product database
import Cart from "./Cart.vue";

export default {
  name: "App",
  data: () => ({
    page: "products", // gets products and empty cart
    cart: []
  }),
  methods: {
    addItemToCart(product) {
      this.cart.push(product); //adds item to cart
    },
    removeItemFromCart(product) {
      const index = this.cart.indexOf(product); //finds index of product in cart array
      if (index > -1) {
        this.cart.splice(index, 1);
      }
    },
    navigateTo(page) {
      this.page = page;
    }
  },
  components: { //register prodcuts and cart components
    Products,
    Cart
  }
};
</script>

<style scoped>
body {
  margin: 0;
  font-family: 'Helvetica Neue', sans-serif;
  background-color: #191C23;
  color: #E9B464;
}

.products {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

button {
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 5px;
  outline: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  opacity: 0.9;
}

.app-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 80px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  background-color: #2C303A;
  padding: 0 40px;
}

.header-controls {
  display: flex;
  align-items: center;
}

.nav-button {
  margin-right: 30px; /* Increased spacing */
  background-color: #6D4F4B;
  color: #EDC9AF;
  border-radius: 5px;
  font-size: 1.2rem; /* Slightly larger button font */
}

.nav-button:hover {
  background-color: #D5954E;
}

.cart-indicator {
  color: #E9B464;
  font-size: 1.5rem; /* Increased font size */
  margin-right: 40px; /* Increased spacing */
}

.content {
  padding: 20px;
}
</style>
