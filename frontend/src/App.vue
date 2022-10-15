<style>
@import url("https://fonts.googleapis.com/css2?family=Anton&family=Kanit&family=Noto+Sans+Thai:wght@900&family=Varela+Round&display=swap");
* {
  font-family: "Varela Round", sans-serif;
}
/* #app{
   background-image:linear-gradient(to bottom, #35090F , #090717); 
} */
.nav,
.navbar-link,
.navbar-dropdown {
  background-image: linear-gradient(to right, #090717, #35090f);
  background-size: cover;
}
.fontnamegroup {
  font-weight: 800;
  font-size: 30px;
  color: #d2aa5a;
}
.fontnav {
  font-weight: 800;
  font-size: 30px;
  color: white;
}
.usernav {
  color: white;
  font-weight: 400;
}
.fontdropdown {
  color: #ffffff;
  display: block;
  line-height: 1.5;
  padding: 0.5rem 0.75rem;
  position: relative;
}
</style>
<template>
  <div id="app">
    <!-- nav bar -->
    <nav class="navbar nav" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <div class="navbar-item is-size-4">
          <p class="fontnamegroup">Loving Theater</p>
        </div>
        <router-link to="/" class="navbar-item is-size-4">
          <p class="fontnav">Movies</p>
        </router-link>

        <a
          role="button"
          class="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div class="navbar-menu">
        <div class="navbar-end">
          <div v-if="user" class="navbar-item">
            <router-link to="/addmovie" v-if="user.role == 'admin'">
              <button class="button is-white">Add Movie</button>
            </router-link>
          </div>
          <div v-if="user" class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              <figure class="image is-24x24 my-auto">
                <img
                  class="is-rounded"
                  src="https://bulma.io/images/placeholders/128x128.png"
                />
              </figure>
              <span class="pl-3 usernav">{{ user.c_name }}</span>
            </a>
            <div class="navbar-dropdown">
              <a class="fontdropdown" @click="profile()">Profile</a>
              <a class="fontdropdown" @click="logout()">Log out</a>
            </div>
          </div>

          <div v-if="!user" class="navbar-item">
            <router-link to="/user/login">
              <strong style="color: white">Login</strong>
            </router-link>
          </div>
          <div v-if="!user" class="navbar-item">
            <router-link to="/user/signup">
              <strong style="color: white">Signup</strong>
            </router-link>
          </div>
        </div>
      </div>
    </nav>
    <router-view
      :key="$route.fullPath"
      @auth-change="onAuthChange"
      :user="user"
    />
  </div>
</template>

<script>
import axios from "@/plugins/axios";
export default {
  data() {
    return {
      user: null,
    };
  },
  mounted() {
    this.onAuthChange();
  },
  methods: {
    onAuthChange() {
      const token = localStorage.getItem("token");
      if (token) {
        this.getUser();
      }
    },
    getUser() {
      const token = localStorage.getItem("token");
      axios.get("/user/me").then((res) => {
        this.user = res.data;
      });
    },
    logout() {
      localStorage.removeItem("token");
      this.$router.push({ path: `/user/login` });
    },
    profile() {
      this.$router.push({ path: `/profile/${this.user.cid}` });
    },
  },
};
</script>