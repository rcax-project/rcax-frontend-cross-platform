<template>
  <div class="relative grid grid-cols-5 gap-1 overflow-hidden">
    <a :href="`https://opensea.io/collection/${seriesStats?.collection.slug}?search[query]=${seriesStats?.series.name}`" class="relative rounded-lg overflow-hidden">
      <img v-lazy-pix="getTokenImage(item.image)" src="/img/rcax_placeholder.png" :alt="item.name">
      <template v-if="seriesStats">
        <div class="absolute top-1 left-1 px-1 border-amber-400 py-0.25 bg-amber-500 text-black text-[0.65rem] font-bold rounded">{{ Math.max(seriesStats.series.total_sold, seriesStats.series.total_quantity) }}</div>
        <div class="absolute bottom-0 w-full px-1 py-0.25 text-white text-[0.65rem] text-center font-bold" :class="{ 'bg-green-600': seriesStats.series.total_sold < seriesStats.series.total_quantity, 'bg-red-600': seriesStats.series.total_sold >= seriesStats.series.total_quantity }">${{ seriesStats.series.mint_price / 100.00 }}</div>
      </template>
      <div class="absolute top-1 right-1 w-4 h-4 rounded-full">
        <OpenseaIcon />
      </div>
    </a>
    <div @click="toggleExtraInfo()" class="col-span-4 px-2 py-2 bg-neutral-800 flex flex-col rounded-lg gap-0.5 overflow-hidden">
      <slot></slot>
    </div>
    <template v-if="showExtraInfo">
      <LastSalesComponent class="col-span-5" :contract="item.contract_address" :series="item.name" />
    </template>
  </div>
</template>

<script setup lang="ts">
import {ref} from "#imports";
import {PropType} from "@vue/runtime-core";
import {SeriesStats} from "~/types/seriesStats";
import OpenseaIcon from "~/components/OpenseaIcon.vue";

export interface AvatarCardItem {
  name: string;
  contract_address: string;
  image: string;
}

const props = defineProps({
  item: {
    type: Object as PropType<AvatarCardItem>,
    required: true
  },
  seriesStats: {
    type: Object as PropType<SeriesStats>,
    required: false
  }
});

const showExtraInfo = ref(false);

function toggleExtraInfo() {
  showExtraInfo.value = !showExtraInfo.value;
}

function getTokenImage(url: string): string {
  if (url.startsWith("ipfs://")) {
    url = url.replace("ipfs://", "https://ipfs.io/ipfs/");
  }

  return url;
}
</script>

<style scoped>

</style>