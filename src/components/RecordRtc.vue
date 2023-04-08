<template>
  <div class="main-container">
      <div class="text-h3">Seleziona lo schermo da registrare</div>
      <div class="ma-8">
        <v-chip-group
            selected-class="text-primary"
            column
            @update:model-value="onSelectSource"
          >
            <v-chip
              v-for="(source, i) in availableSources"
              :key="source.id"
            >
            {{ source.name }}
            </v-chip>
          </v-chip-group>
      </div>
      <div class="text-h5">{{ selectedSource.name }}</div>
      <video ref="previewPlayer" autoplay muted></video>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { getAvailableSources } from '@/electronRenderer';


const previewPlayer = ref<any>(null);
const availableSources = ref<any>(null);
const selectedSource = ref<any>(null);

async function onSelectSource(i:any){
  console.log(i);
  selectedSource.value = availableSources.value[i];
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: availableSources.value[i].id
      }
    }
  });
  nextTick(()=> {      
    previewPlayer.value.srcObject = stream;
  })
}



onMounted(async() => {
  const sources = await getAvailableSources();
  console.log('[GET AVAILABLE SOURCES]', sources);
  availableSources.value = sources;  
});

</script>

<style scoped>
.main-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
video {
  width: 800px;
  height: 400px;
  margin: 8px;
  border: 4px solid transparent;
  border-radius: 8px;
}





</style>
