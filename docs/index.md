---
layout: home

hero:
  name: ξερωγώ; Podcast
  text: 
  tagline: Πραγματικά, αυτό το podcast είναι θάυμα που υπάρχει, νεα επεισόδια κάθε 1 με 2 εβδομάδες.
  actions:
    - theme: alt
      text: Όλα τα Επεισόδια
      link: /podcasts
    - theme: brand
      text: Open Spotify
      link: https://open.spotify.com/show/4Ejd4BXN2EY8gqGTQNDLvW?si=1c95d71826884500
---
<div class="container">
<h1 style="font-size:24pt;font-weight:500;margin-bottom:0.6em;">Πρόσφατο Επεισόδιο</h1>
</div>
<div class="container">
    <div class="episode" v-for="item in items" :id="item.guid" :key="item.guid" v-bind:class="{ listened: !item.listened }">
      <div class="column">
        <input type="checkbox" v-model="item.listened" @change="markAsListened(item)" /> Το χω ακούσει
        <img class="cover-image" :src="item.image" alt="Episode cover" />
      </div>
      <div class="column">
        <h2 class="episode-title">{{ item.title }}</h2>
        <p class="episode-pubDate">{{ item.pubDate }}</p>
        <audio ref="audioel" controls @timeupdate="updateTimeStamp(item, $event)" @ended="checkAudioEnd(item)">
          <source :src="item.audio" type="audio/mpeg">
          Your browser does not support the audio element.
        </audio>
        <p class="episode-description" v-if="item.showFullDescription">{{ item.description }}</p>
        <p class="episode-description" v-else>{{ getExcerpt(item.description) }}</p>
        <button @click="toggleDescription(item)" class="show-more-button">{{ item.showFullDescription ? 'Show less' : 'Show more' }}</button>
      </div>
    </div>
  </div>

  
<script setup>
import { ref, onMounted, nextTick } from 'vue'
import VueCookies from 'vue-cookies';
import axios from 'axios';
const items = ref([])
const count = ref(0)
const audioel = ref(null);

function showItems(){
    console.log(items)
}

function updateTimeStamp(item, event) {
    const time = event.target.currentTime;
    VueCookies.set(item.guid+'time', time, '365d');
}

function getExcerpt(description) {
    const maxLength = 100;
    return description.length > maxLength ? description.slice(0, maxLength) + '...' : description;
}
function toggleDescription(item) {
    item.showFullDescription = !item.showFullDescription;
}

function markAsListened(episode) {
    episode.listened = true;
    VueCookies.set(episode.guid, true, '365d'); // Set the cookie to expire in 1 day
}

function checkListenedStatus(guid) {
    return VueCookies.get(guid);
}

function checkAudioEnd(guid) {
    VueCookies.remove(guid+'time');
    this.markAsListened(guid);
}

onMounted(async ()=>{
    const response = await axios.get('/feed/index.xml');

    const xmlData = response.data;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "text/xml");
    const xmlItems = xmlDoc.getElementsByTagName("item");


    const xmlItem = xmlItems[xmlItems.length-1];
    const title = xmlItem.getElementsByTagName('title')[0].textContent;
    const description = xmlItem.getElementsByTagName('description')[0].textContent;
    const pubDate = xmlItem.getElementsByTagName('pubDate')[0].textContent;
    const image = xmlItem.getElementsByTagName('itunes:image')[0].getAttribute('href');
    const audio = xmlItem.getElementsByTagName('enclosure')[0].getAttribute('url');
    const guid = xmlItem.getElementsByTagName('guid')[0].textContent;
    
    items.value.push({ title, description, pubDate,
      image, guid, audio, showFullDescription:false,
      listened: checkListenedStatus(guid)
    });
    
    await nextTick(()=>{
        items.value.forEach(item => {
          let savedTime = VueCookies.get(item.guid+'time');
          if (savedTime) {
             audioel.value[0].currentTime = savedTime;
          }
      });
    })
})
</script>




<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
 
  justify-content: center;
}

.episode {
  background-color: #f9f9f9;
   max-width: 700px;
  margin: 10px;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-wrap: wrap;
}

.column {
  flex: 1;
  padding: 10px;
}

.cover-image {
  width: 100%;
  border-radius: 10px;
}

.episode-title {
  margin: 15px 0;
  color: #333;
  font-size: 24px;
}

.episode-pubDate {
  margin: 15px 0;
  color: #666;
  font-size: 16px;
}

.episode-description {
  margin: 15px 0;
  color: #666;
  font-size: 14px;
}

.show-more-button {
  margin-top: 10px;
}


.listened {
  box-shadow: 0 0 3px rgba(0, 255, 0, 0.2), 0 0 6px rgba(0, 255, 0, 0.2), 0 0 9px rgba(0, 255, 0, 0.2), 0 0 12px rgba(0, 255, 0, 0.2), 0 0 15px rgba(0, 255, 0, 0.2);
}
</style>
