<template>
  <div>
    <h1>Admin Orders</h1>
    <div v-for="(customerOrders, index) in orders" :key="index"> <!-- displays product info -->
      <div v-for="(order, i) in customerOrders" :key="i">
        <h3>Order ID: {{ order.orderId }}</h3>
        <div>
          <h4>Customer Information:</h4>
          <p>Uid: {{ order.uid }}</p>

        </div>
        <div>
          <h5>Product Name: {{ order.name }}</h5>
          <br>
          <h6>Price: {{ order.price }}</h6>
          <br>
          <h7>Customer Key: {{ order.customerKey }}</h7>
          <br>
        </div>
        <br>
        <h9>=====================================</h9>
        <br>
      </div>
      <h8>Total Price: ${{ customerOrders.totalPrice }}</h8>
      <button @click="deleteOrder(customerOrders[0].customerKey)">Delete Order</button> <!-- deletes all customer order of same customer key -->


    </div>
  </div>
</template>

<script>
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default {
  data() {
    return {
      orders: [] //array to store orders
    };
  },
  async mounted() {
    //gets orders from Firestore "ordersInProgress" collection
    await this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      try {
        //gets firestore instance
        const db = getFirestore();
        //orders in progress collection reference
        const ordersCollection = collection(db, "ordersInProgress");
        //gets all documents in the collection
        const ordersSnapshot = await getDocs(ordersCollection);
        const ordersByCustomer = {}; // Object to store orders grouped by customer key
 //loop through each document in the collection
        ordersSnapshot.forEach((doc) => {
          const order = doc.data();
          const orderId = doc.id;
          const customerKey = order.customerKey;

          //check if the customer key already exists in the object
          if (ordersByCustomer[customerKey]) {
            ordersByCustomer[customerKey].push({ ...order, orderId });
          } else {
            ordersByCustomer[customerKey] = [{ ...order, orderId }];
          }
        });

        //converts object to array for easier iteration in the template
        this.orders = Object.values(ordersByCustomer);

        //calculate total price for each customers orders
        for (const customerOrders of this.orders) {
          let totalPrice = 0;
          for (const order of customerOrders) {
            //converts string to integer after removing firt character "$"
            totalPrice += parseInt(order.price.substring(1));
          }
          //adds total price to each customers orders
          customerOrders.totalPrice = totalPrice;
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    },

//deletes a whole order of a customer key
    async deleteOrder(customerKey) {
      try {
        const db = getFirestore();
        const ordersCollection = collection(db, "ordersInProgress");

        //find orders with the specified customerKey
        const ordersToDelete = this.orders.filter(customerOrders => customerOrders[0].customerKey === customerKey);

        //delete each order with the specified customerKey
        const deletePromises = ordersToDelete.map(async customerOrders => {
          for (const order of customerOrders) {
            await deleteDoc(doc(ordersCollection, order.orderId));
          }
        });

        //wait for all delete operations to complete
        await Promise.all(deletePromises);

        //after deletion updates new order list
        await this.fetchOrders();
        console.log("Orders with customer key", customerKey, "deleted successfully");
      } catch (error) {
        console.error("Error deleting orders by customer key:", error);
      }
    }
  }
};
</script>

<style>

</style>

<style>

</style>
