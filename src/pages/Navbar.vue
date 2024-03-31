
<template>
  <div class="navbar-container">
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/"><img src="../components/icons/BBlogoIcon.png" alt="BB Logo" width="80px" height="80px"></router-link>
        <!-- Add custom class to the button -->
        <button class="navbar-toggler custom-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" :to="{ path: '/' }"><img src="../components/icons/homeIcon.png" alt="Home" width="50px" height="50px"></router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ path: '/viewproducts' }"><img src="../components/icons/menuIcon.png" alt="Menu" width="50px" height="50px"></router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ path: '/login' }"><img src="../components/icons/loginIcon.png" alt="Login" width="50px" height="50px"></router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Navbar'
}
</script>

<style scoped>
.navbar-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: #6D4F4B;
}

.navbar .navbar-nav .nav-item .nav-link {
  color: yellow; /* Change color to yellow */
}

.container-fluid .navbar-toggler {
  color: yellow;
}

.navbar {
  color: #59290CFF;
  height: 80px; /* Adjust the height as needed */
}

.navbar-expand-lg {
  color: #59290CFF;
}

.navbar-brand {
  color: yellow;
}

.navbar-nav .nav-link {
  color: #fff;
}

.navbar-nav .nav-link:hover {
  color: orange;
}

.custom-toggler {
  border: 2px solid #eea231;
}

.btn-outline-light {
  color: #fff;
  border-color: #fff;
}

.btn-outline-light:hover {
  background-color: orange;
  color: black;
}

/* Force nav-items to display horizontally */
.navbar-nav .nav-item {
  display: inline-block;
  margin-right: 10px; /* Adjust spacing between items as needed */
}

.navbar-nav {
  margin-left: auto; /* Push nav items to the right */
}
</style>

