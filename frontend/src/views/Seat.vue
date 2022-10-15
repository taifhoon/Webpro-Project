<style>
.seatpage {
  background-image: url(https://cdn.discordapp.com/attachments/793163190786719765/970779469440770048/unknown.png);
  background-size: cover;
  width:100vw;
  height:100vh;
}
.seat {
  font-size: 50px;
}
.user {
  position: absolute;
  padding: 14px;
  padding-top: 10px;
  font-size: 35px;
  color: rgb(177, 170, 170);
}
.row_seat {
  font-weight: 1000;
  color: white;
}
.table td {
  padding: 5px;
  border: 0;
}
.summary {
  color: #d2aa5a;
  font-size: 25px;
  margin-bottom: 5px;
}
.img {
  width: 100px;
  height: 200px;
}
.font {
  font-size: 17px;
}
.buy {
  background-color: #ee0014;
  color: white;
}
.screen {
  width: 90%;
}
.table {
  background-image: url(https://cdn.discordapp.com/attachments/793163190786719765/970779469440770048/unknown.png);
  background-size:cover;
  border-radius: 10px;
  padding:10px;
}
.summaryy {
  background-color: aliceblue;
}
.order {
  color: black;
  font-weight: 500;
  margin-bottom: 5px;
}
.buttconfirm{
    background-image:linear-gradient(to right, #08ad23 , #038603);
    background-size:cover;
    border-radius: 5px;
    color: white;
}
.buttcancle{
    background-image:linear-gradient(to right, #a32711 , #690606);
    background-size:cover;
    border-radius: 5px;
    color: white;
}
</style>
<template>
  <body class="seatpage">
    <div class="container is-widescreen">
      <section class="section">
        <div>
          <div class="columns">
            <div class="column is-8">
            <div>
                <img src="https://cdn.discordapp.com/attachments/793163190786719765/971119488386879578/unknown.png" class='screen'>
              </div>
              <table class="table">
                <tbody>
                  <tr v-for="numr in numrow" :key="numr">
                    <td>
                      <p class="row_seat">{{ alpha[numrow - numr] }}</p>
                    </td>
                    <td
                      class="seat"
                      v-for="numc in numcol"
                      :key="numc"
                      @click="addSeat(seat[calIndexSeat(numr, numc)])"
                    >
                      <!-- Icon User -->
                      <i
                        class="fas fa-user-alt user"
                        v-if="checkSeat(seat[calIndexSeat(numr, numc)])"
                      ></i>
                      <!-- Icon select -->
                      <i
                        class="fas fa-check-circle user"
                        v-if="checkSelect(seat[calIndexSeat(numr, numc)])"
                        key="true"
                      ></i>
                      <!-- Icon Seat -->
                      <i
                        class="fas fa-couch seat"
                        :style="getcolor(seat[calIndexSeat(numr, numc)])"
                      ></i>
                    </td>
                    <td>
                      <p class="row_seat">{{ alpha[numrow - numr] }}</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="column is-4">
              <p class="summary">SUMMARY</p>
              <div class="box summaryy">
                <div class="content">
                  <div class="columns">
                    <div class="column is-4">
                      <img :src="detail.img_movie" alt="" v-if="detail.img_movie.slice(0,5) == 'https'">
                      <img :src="'http://localhost:3000/'+detail.img_movie" alt="" v-else>
                    </div>
                    <div class="column is-8">
                      <div class="font">{{ detail.m_name }}</div>
                      <div>
                        <i class="fas fa-volume-up"></i> {{ detail.language }}
                      </div>
                      <br />
                      <div class="font">
                        SHOWTIME: {{ detail.st_time.slice(0, 5) }}
                      </div>
                    </div>
                  </div>
                  <div class="columns">
                    <div class="column is-8">
                      <div class="font">SEAT:</div>
                      <div class="font">{{ select }}</div>
                    </div>
                    <div class="column is-4">
                      <div class="font">PRICE:</div>
                      <div class="font">{{ price }} THB</div>
                    </div>
                  </div>
                  <div class="columns is-centered">
                    <button
                      class="button is-half buy"
                      @click="openmodalConfirm()"
                    >
                      BUY NOW
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div class="modal" :class="{ 'is-active': modalConfirm }">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Confirm Buy Ticket</p>
            <button
              class="delete"
              aria-label="close"
              @click="cancel()"
            ></button>
          </header>
          <section class="modal-card-body">
            <!-- Content ... -->
            <div class="column">
              <p class="order">SUMMARY</p>
              <div class="box">
                <div class="content">
                  <div class="columns">
                    <div class="column is-4">
                      <img :src="detail.img_movie" alt="" />
                    </div>
                    <div class="column is-8">
                      <div class="font">{{ detail.m_name }}</div>
                      <div>
                        <i class="fas fa-volume-up"></i> {{ detail.language }}
                      </div>
                      <br />
                      <div class="font">
                        SHOWTIME: {{ detail.st_time.slice(0, 5) }}
                      </div>
                    </div>
                  </div>
                  <div class="columns">
                    <div class="column is-8">
                      <div class="font">SEAT:</div>
                      <div class="font">{{ select }}</div>
                    </div>
                    <div class="column is-4">
                      <div class="font">PRICE:</div>
                      <div class="font">{{ price }} THB</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <footer class="modal-card-foot">
            <button class="button buttconfirm" @click="confirm()">
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
export default {
  name: "Seat",
  props: ['user'],
  data() {
    return {
      seat: [],
      theatre: [],
      detail: "",
      numrow: 5,
      numcol: 10,
      alpha: ["A", "B", "C", "D", "E"],
      ticket: [],
      selectSeat: [],
      modalConfirm: false,
      orderid: null,
    };
  },
  mounted() {
    this.getSeat(this.$route.params.showid);
    this.getticket(this.$route.params.showid);
  },
  computed: {
    select() {
      function compare(a, b) {
        if (a.seat_id > b.seat_id) {
          return 1;
        } else if (a.seat_id < b.seat_id) {
          return -1;
        } else {
          return 0;
        }
      }
      var text = "";
      if (this.selectSeat.length > 0) {
        // this.selectSeat.sort(compare);
        this.selectSeat.forEach((data) => {
          text += data.no_of_seats + ", ";
        });
      }
      return text.slice(0, -2);
    },
    price() {
      var price = 0;
      this.selectSeat.forEach((data) => {
        price += data.price;
      });
      return price;
    },
  },
  methods: {
    getSeat(id) {
      axios
        .get(`http://localhost:3000/show/${id}`)
        .then((response) => {
          this.seat = response.data.seat;
          this.seat.forEach((seat) => {
            if (seat.SEAT_TYPE_type_id == 1) {
              seat.price = 200;
            } else if (seat.SEAT_TYPE_type_id == 2) {
              seat.price = 260;
            } else if (seat.SEAT_TYPE_type_id == 3) {
              seat.price = 300;
            }
          });
          this.theatre = response.data.theatre;
          this.detail = response.data.detail[0];
          if (this.theatre == 3) {
            this.numrow = 3;
            this.numcol = 5;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getcolor(seat) {
      if (seat.SEAT_TYPE_type_id == 1) {
        return { color: "#DC143C" };
      } else if (seat.SEAT_TYPE_type_id == 2) {
        return { color: "#00008B" };
      } else if (seat.SEAT_TYPE_type_id == 3) {
        return { color: "#B8860B" };
      }
    },
    getticket(showid) {
      axios
        .get(`http://localhost:3000/getticket/${showid}`)
        .then((response) => {
          this.ticket = response.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    checkSeat(seat) {
      var check = false;
      this.ticket.forEach((ticket) => {
        if (ticket.SEAT_seat_id == seat.seat_id) {
          return (check = true);
        }
      });
      return check;
    },
    calIndexSeat(row, col) {
      return (
        this.numrow * this.numcol -
        ((row - 1) * this.numcol + (this.numcol - col + 1))
      );
    },
    addSeat(seat) {
      var check = this.selectSeat.find((data) => data.seat_id == seat.seat_id);
      if (!check && !this.checkSeat(seat)) {
        this.selectSeat.push(seat);
      } else {
        this.selectSeat = this.selectSeat.filter(
          (data) => data.seat_id != seat.seat_id
        );
      }
    },
    checkSelect(seat) {
      var check = false;
      this.selectSeat.forEach((data) => {
        if (data.seat_id == seat.seat_id) {
          return (check = true);
        }
      });
      return check;
    },
    openmodalConfirm() {
      if (this.user.role == 'admin'){
        alert('Not Permission')
      }else if (this.selectSeat.length > 0) {
        this.modalConfirm = true;
      }
    },
    cancel() {
      this.modalConfirm = false;
    },
    confirm() {
      axios
        .post(`http://localhost:3000/createorder`, {
          seat: this.select,
          price: this.price,
          listSeat: this.selectSeat,
          showid: this.$route.params.showid,
          cid: this.user.cid,
        })
        .then((response) => {
          this.$router.push(`/ticket/${response.data.insertId}`);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>