<template>
  <div class="navbar-container">
    <nav class="navbar navbar-expand-lg bg-primary">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">Navbar</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" :to="{ path: '/' }">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ path: '/Products' }">Products</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ path: '/Cart' }">Cart</router-link>
            </li>
          </ul>
          <form class="d-flex" role="search">
            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-light" type="submit">Search</button>
          </form>
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
}

.navbar {
  background-color: #333;
}

.navbar-brand {
  color: #fff;
}

.navbar-nav .nav-link {
  color: #fff;
}

.navbar-nav .nav-link:hover {
  color: darkblue;
}

.btn-outline-light {
  color: #fff;
  border-color: #fff;
}

.btn-outline-light:hover {
  background-color: darkblue;
  color: black;
}
</style>