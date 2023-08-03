<template>
  <div class="flex flex-row justify-between gap-1">
    <div class="flex flex-col">
      <div class="flex font-bold text-[0.7rem]">
        <div class="flex gap-1">
          <span class="text-neutral-500 font-medium">Mint Number:</span>
          <button @click="openLinkWith(`https://opensea.io/assets/matic/${item.token.contract_address}/${item.token.id}`)" class="text-white hover:text-amber-500">#{{ item.token.mint_number }}</button>
        </div>
      </div>
      <div class="flex font-bold text-[0.7rem]">
        <div class="flex gap-1">
          <span class="text-neutral-500 font-medium">Minter:</span>
          <button @click="openLinkWith(`https://opensea.io/${item.minter}`)" class="text-neutral-200 hover:text-amber-500">{{ item.minter.slice(2, 6) }}</button>
        </div>
      </div>
      <div class="flex font-bold text-[0.7rem]">
        <div class="flex gap-1">
          <span class="text-neutral-500 font-medium">Date:</span>
          <div class="text-neutral-200">{{ $timeAgo(new Date(item.date_minted)) }} ago</div>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-end">
      <div class="flex font-medium text-[0.7rem]">
        <div class="flex gap-1">
          <span class="text-neutral-500 font-medium">Stock:</span>
          <span class="text-neutral-500 font-medium">{{ shopStock > 999 ? "999+" : shopStock }} left</span>
        </div>
      </div>
      <div class="flex font-medium text-[0.7rem]">
        <div class="flex gap-1">
          <span class="text-neutral-500 font-medium">Floor:</span>
          <div class="flex items-center">
            <template v-if="!lowestListing">
              <span class="text-neutral-500 font-medium">None.</span>
            </template>
            <template v-else-if="lowestListing.payment_token.symbol === 'ETH'">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-neutral-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
              <div class="flex gap-0.5 text-neutral-500">
                <span>{{ (lowestListing.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(4).replace(/\.?0+$/, '') }}</span>
              </div>
            </template>
            <template v-else-if="lowestListing.payment_token.symbol === 'MATIC'">
              <div class="pr-0.5 flex items-center text-neutral-500">M</div>
              <div class="flex gap-0.5 text-neutral-500">
                <span>{{ (lowestListing.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(4).replace(/\.?0+$/, '') }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="flex font-medium text-[0.7rem]">
        <div class="flex gap-1 text-neutral-500">
          <span class="text-neutral-500 font-medium">Profit:</span>
          <div :class="{ 'text-green-500': mintProfitInPercentage >= 0, 'text-red-500': mintProfitInPercentage < 0 }">{{ mintProfitInPercentage }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {PropType} from "@vue/runtime-core";
import {
  useWatchList,
  getSeriesStats, useEthereumUsdPrice
} from "~/composables/states";
import {Mint} from "~/types/mint";
import {computed, getListingAsGweiPrice, getLowestListing} from "#imports";
import {ETH_TO_GWEI_MODIFIER} from "~/types/ethereum";

const props = defineProps({
  item: Object as PropType<Mint>
});

const watchList = useWatchList();
const ethereumPriceInUsd = useEthereumUsdPrice();

const seriesStats = computed(() => {
  return getSeriesStats(props.item.token.contract_address, props.item.token.name);
});

const lowestListing = computed(() => {
  return getLowestListing(seriesStats.value);
});

const mintProfitInPercentage = computed(() => {
  return Math.round(((getListingAsGweiPrice(lowestListing.value) / ETH_TO_GWEI_MODIFIER) * ethereumPriceInUsd.value) / (seriesStats.value.series.mint_price / 100) * 100 -100);
});

const shopStock = computed(() => {
  return  Math.max(seriesStats.value.series.total_quantity - seriesStats.value.series.total_sold, 0);
});
</script>

<style scoped>

</style>