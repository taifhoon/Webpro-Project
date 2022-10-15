<style >
  .signuppage{
    background-image:linear-gradient(to right, #090717 , #35090F);
    background-size:cover;
    width: 100vw;
    height: 100vh;
  }
  .box3{
    width: 600px;
    height: 700px;
    margin-top: 30px;
  }
  .buttsignup{
    background-image:linear-gradient(to right, #55030e , #340347);
    background-size:cover;
    border-radius: 5px;
    color:white;
  }
</style>
<template>
<body class='signuppage'>
  <div>
    <div class="container is-widescreen">
      <div class="columns is-centered">
      <div class='box box3'>
        <div class="column">
          <h1 class="title">Sign Up</h1>
          <!-- Sign up form -->
          <div class="field">
            <label class="label">Name</label>
            <div class="control has-icons-left">
              <input
                v-model="$v.c_name.$model"
                :class="{ 'is-danger': $v.c_name.$error }"
                class="input"
                type="text"
                placeholder="Type your Name"
              />
              <span class="icon is-small is-left">
                <i class="fas fa-user"></i>
              </span>
            </div>
            <template v-if="$v.c_name.$error">
              <p class="help is-danger" v-if="!$v.c_name.required">
                This field is required
              </p>
              <p class="help is-danger" v-if="!$v.c_name.minLength">
                Must be at least 5 characters
              </p>
            </template>
          </div>

          <div class="field">
            <label class="label">Password</label>
            <div class="control has-icons-left has-icons-right">
              <input
                v-model="$v.password.$model"
                :class="{ 'is-danger': $v.password.$error }"
                class="input"
                type="password"
                placeholder="Type your Password"
              />
              <span class="icon is-small is-left">
                <i class="fas fa-lock"></i>
              </span>
            </div>
            <template v-if="$v.password.$error">
              <p class="help is-danger" v-if="!$v.password.required">
                This field is required
              </p>
              <p class="help is-danger" v-if="!$v.password.minLength">
                Must be at least 8 character
              </p>
              <p class="help is-danger" v-if="!$v.password.complex">
                Password too easy
              </p>
            </template>
          </div>

          <div class="field">
            <label class="label">Confirm Password</label>
            <div class="control has-icons-left has-icons-right">
              <input
                v-model="$v.confirm_password.$model"
                :class="{ 'is-danger': $v.confirm_password.$error }"
                class="input"
                type="password"
                placeholder="Confirm Your Password"
              />
              <span class="icon is-small is-left">
                <i class="fas fa-lock"></i>
              </span>
            </div>
            <template v-if="$v.confirm_password.$error">
              <p class="help is-danger" v-if="!$v.confirm_password.sameAs">
                Password not match
              </p>
            </template>
          </div>

          <div class="field">
            <label class="label">Email</label>
            <div class="control has-icons-left has-icons-right">
              <input
                v-model="$v.email.$model"
                :class="{ 'is-danger': $v.email.$error }"
                class="input"
                type="text"
                placeholder="Type Your Email"
              />
              <span class="icon is-small is-left">
                <i class="fas fa-envelope"></i>
              </span>
            </div>
            <template v-if="$v.email.$error">
              <p class="help is-danger" v-if="!$v.email.required">
                This field is required
              </p>
              <p class="help is-danger" v-if="!$v.email.email">Invalid Email</p>
            </template>
          </div>

          <div class="field">
            <label class="label">Mobile Number</label>
            <div class="control has-icons-left has-icons-right">
              <input
                v-model="$v.mobile.$model"
                :class="{ 'is-danger': $v.mobile.$error }"
                class="input"
                type="text"
                placeholder="Type Your Phone Number"
              />
              <span class="icon is-small is-left">
                <i class="fas fa-mobile"></i>
              </span>
            </div>
            <template v-if="$v.mobile.$error">
              <p class="help is-danger" v-if="!$v.mobile.required">
                This field is required
              </p>
              <p class="help is-danger" v-if="!$v.mobile.mobile">
                Invalid Mobile Number
              </p>
            </template>
          </div>
          <button class="button  is-fullwidth buttsignup" @click="submit()">Sign Up</button>
          <p class="my-3">Already have an account? 
            <router-link to="/user/login">
              <a>Login</a>
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
import axios from 'axios'
import {
  required,
  email,
  helpers,
  minLength,
  maxLength,
  sameAs,
} from "vuelidate/lib/validators";

function mobile(value) {
  return !helpers.req(value) || !!value.match(/0[0-9]{9}/);
}

function complexPassword(value) {
  if (!(value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/[0-9]/))) {
    return false;
  }
  return true;
}

export default {
  data() {
    return {
      c_name: "",
      password: "",
      confirm_password: "",
      email: "",
      mobile: "",
    };
  },
  methods: {
    submit() {
      // Validate all fields
      this.$v.$touch();

      // เช็คว่าในฟอร์มไม่มี error
      if (!this.$v.$invalid) {
        let data = {
          c_name: this.c_name,
          password: this.password,
          confirm_password: this.confirm_password,
          email: this.email,
          mobile: this.mobile,
        };

        axios
          .post("http://localhost:3000/user/signup", data)
          .then((res) => {
            alert("Sign up Success");
            this.$router.push({ path: "/user/login" });
          })
          .catch((err) => {
            alert(err.response.data.details.message)
          });
      }
    },
  },
  validations: {
    email: {
      required: required,
      email: email,
    },
    mobile: {
      required: required,
      mobile: mobile,
    },
    password: {
      required: required,
      minLength: minLength(8),
      complex: complexPassword,
    },
    confirm_password: {
      sameAs: sameAs("password"),
    },
    c_name: {
      required: required,
      minLength: minLength(3),
      maxLength: maxLength(30),
    },
  },
};
</script>