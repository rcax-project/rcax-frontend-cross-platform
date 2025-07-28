<template>
  <div>
    <template v-if="sortingOnShop">
      <!-- Shop Mode Stats -->
      <div class="space-y-1">
        <!-- Stock and Progress Row -->
        <div class="flex items-center justify-between text-xs">
          <span class="text-zinc-500">{{ Math.max((item.series.total_quantity - item.series.total_sold), 0) }} left</span>
          <span class="font-medium text-blue-400">{{ Math.round((item.series.total_sold / item.series.total_quantity) * 100 ) }}%</span>
        </div>
        
        <!-- Progress Bar -->
        <div class="w-full bg-white/10 rounded-full overflow-hidden h-1">
          <div 
            class="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-300" 
            :style="{ 'width': `${Math.min(100, Math.round((item.series.total_sold / item.series.total_quantity) * 100 ))}%` }"
          ></div>
        </div>
        
        <!-- Bottom Row -->
        <div class="flex items-center justify-between text-xs pt-1">
          <template v-if="item.series.total_sold < item.series.total_quantity">
            <span class="text-blue-400 font-medium">#{{ item.series.total_quantity - (item.series.total_quantity - item.series.total_sold) + 1 }}</span>
          </template>
          <template v-else>
            <span class="text-red-400 font-medium">Sold Out</span>
          </template>
          
          <template v-if="lowestListing">
            <span :class="{ 'text-green-400': mintProfitInPercentage >= 0, 'text-red-400': mintProfitInPercentage < 0 }" class="font-medium">{{ mintProfitInPercentage }}%</span>
          </template>
        </div>
      </div>
    </template>
    
    <template v-else>
      <!-- Regular Mode Stats -->
      <div class="space-y-1">
        <!-- Main Stats -->
        <div class="flex items-center justify-between text-xs">
          <span class="text-zinc-500">Floor</span>
          <template v-if="lowestListing">
            <ListingPrice :listing="lowestListing" class="text-xs font-medium" />
          </template>
          <template v-else>
            <span class="text-zinc-600">—</span>
          </template>
        </div>
        
        <div class="flex items-center justify-between text-xs">
          <span class="text-zinc-500">Sale</span>
          <template v-if="item.stats.last_sale">
            <LastSale :sale="item.stats.last_sale" class="text-xs font-medium" />
          </template>
          <template v-else>
            <span class="text-zinc-600">—</span>
          </template>
        </div>
        
        <!-- Secondary Stats -->
        <div class="pt-1 border-t border-white/10">
          <template v-if="sorting === 'lowestFloorMintRatio' || sorting === 'highestFloorMintRatio'">
            <div class="flex items-center justify-between text-xs">
              <span class="text-zinc-500">Profit</span>
              <span :class="{ 'text-green-400': mintProfitInPercentage >= 0, 'text-red-400': mintProfitInPercentage < 0 }" class="font-medium">{{ mintProfitInPercentage }}%</span>
            </div>
          </template>
          
          <template v-else-if="sorting === 'lowestListedPercentage'">
            <div class="flex items-center justify-between text-xs">
              <span class="text-zinc-500">Listed</span>
              <span class="font-medium text-white">{{ item.stats.listed_percentage.toFixed(2) }}%</span>
            </div>
          </template>
          
          <template v-else-if="sorting === 'lowestWeeklyAverage' || sorting === 'highestWeeklyAverage'">
            <div class="flex items-center justify-between text-xs">
              <span class="text-zinc-500">7d Avg</span>
              <span class="font-medium text-white">{{ (item.stats.weekly_average_price ?? 0).toFixed(3).replace(/\.?0+$/, '') }}</span>
            </div>
          </template>
          
          <template v-else-if="sorting === 'lowestTwoWeeklyAverage' || sorting === 'highestTwoWeeklyAverage'">
            <div class="flex items-center justify-between text-xs">
              <span class="text-zinc-500">14d Avg</span>
              <span class="font-medium text-white">{{ (item.stats.two_weekly_average_price ?? 0).toFixed(2) }}</span>
            </div>
          </template>
          
          <template v-else-if="sorting === 'lowestMonthlyAverage' || sorting === 'highestMonthlyAverage'">
            <div class="flex items-center justify-between text-xs">
              <span class="text-zinc-500">30d Avg</span>
              <span class="font-medium text-white">{{ (item.stats.monthly_average_price ?? 0).toFixed(2) }}</span>
            </div>
          </template>
          
          <template v-else-if="sorting === 'artistAsc' || sorting === 'artistDesc'">
            <div class="flex items-center justify-between text-xs">
              <span class="text-zinc-500">Artist</span>
              <a :href="`https://reddit.com/u/${item.collection.artist.displayName}`" target="_blank" class="font-medium text-blue-400 hover:text-blue-300 transition-colors">{{ item.collection.artist.displayName }}</a>
            </div>
          </template>
          
          <template v-else-if="sorting === 'lowestDailyVolume' || sorting === 'highestDailyVolume'">
            <div class="flex items-center justify-between text-xs">
              <span class="text-zinc-500">24h Vol</span>
              <span class="font-medium text-white">{{ item.stats.daily_volume.toFixed(2) }}</span>
            </div>
          </template>
          
          <template v-else-if="sorting === 'lowestWeeklyVolume' || sorting === 'highestWeeklyVolume'">
            <div class="flex items-center justify-between text-xs">
              <span class="text-zinc-500">7d Vol</span>
              <span class="font-medium text-white">{{ item.stats.weekly_volume.toFixed(2) }}</span>
            </div>
          </template>
          
          <template v-else>
            <div class="flex items-center justify-between text-xs">
              <span class="text-zinc-500">5 Sales</span>
              <span class="font-medium text-white">{{ item.stats.five_last_sales_average.toFixed(3).replace(/\.?0+$/, '') }}</span>
            </div>
          </template>
        </div>
        
        <!-- Performance Indicator -->
        <div class="flex items-center justify-between pt-1 border-t border-white/10 text-xs">
          <span class="text-zinc-500">24h</span>
          <template v-if="item.stats.daily_price_change > 0">
            <span class="font-medium text-green-400">+{{ dailyPriceChange }}%</span>
          </template>
          <template v-else-if="item.stats.daily_price_change < 0">
            <span class="font-medium text-red-400">{{ item.stats.daily_price_change.toFixed(2) }}%</span>
          </template>
          <template v-else>
            <span class="font-medium text-zinc-400">0%</span>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {SeriesStats} from "~/types/seriesStats";
