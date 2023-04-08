<template>
  <div class="text-h3 ma-5 text-center">Welcome to vue3 Electron template!</div>
  <div class="d-flex align-center flex-column justify-center pt-4">
    <v-btn size="large" rounded="pill" color="primary" @click="onClickConvertToMp4">Conversione a mp4</v-btn>
    <div class="text-h4 mt-4">{{ onGoing ? "Conversione in corso.." : "-  " }}</div>
    <div class="d-flex align-center flex-column justify-center w-50 pt-4">
      <v-progress-linear class="mt-4" :model-value="Math.ceil(progress)" height="32" color="purple">
      <template v-slot:default="{ value }">
        <strong>{{ Math.ceil(value) }}%</strong>
      </template></v-progress-linear
    >
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { convertToMp4, onConversionProgress } from "@/electronRenderer";
const progress = ref(0);
const onGoing = ref(false);
async function onClickConvertToMp4() {
  onGoing.value = true;
  const response = await convertToMp4();
  onGoing.value = false;
  console.log(response);
}
onMounted(() => {
  onConversionProgress((__progress: any) => {
    console.log(__progress);
    progress.value = __progress.percent;
  });
});
</script>

<style scoped></style>
