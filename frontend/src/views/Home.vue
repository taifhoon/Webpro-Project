<style>
.homepage {
  background-image: url(https://cdn.discordapp.com/attachments/793163190786719765/970779469440770048/unknown.png);
  background-size: cover;
}
 #card1{
   width:100%;
   background-image:url(https://cdn.discordapp.com/attachments/793163190786719765/970779469440770048/unknown.png);
   border-radius: 15px;
   padding-top:20px;
   
 } 
 #card:hover{
   box-shadow: 6px 6px rgb(22, 15, 15);
   transform: scale(1.02);
   transition: ease-out 0.5s;
 }
.zonetitle{
  height: 130px;
  color: #f8f5f0;
}
.zonecon{
  height: 25px;
  color:#d2aa5a;
}
#button{
  color:white;
}
#button:hover{
  color: rgb(184, 182, 182);
}
.sizeimg{
  height: 20vw;
}
</style>
<template>
<body class='homepage'>
  <div class="container is-widescreen">
    <section class="section">
      <div class="content">
        <div class="columns is-multiline">
          <div class="column is-3" v-for="movie in movie" :key="movie.m_id">
            <div class="card" id="card1">
              <div class="card-image pt-4">
                <figure>
                  <img class="sizeimg" :src="'http://localhost:3000/'+movie.img_movie" alt="" v-if="movie.img_movie && movie.img_movie.slice(0,5) != 'https'">
                  <img class="sizeimg" :src="movie.img_movie" alt="" v-else>
                </figure>
              </div>
              <div class="card-content">
                <div class="title zonetitle">{{movie.m_name}}</div>
                <div class="content zonecon">{{new Date(movie.release_date).toDateString()}}</div>
              </div>
              <footer class="card-footer">
                <router-link class="card-footer-item" id='button' :to="`/detail/${movie.m_id}`">Details</router-link>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  </body>
</template>

<script>
import axios from "@/plugins/axios";

export default {
  name: "Home",
  props: ['user'],
  data() {
    return {
      search: "",
      movie: [],
    };
  },
  mounted() {
    this.getMovie();
  },
  methods: {
    getMovie(){
      axios
      .get('http://localhost:3000/')
      .then((response) => {
        this.movie = response.data
      })
      .catch((err) => {
          console.log(err);
        })
    }
  },
};
</script>