import {PropType} from "@vue/runtime-core";
import {
  useWatchList,
  useEthereumUsdPrice,
  useEthereumPriceMap
} from "~/composables/states";
import {computed, ethereumInLocalCurrency} from "#imports";
import {ETH_TO_GWEI_MODIFIER} from "~/types/ethereum";
import {getLowestListing, getListingAsGweiPrice} from "~/composables/helpers";
import {ClockIcon} from "@heroicons/vue/24/outline";

const watchList = useWatchList();
const ethereumPriceInUsd = useEthereumUsdPrice();
const ethereumPriceMap = useEthereumPriceMap();

const props = defineProps({
  item: {
    type: Object as PropType<SeriesStats>,
    required: true
  },
  sorting: String
});

const sortingOnShop = computed(() => {
  return props.sorting === 'highestShopAvailableAbsolute' || props.sorting === 'lowestShopAvailableAbsolute' || props.sorting === 'highestShopAvailablePercentage' || props.sorting === 'lowestShopAvailablePercentage' || props.sorting === 'lowestShopNextMint';
});

const lowestListing = computed(() => {
  return getLowestListing(props.item);
});

const mintProfitInPercentage = computed(() => {
  return Math.round(((getListingAsGweiPrice(lowestListing.value) / ETH_TO_GWEI_MODIFIER) * ethereumPriceInUsd.value) / (props.item.series.mint_price / 100) * 100 -100);
});

const dailyPriceChange = computed(() => {
  let change = props.item.stats.daily_price_change;

  if (change >= 100 || change <= -100) {
    return change.toFixed(0);
  }

  return change.toFixed(2);
});
</script>

<style scoped>

</style>
