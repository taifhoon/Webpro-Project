<style>
.detailpage {
  background-image: url(https://cdn.discordapp.com/attachments/793163190786719765/970779469440770048/unknown.png);
  background-size: cover;
  width: 100%;
  height: 100%;
  min-height: 100vh;
}
.icon-time {
  padding: 9px 21px;
  margin-left: 30px;
  color: #916e29;
  border: #916e29 4px solid;
  border-radius: 20px;
  font-size: 20px;
  font-weight: 700;
}
.title {
  width: 100%;
  position: relative;
}
.release_date {
  color: #d2aa5a;
  font-size: 25px;
  margin-bottom: 5px;
}
.m_name {
  width: 70%;
  font-size: 40px;
  color: aliceblue;
}
.actors {
  width: 100%;
  font-size: 18px;
  color: silver;
}
.plot {
  width: 100%;
  font-size: 18px;
  color: silver;
}
.box1 {
  background-image: linear-gradient(to bottom, #931928, #160307);
  background-size: cover;
}
.font1 {
  padding-top: 20px;
  padding-left: 30px;
  font-weight: 1000;
  font-size: 30px;
  color: white;
}
.font2 {
  padding-top: 20px;
  padding-left: 30px;
  font-weight: 1000;
  font-size: 20px;
  color: white;
}
.sizeimg2 {
  height: 30vw;
}
.sizeimg3 {
  height: 15vw;
}
.fontaddshow {
  color: #363636;
  font-size: 1rem;
  font-weight: 700;
}
.buttdetail {
  margin: 5px;
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
  <body class="detailpage">
    <div class="container is-widescreen">
      <section class="section detail">
        <div class="content">
          <div class="columns is-multiline">
            <div class="column is-4">
              <figure>
                <img
                  class="sizeimg2"
                  :src="'http://localhost:3000/' + movie[0].img_movie"
                  alt=""
                  v-if="
                    movie[0].img_movie &&
                    movie[0].img_movie.slice(0, 5) != 'https'
                  "
                />
                <img class="sizeimg2" :src="movie[0].img_movie" alt="" v-else />
              </figure>
            </div>
            <div class="column is-8">
              <div class="title">
                <div class="m_name">{{ movie[0].m_name }}</div>
                <br />
                <div class="release_date">RELEASE DATE</div>
                <div class="actors">{{ changeDay(movie[0].release_date) }}</div>
                <br />
                <div class="release_date">ACTORS</div>
                <div class="actors">{{ movie[0].actors }}</div>
                <br />
                <div class="release_date">SYNOPSIS</div>
                <div class="plot">{{ movie[0].plot }}</div>
              </div>
              <div>
                <button
                  class="button buttdetail"
                  @click="openmodaledit()"
                  v-if="user.role == 'admin'"
                >
                  Edit
                </button>
                <button
                  class="button buttdetail"
                  @click="openmodaladdshow()"
                  v-if="user.role == 'admin'"
                >
                  Add Show Time
                </button>
                <button
                  class="button buttdetail"
                  @click="openmodaldeletemovie(movie[0].m_id)"
                  v-if="user.role == 'admin'"
                >
                  Delete Movie
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="content" v-for="day in date" :key="day.show_date">
          <div class="box box1">
            <div class="title">
              <p class="font1">{{ changeDay(day.show_date) }}</p>
            </div>
            <div class="content">
              <div v-for="theatre in theatre" :key="theatre.tid">
                <div>
                  <p class="font2">{{ theatre.tname }}</p>
                </div>
                <div
                  class="columns"
                  v-for="movie in movie"
                  :key="movie.show_id"
                  v-show="
                    movie.tid == theatre.tid && movie.show_date == day.show_date
                  "
                >
                  <div class="column">
                    <router-link :to="`/show/${movie.show_id}`">
                      <button class="button icon-time">
                        {{ movie.st_time }}
                      </button>
                    </router-link>
                    <button
                      class="button buttdetail"
                      @click="openmodaldeleteshowtime(movie.show_id)"
                      v-if="user.role == 'admin'"
                    >
                      Delete Show Time
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- modalEdit -->

      <div class="modal" :class="{ 'is-active': modalEdit }">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Edit Details Movie</p>
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
                <label class="label">Movie Name</label>
                <div class="control">
                  <input
                    v-model="$v.m_name.$model"
                    :class="{ 'is-danger': $v.m_name.$error }"
                    class="input"
                    type="text"
                    placeholder="Type Movie Name"
                  />
                </div>
                <template v-if="$v.m_name.$error">
                  <p class="help is-danger" v-if="!$v.m_name.required">
                    This field is required
                  </p>
                  <p class="help is-danger" v-if="!$v.m_name.minLength">
                    Must be at least 3 characters
                  </p>
                </template>
              </div>
              <div class="field">
                <label class="label">Release Date</label>
                <div class="control">
                  <input
                    v-model="$v.release_date.$model"
                    :class="{ 'is-danger': $v.release_date.$error }"
                    class="input"
                    type="date"
                    placeholder="Type Release Date"
                  />
                </div>
                <template v-if="$v.release_date.$error">
                  <p class="help is-danger" v-if="!$v.release_date.required">
                    This field is required
                  </p>
                </template>
              </div>
              <div class="field">
                <label class="label">Director</label>
                <div class="control">
                  <input
                    v-model="$v.director.$model"
                    :class="{ 'is-danger': $v.director.$error }"
                    class="input"
                    type="text"
                    placeholder="Type Director"
                  />
                </div>
                <template v-if="$v.director.$error">
                  <p class="help is-danger" v-if="!$v.director.required">
                    This field is required
                  </p>
                </template>
              </div>
              <div class="field">
                <label class="label">Actor</label>
                <div class="control">
                  <input
                    v-model="$v.actor.$model"
                    :class="{ 'is-danger': $v.actor.$error }"
                    class="input"
                    type="text"
                    placeholder="Type Actor"
                  />
                </div>
                <template v-if="$v.actor.$error">
                  <p class="help is-danger" v-if="!$v.actor.required">
                    This field is required
                  </p>
                </template>
              </div>
              <div class="field">
                <label class="label">Image Movie</label>
                <div class="control">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    @change="selectimage"
                  />
                </div>
              </div>
              <div class="field">
                <label class="label">Plot</label>
                <div class="control">
                  <input
                    v-model="$v.plot.$model"
                    :class="{ 'is-danger': $v.plot.$error }"
                    class="input"
                    type="text"
                    placeholder="Type Plot"
                  />
                </div>
                <template v-if="$v.plot.$error">
                  <p class="help is-danger" v-if="!$v.plot.required">
                    This field is required
                  </p>
                </template>
              </div>
            </div>
          </section>
          <footer class="modal-card-foot">
            <button class="button buttconfirm" @click="confirmedit()">
              Confirm
            </button>
            <button class="button buttcancle" @click="cancel()">Cancel</button>
          </footer>
        </div>
      </div>

      <!-- modalAddshow -->

      <div class="modal" :class="{ 'is-active': modalAddshow }">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Add Show Time</p>
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
                <label class="label">Show Date</label>
                <div class="control">
                  <input
                    v-model="$v.addshowdate.$model"
                    :class="{ 'is-danger': $v.addshowdate.$error }"
                    class="input"
                    type="date"
                    placeholder="Type Movie Name"
                  />
                </div>
                <template v-if="$v.addshowdate.$error">
                  <p class="help is-danger" v-if="!$v.addshowdate.required">
                    This field is required
                  </p>
                </template>
              </div>
              <div class="field">
                <label class="label">Start Time</label>
                <div class="control">
                  <input
                    v-model="$v.add_st_time.$model"
                    :class="{ 'is-danger': $v.add_st_time.$error }"
                    class="input"
                    type="time"
                    placeholder="Type Release Date"
                  />
                </div>
                <template v-if="$v.add_st_time.$model">
                  <p class="help is-danger" v-if="!$v.add_st_time.required">
                    This field is required
                  </p>
                </template>
              </div>
              <div class="field">
                <label class="label">End Time</label>
                <div class="control">
                  <input
                    v-model="$v.add_end_time.$model"
                    :class="{ 'is-danger': $v.add_end_time.$error }"
                    class="input"
                    type="time"
                    placeholder="Type Director"
                  />
                </div>
                <template v-if="$v.add_end_time.$error">
                  <p class="help is-danger" v-if="!$v.add_end_time.required">
                    This field is required
                  </p>
                </template>
              </div>
              <div class="field">
                <label class="fontaddshow">Choose language: </label>
                <select
                  v-model="$v.addlanguage.$model"
                  :class="{ 'is-danger': $v.addlanguage.$error }"
                >
                  <option><p>TH</p></option>
                  <option><p>ENG</p></option>
                </select>
                <template v-if="$v.addlanguage.$error">
                  <p class="help is-danger" v-if="!$v.addlanguage.required">
                    This field is required
                  </p>
                </template>
              </div>
              <div class="field">
                <label class="fontaddshow">Choose theatre: </label>
                <select
                  v-model="$v.addtheatre.$model"
                  :class="{ 'is-danger': $v.addlanguage.$error }"
                >
                  <option value="1"><p>JunRongJai 1</p></option>
                  <option value="2"><p>JunRongJai 2</p></option>
                </select>
                <template v-if="$v.addlanguage.$error">
                  <p class="help is-danger" v-if="!$v.addlanguage.required">
                    This field is required
                  </p>
                </template>
              </div>
            </div>
          </section>
          <footer class="modal-card-foot">
            <button class="button buttconfirm" @click="confirmaddshow()">
              Confirm
            </button>
            <button class="button buttcancle" @click="cancel()">Cancel</button>
          </footer>
        </div>
      </div>

      <!-- modaldeleteshowtime -->

      <div class="modal" :class="{ 'is-active': modaldeleteshowtime }">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Detail Delete Show Time</p>
            <button
              class="delete"
              aria-label="close"
              @click="cancel()"
            ></button>
          </header>
          <section class="modal-card-body">
            <!-- Content ... -->
            <div class="column">
              <p class="order">Are you sure to delete</p>
            </div>
          </section>
          <footer class="modal-card-foot">
            <button class="button buttconfirm" @click="deleteshowtime()">
              Confirm
            </button>
            <button class="button buttcancle" @click="cancel()">Cancel</button>
          </footer>
        </div>
      </div>

      <!-- modaldeletemovie -->

      <div class="modal" :class="{ 'is-active': modaldeletemovie }">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Confirm Delete Movie</p>
            <button
              class="delete"
              aria-label="close"
              @click="cancel()"
            ></button>
          </header>
          <section class="modal-card-body">
            <!-- Content ... -->
            <div class="column">
              <p class="order">Detail</p>
              <div class="box">
                <div class="content">
                  <div class="columns">
                    <div class="column is-4">
                      <img
                        class="sizeimg3"
                        :src="movie[0].img_movie"
                        alt=""
                        v-if="movie[0].img_movie.slice(0, 5) == 'https'"
                      />
                      <img
                        class="sizeimg3"
                        :src="'http://localhost:3000/' + movie[0].img_movie"
                        alt=""
                        v-else
                      />
                    </div>
                    <div class="column is-8">
                      <div class="font">MOVIE NAME: {{ movie[0].m_name }}</div>
                      <br />
                      <div class="font">
                        RELEASE DATE: {{ changeDay(movie[0].release_date) }}
                      </div>
                      <br />
                      <div class="font">ACTOR: {{ movie[0].actors }}</div>
                      <br />
                      <div class="font">SYNOPSIS: {{ movie[0].plot }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <footer class="modal-card-foot">
            <button class="button buttconfirm" @click="deletemovie()">
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
import {
  required,
  email,
  helpers,
  minLength,
  maxLength,
  sameAs,
} from "vuelidate/lib/validators";

export default {
  props: ["user"],
  data() {
    return {
      movie: [],
      theatre: [],
      date: [],
      m_name: "",
      release_date: "",
      director: "",
      actor: "",
      image: "",
      plot: "",
      modalEdit: false,
      modalAddshow: false,
      addshowdate: "",
      add_st_time: "",
      add_end_time: "",
      addlanguage: "",
      addtheatre: "",
      modaldeletemovie: false,
      modaldeleteshowtime: false,
      deletedate: "",
      deletethetre: "",
      deletetime: "",
      selectDeleteShowId:"",
      selectDeleteMovieId:'',
    };
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      axios
        .get(`http://localhost:3000/detail/${this.$route.params.id}`)
        .then((response) => {
          this.movie = response.data.movie;
          this.theatre = response.data.theatre;
          this.date = response.data.date;
          this.m_name = response.data.movie[0].m_name;
          this.release_date = this.modifyDate(
            response.data.movie[0].release_date
          );
          this.director = response.data.movie[0].director;
          this.actor = response.data.movie[0].actors;
          this.plot = response.data.movie[0].plot;
          this.image = response.data.movie[0].img_movie;
        })
        .catch((error) => {
          this.error = error.response.data.message;
        });
    },
    changeDay(date) {
      var day = new Date(date).toDateString();
      return day;
    },
    modifyDate(date) {
      var date = new Date(date);
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      date = year + "-" + month + "-" + day;
      return date;
    },
    confirmedit() {
      let formData = new FormData();
      formData.append("m_name", this.m_name);
      formData.append("release_date", this.release_date);
      formData.append("director", this.director);
      formData.append("actor", this.actor);
      formData.append("plot", this.plot);
      formData.append("image", this.image);
      axios
        .put(
          `http://localhost:3000/updatedetail/${this.$route.params.id}`,
          formData
        )
        .then((response) => {
          alert("Edit Success");
          this.cancel();
        })
        .catch((error) => {
          this.error = error.response.data.message;
        });
    },
    selectimage(event) {
      this.image = event.target.files[0];
    },
    openmodaledit() {
      this.modalEdit = true;
      this.getDetail();
    },
    cancel() {
      this.modalEdit = false;
      this.modalAddshow = false;
      this.modaldeletemovie = false;
      this.modaldeleteshowtime = false;
      this.addshowdate = "";
      this.add_st_time = "";
      this.add_end_time = "";
      this.addlanguage = "";
      this.addtheatre = "";
      this.getDetail();
    },
    openmodaladdshow() {
      this.modalAddshow = true;
      this.getDetail();
    },
    confirmaddshow() {
      let Data = {
        addshowdate: this.addshowdate,
        add_st_time: this.add_st_time,
        add_end_time: this.add_end_time,
        addlanguage: this.addlanguage,
        addtheatre: this.addtheatre,
        m_id: this.$route.params.id,
      };
      axios
        .post("http://localhost:3000/addshowtime", Data)
        .then((res) => {
          alert("Add Show Time Success");
          this.cancel();
        })
        .catch((error) => {
          this.error = error.response.data;
          console.log(error.response.data);
        });
    },
    openmodaldeletemovie(m_id) {
      this.modaldeletemovie = true;
      this.selectDeleteMovieId = m_id
    },
    openmodaldeleteshowtime(showid) {
      this.modaldeleteshowtime = true;
      this.selectDeleteShowId = showid
    },
    deleteshowtime() {
      axios
        .put("http://localhost:3000/deleteshow", { showid: this.selectDeleteShowId })
        .then((res) => {
          alert("Delete Show Time Success");
          this.cancel();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deletemovie(){
      axios
        .put("http://localhost:3000/deletemovie", { m_id: this.selectDeleteMovieId})
        .then((res) => {
          alert("Delete Movie Success");
          this.$router.push({ path: "/" });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
  validations: {
    m_name: {
      required: required,
      minLength: minLength(3),
      maxLength: maxLength(150),
    },
    release_date: {
      required: required,
    },
    director: {
      required: required,
      maxLength: maxLength(150),
    },
    actor: {
      required: required,
      maxLength: maxLength(150),
    },
    plot: {
      required: required,
      maxLength: maxLength(150),
    },
    addshowdate: {
      required: required,
    },
    add_st_time: {
      required: required,
    },
    add_end_time: {
      required: required,
    },
    addlanguage: {
      required: required,
    },
    addtheatre: {
      required: required,
    },
  },
};
</script>