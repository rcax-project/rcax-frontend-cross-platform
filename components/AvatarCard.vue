<template>
  <div 
    @click="selectAvatar" 
    ref="componentRef" 
    class="group relative bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 hover:border-white/20 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-black/20 w-full"
  >
    <template v-if="seriesStats">
      <!-- Image Section -->
      <div class="relative bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 overflow-hidden" style="height: 100px;">
        <button 
          @click.stop="selectAvatar" 
          class="relative w-full h-full block"
        >
          <img-placeholder 
            img-class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            :src="getTokenImage(seriesStats.series.image)" 
          />
          
          <!-- Gradient Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <!-- Top Left: Supply Badge -->
          <div class="absolute top-1 left-1">
            <div class="px-1 py-0.5 bg-black/70 backdrop-blur-md text-xs font-medium text-white rounded" :class="getMintClassesText(Math.max(seriesStats.series.total_quantity, seriesStats.series.total_sold))">
              {{ Math.max(seriesStats.series.total_sold, seriesStats.series.total_quantity) }}
            </div>
          </div>
          
          <!-- Top Right: Watchlist -->
          <div class="absolute top-1 right-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
            <template v-if="watchList.has(seriesStats.collection.contract_address + seriesStats.series.name)">
              <button 
                @click.stop="removeFromWatchList(seriesStats.series.contract_address + seriesStats.series.name)" 
                class="p-1 bg-black/70 backdrop-blur-md rounded-full hover:bg-black/90 transition-all duration-200"
              >
                <StarIcon class="w-4 h-4 text-yellow-400" />
              </button>
            </template>
            <template v-else>
              <button 
                @click.stop="addToWatchList(seriesStats.collection.contract_address + seriesStats.series.name)" 
                class="p-1 bg-black/70 backdrop-blur-md rounded-full hover:bg-black/90 transition-all duration-200 group/star"
              >
                <StarIconOutlined class="w-4 h-4 text-white/60 group-hover/star:text-yellow-400 transition-colors duration-200" />
              </button>
            </template>
          </div>
        </button>
      </div>
      
      <!-- Content Section -->
      <div class="p-1.5">
        <!-- Title and Ranking -->
        <div class="flex items-center justify-between gap-1 mb-1">
          <button 
            @click.stop="openLinkWith(marketplaceLink(seriesStats))" 
            class="text-left flex-1 text-white font-medium text-xs hover:text-blue-400 transition-colors duration-200 line-clamp-1"
          >
            {{ seriesStats.series.name }}
          </button>
          <div class="flex items-center gap-1 flex-shrink-0">
            <template v-if="item.mint_number">
              <span class="text-xs font-medium text-zinc-400">#{{ item.mint_number }}</span>
            </template>
            <template v-if="ranking">
              <span class="text-xs font-medium text-zinc-400">#{{ ranking }}</span>
            </template>
          </div>
        </div>
        
        <!-- Stats Section -->
        <div class="mb-1.5">
          <slot></slot>
        </div>
        
        <!-- Footer -->
        <div v-if="!$slots.footer" class="flex items-center justify-between pt-1 border-t border-white/10 text-xs">
          <div class="text-xs font-medium" :class="{ 'text-green-400': seriesStats.series.total_sold < seriesStats.series.total_quantity, 'text-red-400': seriesStats.series.total_sold >= seriesStats.series.total_quantity }">
            <template v-if="seriesStats && seriesStats.series.mint_price > 0">
              ${{ seriesStats.series.mint_price / 100.00 }}
            </template>
            <template v-else>
              FREE
            </template>
          </div>
          <div class="text-xs text-zinc-400">{{ getGeneration }}</div>
        </div>
        
        <!-- Custom Footer Slot -->
        <slot v-if="$slots.footer" name="footer"></slot>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {computed, ref, useSelectedAvatar} from "#imports";
import {PropType} from "@vue/runtime-core";
import {SeriesStats} from "~/types/seriesStats";
import OpenseaIcon from "~/components/OpenseaIcon.vue";
import {InformationCircleIcon, StarIcon as StarIconOutlined} from "@heroicons/vue/24/outline";
import {useWatchList, addToWatchList, removeFromWatchList} from "#imports";
import {StarIcon} from "@heroicons/vue/20/solid";
import {Capacitor} from "@capacitor/core";
import {getTokenImage} from "~/global/utils";
import {findCollectionNameByContractAddress} from "~/global/generations";
import {Haptics, ImpactStyle} from "@capacitor/haptics";
import {marketplaceLink} from "~/global/marketplace";
import {getMintClasses, getMintClassesText} from "~/global/mint";

export interface AvatarCardItem {
  name: string;
  contract_address: string;
  image: string;
  mint_number?: number;
}

const watchList = useWatchList();
const selectedAvatar = useSelectedAvatar();

const componentRef = ref(null);

const props = defineProps({
  item: {
    type: Object as PropType<AvatarCardItem>,
    required: true
  },
  seriesStats: {
    type: Object as PropType<SeriesStats>,
    required: true
  },
  hideFloor: {
    type: Boolean,
    required: false,
    default: () => false
  },
  ranking: {
    type: Number,
    required: false
  }
});

const getGeneration = computed(() => {
  return findCollectionNameByContractAddress(props.item.contract_address);
});

const hapticsImpactLight = async () => {
  await Haptics.impact({ style: ImpactStyle.Light });
};

function selectAvatar() {
  hapticsImpactLight();

  selectedAvatar.value = {
    seriesStats: props.seriesStats,
    contract: props.seriesStats.series.contract_address,
    series: props.seriesStats.series.name
  }
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
