<style>
.profilepage {
  background-image: linear-gradient(to right, #090717, #35090f);
  background-size: cover;
  width: 100%;
  height: 100%;
  min-height: 100vh;
}
.fontd {
  font-size: 25px;
}
#button1 {
  color: black;
}
.order_id {
  font-size: 20px;
  font-weight: 500;
}
.buttconfirm {
  background-image: linear-gradient(to right, #08ad23, #038603);
  background-size: cover;
  border-radius: 5px;
  color: white;
}
.buttcancle {
  background-image: linear-gradient(to right, #a32711, #690606);
  background-size: cover;
  border-radius: 5px;
  color: white;
}
.sizeimg {
  height: 20vw;
}
.head1 {
  width: 100%;
  font-size: 18px;
}
</style>
<template>
  <body class="profilepage">
    <div class="container is-widescreen">
      <section class="section">
        <div class="box">
          <div v-if="user.role == 'user'">ID : {{ user.cid }}</div>
          <div v-else>Admin ID : {{ user.admin_id }}</div>
          <br />
          <div>Name : {{ user.c_name }}</div>

          <div v-if="user.role == 'user'">
            <br />Phone : {{ user.phone_no }}
          </div>

          <div v-if="user.role == 'user'">
            <br />Email : {{ user.email_id }}
          </div>
          <div><br />Role : {{ user.role }}</div>
          <div>
            <br />
            <button class="button is-info" @click="openchangepass()">
              Change Password
            </button>
          </div>
        </div>
        <div class="columns is-multiline" v-if="user.role == 'user'">
          <div
            class="column is-6"
            v-for="ticket in ticket"
            :key="ticket.order_id"
          >
            <div class="card">
              <div class="card-image pt-4">
                <figure class="image is-200x200">
                  <img alt="" />
                </figure>
              </div>
              <div class="card-content">
                <div class="order_id">Order ID : {{ ticket.order_id }}</div>
                <div class="content">
                  <div class="columns">
                    <div class="column is-6">
                      <img
                        class="sizeimg"
                        :src="'http://localhost:3000/' + ticket.img_movie"
                        alt=""
                        v-if="
                          ticket.img_movie &&
                          ticket.img_movie.slice(0, 5) != 'https'
                        "
                      />
                      <img
                        class="sizeimg"
                        :src="ticket.img_movie"
                        alt=""
                        v-else
                      />
                    </div>
                    <div class="column is-6">
                      <div class="fontd">{{ ticket.m_name }}</div>
                      <div>
                        <i class="fas fa-volume-up"></i> {{ ticket.language }}
                      </div>
                      <br />
                      <div class="fontd">
                        SHOWTIME :
                        <br />
                      </div>
                      <div class="head1">
                        {{ new Date(ticket.show_date).toDateString() }}
                        <br />
                        {{ ticket.st_time.slice(0, 5) }}
                      </div>
                      <div class="fontd">
                        <br />
                        Theater :
                      </div>
                      <div class="head1">
                        {{ ticket.tname }}
                      </div>
                      <br />
                      <div class="fontd">Seat : {{ ticket.order_seats }}</div>
                      <br />
                      <div class="fontd">Price : {{ ticket.total_price }}</div>
                      <div class="fontd">Payment : {{ ticket.payment }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <footer class="card-footer">
                <router-link
                  class="card-footer-item"
                  id="button1"
                  :to="`/ticket/${ticket.order_id}`"
                  >Details</router-link
                >
              </footer>
            </div>
          </div>
        </div>
      </section>
      <div class="modal" :class="{ 'is-active': modalchangepass }">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Change Password</p>
            <button
              class="delete"
              aria-label="close"
              @click="cancel()"
            ></button>
          </header>
          <section class="modal-card-body">
            <!-- Content ... -->
            <div class="bgfrom">
              <div class="field">
                <label class="label">Old Password</label>
                <div class="control">
                  <input
                    v-model="$v.password.$model"
                    :class="{ 'is-danger': $v.password.$error }"
                    class="input"
                    type="text"
                    placeholder="Old Password"
                  />
                </div>
                <template v-if="$v.password.$error">
                  <p class="help is-danger" v-if="!$v.password.required">
                    This field is required
                  </p>
                </template>
              </div>
              <div class="field">
                <label class="label">New Password</label>
                <div class="control">
                  <input
                    v-model="$v.newpass.$model"
                    :class="{ 'is-danger': $v.newpass.$error }"
                    class="input"
                    type="text"
                    placeholder="New Password"
                  />
                </div>
                <template v-if="$v.newpass.$model">
                  <p class="help is-danger" v-if="!$v.newpass.required">
                    This field is required
                  </p>
                  <p class="help is-danger" v-if="!$v.newpass.minLength">
                    Must be at least 8 character
                  </p>
                  <p class="help is-danger" v-if="!$v.newpass.complex">
                    Password too easy (Must be atles1 UpperCase 1 Number)
                  </p>
                </template>
              </div>
              <div class="field">
                <label class="label">Confirm New Password</label>
                <div class="control">
                  <input
                    v-model="$v.confirmnewpass.$model"
                    :class="{ 'is-danger': $v.confirmnewpass.$error }"
                    class="input"
                    type="text"
                    placeholder="Confirm New Password"
                  />
                </div>
                <template v-if="$v.confirmnewpass.$error">
                  <p class="help is-danger" v-if="!$v.confirmnewpass.sameAs">
                    New Password not match
                  </p>
                </template>
              </div>
            </div>
          </section>
          <footer class="modal-card-foot">
            <button class="button buttconfirm" @click="changepass()">
              Confirm
            </button>
            <button class="button buttcancle" @click="cancel()">Cancel</button>
          </footer>
        </div>
      </div>
    </div>
  </body>
</template>
<script>
import axios from "@/plugins/axios";
// @ is an alias to /src
import {
  required,
  helpers,
  minLength,
  maxLength,
  sameAs,
} from "vuelidate/lib/validators";

function complexPassword(value) {
  if (!(value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/[0-9]/))) {
    return false;
  }
  return true;
}

export default {
  name: "Profile",
  props: ["user"],
  data() {
    return {
      order: [],
      ticket: [],
      password: "",
      newpass: "",
      confirmnewpass: "",
      modalchangepass: false,
    };
  },
  mounted() {
    this.getpayment();
  },
  methods: {
    getpayment() {
      axios
        .get(`http://localhost:3000/customer/${this.user.cid}`)
        .then((response) => {
          this.order = response.data.payment;
          this.ticket = response.data.movie;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    changepass() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        axios
          .put(`http://localhost:3000/changepass`, {
            cid: this.user.cid,
            password: this.password,
            newpass: this.newpass,
            confirmnewpass: this.confirmnewpass,
          })
          .then((response) => {
            alert("Success");
            this.cancel();
          })
          .catch((err) => {
            alert(err.response.data);
          });
      }
    },
    openchangepass() {
      this.modalchangepass = true;
    },
    cancel() {
      this.modalchangepass = false;
      this.password = "";
      this.newpass = "";
      this.confirmnewpass = "";
    },
  },
  validations: {
    password: {
      required: required,
      minLength: minLength(8),
    },
    newpass: {
      required: required,
      minLength: minLength(8),
      complex: complexPassword,
    },
    confirmnewpass: {
      sameAs: sameAs("newpass"),
    },
  },
};
</script>