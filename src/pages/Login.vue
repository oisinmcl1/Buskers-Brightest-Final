<template>
  <navbar/>
  <body>
  <div class="login-container">
    <div class="form-container">
      <h1>Login</h1>
      <div class="form-group">
        <label for="exampleInputEmail1">Email address</label>
        <input type="email" v-model="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <input type="password" v-model="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
      </div>
      <button @click="login" class="btn btn-primary">Login</button>
    </div>
  </div>
  </body>
</template>

<script>
import app from "../api/firebase"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import Navbar from "@/components/Navbar.vue";
export default {
  name: "Login",
  components: {Navbar},
  data() {
    return {
      email: "",
      password: ""
    }
  },
  methods: {
    login() {
      const auth = getAuth(app);
      signInWithEmailAndPassword(auth, this.email, this.password)
          .then((userCredential) => {
            //user is signed in
            const user = userCredential.user;
            console.log(user)
            const functions = getFunctions(app);
            //next page is the queue
            this.$router.push({path: '/queue'})
            // ...
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
</script>
<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #191C23;
}

.form-container {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  background-color: #333;
}

.form-group label, .form-group input, .btn {
  font-size: 1.25rem;
  color: #E9B464;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.8rem;
  background-color: #333;
  border: 1px solid #444;
  border-radius: 5px;
  margin-top: 0.5rem;
}

.form-group input::placeholder {
  color: #EDC9AF;
}

.form-group {
  margin-bottom: 1rem;
}

h1 {
  color: #E9B464;
  font-size: 2.5rem;
  margin-bottom: 0.3rem;
}

.btn {
  background-color: #6D4F4B;
  padding: 0.8rem 1.2rem;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  font-weight: bold;
  width: 100%;
}

.btn:hover {
  background-color: #D5954E;
}

.btn:active {
  transform: scale(0.98);
}
</style>



