<template>
  <!-- Navigation-->
  <nav class="navbar navbar-expand-lg bg-secondary text-uppercase fixed-top" id="mainNav">
    <div class="container">
      <router-link class="navbar-brand" to="/">Buskers Brightest</router-link>
      <button class="navbar-toggler text-uppercase font-weight-bold bg-primary text-white rounded" type="button"
              data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive"
              aria-expanded="false" aria-label="Toggle navigation">Menu
        <i class="fas fa-bars"></i>
      </button>
      <div class="collapse navbar-collapse" id="navbarResponsive">
        <ul class="navbar-nav ms-auto">
          <li v-if="!isLoggedIn" class="nav-item mx-0 mx-lg-1"><router-link
              class="nav-link py-3 px-0 px-lg-3 rounded" to="/">Home</router-link></li>
          <li v-if="!isLoggedIn" class="nav-item mx-0 mx-lg-1"><router-link
              class="nav-link py-3 px-0 px-lg-3 rounded" to="/registration">Sign Up</router-link></li>
          <li v-if="!isLoggedIn" class="nav-item mx-0 mx-lg-1"><router-link
              class="nav-link py-3 px-0 px-lg-3 rounded" to="/login">Sign In</router-link></li>
          <li v-if="isLoggedIn" class="nav-item mx-0 mx-lg-1"><router-link
              class="nav-link py-3 px-0 px-lg-3 rounded" to="/secure">Secure</router-link></li>
          <li v-if="isLoggedIn" class="nav-item mx-0 mx-lg-1"><router-link @click="logout"
                                                                           class="nav-link py-3 px-0 px-lg-3 rounded" to="/">Logout</router-link></li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
import app from "../api/firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
export default {
  name: "Navigation",
  data() {
    return {
      isLoggedIn: false,
      uid: ""
    }
  },
  mounted() {
    window.addEventListener("beforeunload", this.handleBeforeUnload);
  },
  created() {    // Check if the user is logged in
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        this.isLoggedIn = true;
        this.uid = user.uid;
        console.log("nav uid", this.uid)
      } else {
        this.isLoggedIn = false;
        this.logout();
      }
    });
  },
  methods: {
    async handleBeforeUnload(event) {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        try{
          await this.logout();
        }
        catch (error) {
          console.log(error);
        }
      }
      event.preventDefault();
      event.returnValue = "";
    },
    beforeUnmount() {
      window.removeEventListener("beforeunload", this.handleBeforeUnload);
    },
    logout() {
      const functions = getFunctions(app);
      const logoutDB = httpsCallable(functions, 'logout');
      const staffLogout = httpsCallable(functions, 'staffLogout');
      console.log(this.uid);
      if(this.uid === "afMWnPNYX6ZT5PA63RP8kyE3XZi1" ) {
        staffLogout().then((result) => {
          /** @type {any} */
          console.log("result from staff logout:", result);
          signOut(getAuth(app)).then(() => {
            this.$router.push("/");
            console.log("logged out from getAuth");
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
      else {
        console.log("user logout");
        logoutDB( { "uid" : this.uid } )
            .then((result) => {
              // Read result of the Cloud Function.
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
  }
};

</script>