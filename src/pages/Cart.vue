<template>
  <div class="cart-container">
    <h1 class="cart-title">Your Cart</h1>
    <div class="cart-items">
      <div v-for="(product, index) in cart" :key="index" class="cart-item"> <!-- displays products of index added to cart information -->
        <div class="cart-item-info">
          <h3 class="cart-item-name">{{ product.name }}</h3>
          <div class="cart-item-price">{{ product.price }}</div>
        </div>
        <div class="cart-item-image" :style="{ backgroundImage: `url(${product.image})` }"></div>
        <button @click="removeItemFromCart(product)" class="remove-item-btn">Remove from cart</button>
      </div>
    </div>
    <div class="cart-actions">
      <button class="confirm-cart-btn" @click="confirmCart()">Confirm Cart</button>
    </div>
  </div>
</template>


<script>
import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";

export default {
  props: ["cart"],
  methods: { //uses javascript to remove product from cart
    removeItemFromCart(product) {
      this.$emit("removeItemFromCart", product);
    },
    async confirmCart() { //comfirms cart and will save information to firebase database
      try {
        const auth = getAuth(); // Get the authentication instance
        const user = auth.currentUser; // Get the current user
        if (!user) {
          console.error("User not authenticated.");
          return;
        }

        for (const product of this.cart) {
          const { name, price, customerKey } = product; //ensures all nescecary product information is there
          console.log(product);
          if (!name || !price || !customerKey) {
            console.error('Incomplete data for product:', product);
            continue;
          }

          //includes users UID product details customer key in the request body
          const requestBody = {
            uid: user.uid, // Add the user's UID
            name: name,
            price: price,
            customerKey: customerKey
          };

          //make a request to your backend function to add the product information to the database
          await fetch("https://us-central1-virtual-queue-app2.cloudfunctions.net/postcomment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
          });
        }

        console.log("Items added to database successfully");

        //after adding items to the database, copy the cart to the orders
        this.copyCartToOrders()
            .then(async (result) => {
              console.log(result);
              this.clearCart()
                  .then(async (result) => {
                    this.$router.push({path: '/orderConfirmation'}) //user brought to order confirmation page
                    console.log(result);
                  })
            });
      } catch (error) {
        console.error("Error confirming cart:", error);
      }
    },
    async copyCartToOrders() {
      try {
        //make a request to your copyCartToOrders Firebase Cloud Function
        await fetch("https://us-central1-virtual-queue-app2.cloudfunctions.net/copyCartToOrders", {
          method: "POST",

        });
        console.log("Cart copied to orders in progress successfully");
      } catch (error) {
        console.error("Error copying cart to oreders in progress:", error);
      }
    },
    async clearCart() {
      try {
        //make a request to clear the cart
        await fetch("https://us-central1-virtual-queue-app2.cloudfunctions.net/clearCart", {
          method: "POST",

        });
        console.log("Cart cleared successfully");
      } catch (error) {
        console.error("Error clearing cart:", error);
        console.log(error);
      }
    }
  }
};
</script>

<style scoped>
.cart-container {
  padding: 20px;
  max-width: 800px;
  margin: auto;
  height: 100vh; /* Set height to 100% of viewport height */
  display: flex; /* Use flexbox */
  flex-direction: column; /* Column layout */
}

.cart-title {
  font-size: 2.5rem;
  color: #E9B464;
  text-align: center;
  margin-bottom: 30px;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item {
  background: #2C303A;
  border: 1px solid #3D4148;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cart-item-info {
  flex-grow: 1;
}

.cart-item-name {
  font-size: 1.4rem;
  color: #E9B464;
  margin-bottom: 5px;
}

.cart-item-price {
  font-size: 1.2rem;
  color: #A5763E;
}

.cart-item-image {
  width: 100px;
  height: 100px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  margin-right: 20px;
}

.remove-item-btn, .confirm-cart-btn {
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 5px;
  background-color: #6D4F4B;
  color: #EDC9AF;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.remove-item-btn:hover {
  background-color: #D5954E;
}

.confirm-cart-btn {
  width: 100%;
  margin-top: 20px;
  font-weight: bold;
  font-size: 1.2rem;
}

.confirm-cart-btn:hover {
  background-color: #D5954E;
  transform: scale(1.05);
}

.cart-actions {

  margin-top: auto; /* Push the confirm cart button to the bottom */

}
</style>
