<style>
.createmoviepage {
  background-image: linear-gradient(to right, #090717, #35090f);
  background-size: cover;
  width: 100vw;
  height: 100vh;
}

.box2 {
  width: 500px;
  height: 600px;
  margin-top: 30px;
}
.loginbutton {
  color: #3273dc;
  cursor: pointer;
  text-decoration: none;
}
.buttlogin {
  background-image: linear-gradient(to right, #55030e, #340347);
  background-size: cover;
  border-radius: 5px;
  color: white;
}
</style>
<template>
  <body class="createmoviepage">
    <div class="container is-widescreen">
      <div class="columns is-centered">
        <div class="box box3">
          <div class="column">
            <h1 class="title">Add Detail Movie</h1>
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
              <button class="button is-fullwidth buttlogin" @click="submit">
                Add
              </button>
            </div>
          </div>
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
  data() {
    return {
      m_name: "",
      release_date: "",
      director: "",
      actor: "",
      image: "",
      plot: "",
    };
  },
  methods: {
    selectimage(event) {
      this.image = event.target.files[0];
    },
    submit() {
      // Validate all fields
      this.$v.$touch();

      if (!this.$v.$invalid) {
        let formData = new FormData();
        formData.append("m_name", this.m_name);
        formData.append("release_date", this.release_date);
        formData.append("director", this.director);
        formData.append("actor", this.actor);
        formData.append("plot", this.plot);
        formData.append("image", this.image);
        axios
          .post("http://localhost:3000/createmovie", formData)
          .then((res) => {
            alert("Add Movie Success");
            this.$router.push({ path: "/" });
          })
          .catch((error) => {
            this.error = error.response.data;
            console.log(error.response.data);
          });
      }
    },
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
  },
};
</script>