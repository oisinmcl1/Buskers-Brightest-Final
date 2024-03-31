<template>
  <div class="confirmation-container">
    <h1 class="confirmation-title">Order Confirmation</h1>
    <p class="confirmation-message">Your order has been placed successfully!</p>
    <p v-if="!orderReady" class="confirmation-message">Please wait for your order to be prepared.</p>

    <div v-if="orderReady" class="orders-list">
      <h2>Your Orders:</h2>
      <ul>
        <li v-for="order in orders" :key="order.id" class="order-item">
          <div class="order-details">
            <h5>Product Name: {{ order.name }}</h5>
            <h6>Price: {{ order.price }}</h6>
          </div>
          <button class="collect-btn" @click="collectOrder(order)">Collect Order</button>
        </li>
      </ul>
    </div>

    <div class="all-collected-message">
      <p>Thank you for using our service! Press the button below to log out.</p>
      <button class="logout-btn" @click="logout()">Enjoy your night!</button>
    </div>
  </div>
</template>

<script>
import app from "../api/firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";

export default {
  data() {
    return {
      orderReady: false,
      uid: "",
      orders: [],
      collectedOrders: false,
      ordersHaveBeenChecked: false,
      allOrdersCollected: false
    };
  },
  mounted() {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        console.log("user not logged in!");
      } else {
        this.uid = user.uid;
        //interval to constantly check for the order
        this.intervalID = setInterval(async () => {
          await this.isOrderReady();
        }, 5000);
      }
    });
  },
  methods: {
    async isOrderReady() {
      try {
        //check if the users order is ready, by their uid
        const response = await fetch(
            "https://us-central1-virtual-queue-app2.cloudfunctions.net/getOrdersByUser",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                uid: this.uid
              })
            }
        );

        const data = await response.json();

        if (data && data.orders && data.orders.length > 0) {
          this.orders = data.orders;
          this.orderReady = true;
          this.collectedOrders = false;
        } else {
          this.orderReady = false;
          this.collectedOrders = true;
        }
        //if all orders are collected by the user, we update allOrdersCollected
        this.allOrdersCollected = this.orders.length > 0 && this.orders.every(order => order.completed);
      } catch (error) {
        console.error("Error checking if orders are ready:", error);
      }
    },
    async collectOrder(order) {
      console.log("completing order:", order);
      try {
        this.ordersHaveBeenChecked = true;
        // call the Cloud Function to move the order to orderHistory
        const functions = getFunctions(app);
        const moveOrderToHistory = httpsCallable(functions, 'moveOrderToHistory');
        const result = await moveOrderToHistory({ orderId: order.id });
        console.log(result.data); //log the result (success message)
      } catch (error) {
        console.error('Error moving order to history:', error);
      }
    },
    beforeDestroy() {
      clearInterval(this.intervalID);
    },
    logout() {
      //logout function, to logout and remove from all databases
      const functions = getFunctions(app);
      const logoutDB = httpsCallable(functions, 'logout');
      logoutDB( { "uid" : this.uid } )
          .then((result) => {
            //read result of the Cloud Function.
            /** @type {any} */
            console.log("result:", result);
            signOut(getAuth(app)).then(() => {
              this.$router.push("/");
              console.log("logged out");
            });
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            console.log(errorCode)
            console.log(errorMessage)
            // ..
          });
    }
  }
};
</script>

<style scoped>
.confirmation-container {
  max-width: 600px;
  margin: 30px auto;
  padding: 20px;
  text-align: center;
}

.confirmation-title {
  color: #E9B464;
  font-size: 2.5rem;
}

.confirmation-message {
  color: #EDC9AF;
  font-size: 1.2rem;
  margin: 10px 0;
}

.orders-list h2 {
  color: #E9B464;
  margin-bottom: 15px;
}

.order-item {
  background-color: #2C303A;
  border: 1px solid #3D4148;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.order-details {
  text-align: left;
}

.order-details h5,
.order-details h6 {
  color: #E9B464;
  margin: 5px 0;
}

.collect-btn {
  background-color: #6D4F4B;
  color: #EDC9AF;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.collect-btn:hover {
  background-color: #D5954E;
}

.all-collected-message {
  color: #E9B464;
}

.logout-btn {
  background-color: #6D4F4B;
  color: #EDC9AF;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 1.2rem;
  margin-top: 20px;
}

.logout-btn:hover {
  background-color: #D5954E;
}
</style>

