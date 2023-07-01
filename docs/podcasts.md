
## Επεισόδια
<div class="container">
<div v-for="item in items">
    <div :id="item.guid" class="episode" v-bind:class="{ listened: !item.listened }">
        <input type="checkbox" v-model="item.listened" @change="markAsListened(item)" /> Το χω ακούσει
        <img class="cover-image" :src="item.image" alt="Episode cover" />
        <h2 class="episode-title">{{ item.title }}</h2>
        <p class="episode-pubDate">{{ item.pubDate }}</p>
        <audio ref="audioels" :id="item.guid+'time'" controls @timeupdate="updateTimeStamp(item, $event)" @ended="checkAudioEnd(item)">
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
const audioels = ref([]);

function showItems(){
    console.log(items)
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

function updateTimeStamp(item, event) {
    const time = event.target.currentTime;
    console.log(item)
    VueCookies.set(item.guid+'time', time, '365d');
}

function checkAudioEnd(guid) {
    console.log('Ended')
    VueCookies.remove(guid+'time');
    this.markAsListened(guid);
}

onMounted(async ()=>{
    const response = await axios.get('/feed/index.xml');

    const xmlData = response.data;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "text/xml");
    const xmlItems = xmlDoc.getElementsByTagName("item");

    for (let i = xmlItems.length - 1; i >= 0; i--) {
      const xmlItem = xmlItems[i];
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
    }

        await nextTick(()=>{
        console.log()
        audioels.value.map((el, i)=>{
          let savedTime = VueCookies.get(el.id);
          if (savedTime) {
              console.log(el)
             audioels.value[i].currentTime = savedTime;
          }
        })

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
  margin: 10px;
  padding: 20px;
  width: 300px;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

audio {
  max-width: 100%;
}

.cover-image {
  width: 100%;
  border-radius: 10px;
}

.episode-title {
  margin: 15px 0;
  color: #333;
  font-size: 20px;
}

.episode-author {
  margin: 15px 0;
  color: #666;
  font-size: 16px;
}

.episode-description {
  margin: 15px 0;
  color: #666;
  font-size: 14px;
}

.episode-link {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #3399ff;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.episode-link:hover {
  background-color: #0077cc;
}

.show-more-button {
    color: green;
}

.listened {
  box-shadow: 0 0 3px rgba(0, 255, 0, 0.2), 0 0 6px rgba(0, 255, 0, 0.2), 0 0 9px rgba(0, 255, 0, 0.2), 0 0 12px rgba(0, 255, 0, 0.2), 0 0 15px rgba(0, 255, 0, 0.2);
}
</style>
