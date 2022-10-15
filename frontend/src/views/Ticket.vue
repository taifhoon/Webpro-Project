<style>
.buttonpay {
  width: 5%;
}
.ticketpage {
  background-image: linear-gradient(to right, #090717, #35090f);
  background-size: cover;
  width: 100%;
  height: 100%;
  min-height: 100vh;
}
.payment {
  font-size: 5em;
  color: white;
}
.fontd {
  font-size: 20px;
}
.imgqr {
  margin-top: 20px;
  width: 100%;
}
.buttback {
  margin-top: 10px;
}
.sizeimg {
  height: 20vw;
}
</style>
<template>
  <body class="ticketpage">
    <div class="container is-widescreen" v-if="order.payment == 'Incomplete'">
      <section>
        <div class="columns has-text-centered">
          <div class="column">
            <p class="payment">Payment</p>
          </div>
        </div>
        <div class="columns has-text-centered">
          <div class="column">
            <p>Detail</p>
          </div>
        </div>
        <div class="columns is-vcentered">
          <div class="column">
            <a @click="selectMethod = 1">
              <img
                src="https://w7.pngwing.com/pngs/279/210/png-transparent-wire-transfer-bank-account-payment-money-bank-angle-service-logo.png"
                alt=""
              />
            </a>
          </div>
          <div class="column">
            <a @click="selectMethod = 2">
              <img
                src="https://wws-weblinc.netdna-ssl.com/media/W1siZiIsIjIwMTcvMTEvMjkvMDkvNTUvMjMvMTYxL2NyZWRpdF9jYXJkX21ldGhvZHNfdjIuanBnIl0sWyJwIiwib3B0aW0iXV0/credit-card-methods-v2.jpg?sha=df358c639ca1d523"
                alt=""
              />
            </a>
          </div>
          <div class="column">
            <a @click="selectMethod = 3">
              <img
                src="https://play-lh.googleusercontent.com/AlvbO2kBE0jKrPjTn_yD4OAE-e3DOoVcuEjRxnyEIvFftLM7WPv-a7Ak5qBbNlecYy-V"
                alt=""
              />
            </a>
          </div>
        </div>
        <div class="columns has-text-centered">
          <div class="column">
            <button class="button is-success" @click="confirmPay()">
              Pay Now
            </button>
            <router-link :to="`/profile/${this.user.cid}`">
              <button class="button is-danger">Pay Later</button>
            </router-link>
          </div>
        </div>
      </section>
    </div>
    <div class="container is-widescreen" v-else>
      <section>
        <div class="columns has-text-centered">
          <div class="column">
            <p class="payment">Your Ticket</p>
          </div>
        </div>
        <div class="columns is-multiline">
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
                <div class="title">Ticket ID : {{ ticket.ticket_id }}</div>
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
                      <div class="fontd">Seat : {{ ticket.no_of_seats }}</div>
                      <div class="fontd">Price : {{ ticket.price }}</div>
                      <div>
                        <img
                          class="imgqr"
                          src="https://cdn.discordapp.com/attachments/793163190786719765/971427282310819881/qrcode.png"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                  <div class="columns"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="columns has-text-centered">
          <div class="column">
            <router-link :to="`/profile/${user.cid}`">
              <button class="button is-white buttback">Back</button>
            </router-link>
          </div>
        </div>
      </section>
    </div>
  </body>
</template>
<script>
import axios from "@/plugins/axios";

export default {
  props: ["user"],
  data() {
    return {
      order: [],
      ticket: [],
      // selectMethod: 1,
      // method1:false,
      // method2:false,
      // method3:false,
    };
  },
  mounted() {
    this.getdata();
  },
  computed: {},
  methods: {
    getdata() {
      axios
        .get(`http://localhost:3000/orderticket/${this.$route.params.orderid}`)
        .then((response) => {
          this.order = response.data.order[0];
          this.ticket = response.data.ticket;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    confirmPay() {
      axios
        .put(`http://localhost:3000/confirmorder`, {
          orderid: this.$route.params.orderid,
        })
        .then((response) => {
          alert("Payment Complete");
          this.getdata();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>