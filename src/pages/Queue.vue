<template>
  <body>
  <div class="queue-container">
    <h1>Welcome to the Queue</h1>
    <div class="queue-card">
      <div v-if="queuePosition > 0" class="queue-info"><span class="info-title">Position:</span> {{ queuePosition }}</div>
      <div v-if="queueSize > 0" class="queue-info"><span class="info-title">Queue Size:</span> {{ queueSize }}</div>
    </div>
    <div class="load">
    </div>
  </div>
  </body>
</template>

<script>
import app from "../api/firebase"
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAuth, onAuthStateChanged } from "firebase/auth"
export default {
  name: "Queue",
  data() {
    return {
      uid: "",
      queuePosition: 0,
      queueSize: 0,
      activeUsers: 0,
      intervalID: null
    };
  },
  created() { //adds the user to the queue, if the user logs out at any stage we remove them from the queue
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        this.removeUserFromQueue();
      } else {
        this.addToQueue();
      }
    });
    //interval to constantly check queue status
    this.intervalID = setInterval(async () => {
      await this.getQueue();
      await this.implementQueue();
    }, 5000);
  },
  computed: {
    loadingBarWidth() {
      if (this.queueSize === 0) return 100;
      const progress = ((this.queueSize - this.queuePosition + 1) / this.queueSize) * 100;
      return Math.min(Math.max(progress, 0), 100);
    },
  },
  methods: {
    //adds the user to the queue database, with the uid as the doc id
    addToQueue() {
      const auth = getAuth(app);
      const user = auth.currentUser;
      if (!user) {
        return;
      }
      this.uid = user.uid;
      const functions = getFunctions(app);
      const addToQueue = httpsCallable(functions, 'addToQueueDB');
      addToQueue({"uid": this.uid})
          .then((result) => {})
          .catch((error) => {});
    },
    async implementQueue() {
      //first check that the user is authenticated
      const auth = getAuth(app);
      const user = auth.currentUser;
      if (!user) {
        return;
      }
      //here were allowing acess to only 1 user to the site, this could change
      if (this.activeUsers < 1 && this.queuePosition === 1) {
        await this.removeUserFromQueue();
        await this.addToActiveUsers();
        this.$router.push({path: '/menu'})
        clearInterval(this.intervalID); //stop calling the function
      }
    },
    async removeUserFromQueue() {
      try {
        const functions = getFunctions();
        const removeUser = httpsCallable(functions, 'removeFromQueue');
        await removeUser({"uid": this.uid});
      } catch (error) {}
    },
    async addToActiveUsers() {
      try {
        const functions = getFunctions();
        const addToActiveUsers = httpsCallable(functions, 'addToActiveUsersDB');
        await addToActiveUsers({"uid": this.uid});
      } catch (error) {}
    },
    //function returns the queue size and the user's position in the queue
    async getQueue() {
      const auth = getAuth(app);
      const user = auth.currentUser;
      if (!user) {
        return;
      }
      const functions = getFunctions(app);
      const getQueue = httpsCallable(functions, 'getQueue');
      try {
        const queue = await getQueue({"uid": this.uid});
        this.queuePosition = queue.data.queuePosition;
        this.queueSize = queue.data.queueSize;
      } catch (error) {}
      const checkActiveUser = httpsCallable(functions, 'checkActiveUser');
      try {
        //calls the function to check active users
        const result = await checkActiveUser();
        this.activeUsers = result.data === "No data in database" ? 0 : result.data;
      } catch (error) {}
    },
    beforeRouteLeave(to, from, next) {
      clearInterval(this.intervalId);
      next();
    }
  }
}
</script>

<style scoped>

body{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #191C23;
  color: #E9B464;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}


@-webkit-keyframes rotate {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}

.load {
  width: 100px;
  height: 100px;
  margin: 110px auto 0;
  border:solid 10px #E9B464;
  border-radius: 50%;
  border-right-color: transparent;
  border-bottom-color: transparent;
  -webkit-transition: all 0.5s ease-in;
  -webkit-animation-name:             rotate;
  -webkit-animation-duration:         1.0s;
  -webkit-animation-iteration-count:  infinite;
  -webkit-animation-timing-function: linear;

  transition: all 0.5s ease-in;
  animation-name:             rotate;
  animation-duration:         1.0s;
  animation-iteration-count:  infinite;
  animation-timing-function: linear;
}

.queue-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  padding: 0;
  margin: 0;
}
h1 {
  color: #E9B464;
  margin-bottom: 2rem;
  font-size: 3rem;
}
.queue-card {
  background-color: #6D4F4B;
  border-radius: 8px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
  padding: 1.5rem;
  width: 100%;
  max-width: 600px;
  text-align: left;
}
.queue-info {
  margin: 10px 0;
  font-size: 1.2rem;
  color: #EDC9AF;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #444;
  padding-bottom: 8px;
}
.info-title {
  font-weight: bold;
  color: #E9B464;
}
.loading-bar-container {
  width: 100%;
  max-width: 600px;
  background-color: #444; /* Lighter shade for the container */
  border-radius: 4px;
  margin-top: 1rem;
}
.loading-bar {
  height: 20px;
  background-color: #E9B464; /* Use the theme's accent color */
  border-radius: 4px;
  transition: width 0.5s ease-in-out; /* Smooth transition for width changes */
}
</style>

