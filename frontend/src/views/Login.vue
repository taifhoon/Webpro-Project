<style>
 .loginpage{
    background-image:linear-gradient(to right, #090717 , #35090F);
    background-size:cover;
    width: 100vw;
    height: 100vh;
  } 

  .box2{
    width: 500px;
    height: 600px;
    margin-top: 30px;
  }
  .loginbutton{
    color: #3273dc;
    cursor: pointer;
    text-decoration: none;
  }
  .buttlogin{
    background-image:linear-gradient(to right, #55030e , #340347);
    background-size:cover;
    border-radius: 5px;
    color:white;
  }
</style>
<template>
<body class='loginpage'>
  <div class="container is-widescreen">
    <div class="columns is-centered">
      <div class='box box2'>
      <div class="column ">
        <h1 class="title">Log in</h1>
        <p
          v-if="error"
          class="
            px-3
            py-2
            mb-3
            has-text-danger-dark has-background-danger-light
          "
        >
          {{ error }}
        </p>

        <!-- Login form -->
        <div class='bgfrom'>
        <div class="field">
          <label class="label">Email</label>
          <div class="control has-icons-left">
            <input v-model="email" class="input" type="text" placeholder="Type your Email" />
            <span class="icon is-small is-left">
              <i class="fas fa-user"></i>
            </span>
          </div>
        </div>

        <div class="field">
          <label class="label">Password</label>
          <div class="control has-icons-left has-icons-right">
            <input v-model="password" class="input" type="password" placeholder="Type your Password"/>
            <span class="icon is-small is-left">
              <i class="fas fa-lock"></i>
            </span>
          </div>
        </div>

        <button class="button is-fullwidth buttlogin" @click="submit">
          Login
        </button>

        <p class="my-3">
          Don't have an account yet? 
          <router-link to="/user/signup" >
          <a class='loginbutton'>Signup</a>
          </router-link>
        </p>
        </div>
      </div>
      </div>
    </div>
  </div>
</body>
</template>

<script>
import axios from '@/plugins/axios'

export default {
  data() {
    return {
      email: "",
      password: "",
      error: "",
    };
  },
  methods: {
    submit() {
      const data = {
        email: this.email,
        password: this.password,
      };
      axios
        .post("http://localhost:3000/user/login/", data)
        .then((res) => {
          const token = res.data.token;
          localStorage.setItem("token", token);
          this.$emit("auth-change");
          this.$router.push({ path: "/" });
        })
        .catch((error) => {
          this.error = error.response.data;
          console.log(error.response.data);
        });
    },
  },
};
</script>