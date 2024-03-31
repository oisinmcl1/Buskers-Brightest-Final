<template>
  <navbar />
  <div class="main-container">
    <div class="content-and-logo">
      <div class="text-container">
        <h1>Busker's Brightest</h1>
        <h2>Bar Queue System</h2>
        <div class="links-container">
          <router-link to="/login" v-if="!isLoggedIn" class="router-link">Log in</router-link>
          <router-link to="/registration" v-if="!isLoggedIn" class="router-link">Sign up</router-link>
          <router-link to="/stafflogin" v-if="!isLoggedIn" class="router-link">Staff Login</router-link>
        </div>
      </div>
      <div class="navigation">
        <button v-if="isLoggedIn" @click="logout" class="nav-button">Logout</button>
      </div>
      <div class="logo-container">
        <img src="@/assets/busklogo.png" alt="Busker's Brightest Logo" class="logo">
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import app from '../api/firebase';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import Navbar from "@/components/Navbar.vue";

export default {
  name: "Navigation",
  components: {Navbar},
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

<style scoped>
html, body {
  font-family: 'Helvetica Neue', sans-serif;
  background-color: #191C23;
  color: #E9B464;
  margin: 0;
  padding: 0;
  height: 100%;
}

.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #191C23;
  color: #E9B464;
}
.nav-button{
  font-size: 1.5rem;
  font-weight: bold;
  color: #EDC9AF;
  background-color: #6D4F4B;
  padding: 10px 20px;
  margin: 0 5px;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s, transform 0.3s;

}
.nav-button:hover {
  background-color: #D5954E;
  transform: translateX(5px);
}
.content-and-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

h1 {
  font-size: 4rem;
  font-weight: bold;
  color: #E9B464;
  margin-bottom: 0.5rem;
}

h2 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #A5763E;
  margin-bottom: 1.5rem;
}

.links-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding: 20px 0;
}

.auth-links,
.menu-links {
  display: flex;
  margin: 0 20px;
}

.router-link {
  font-size: 1.5rem;
  font-weight: bold;
  color: #EDC9AF;
  background-color: #6D4F4B;
  padding: 10px 20px;
  margin: 0 5px;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s, transform 0.3s;
}

.router-link:hover {
  background-color: #D5954E;
  transform: translateX(5px);
}

.logo-container {
  order: -1;
  max-height: 200px;
  max-width: 100%;
  margin-bottom: 2rem;
}

.logo {
  height: auto;
  max-width: 100%;
  max-height: 200px;
}
</style>
