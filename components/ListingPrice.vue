<template>
  <button @click.stop="openLinkWith(`https://opensea.io/assets/matic/${listing.token.contract_address}/${listing.token.id}`)" class="flex items-center gap-0.5 text-xs hover:text-blue-400 transition-colors duration-200">
    <template v-if="normalizeTokenSymbol(listing.payment_token.symbol) === 'ETH'">
      <span class="font-medium text-white">{{ (listing.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(3).replace(/\.?0+$/, '') }}</span>
    </template>
    <template v-else-if="normalizeTokenSymbol(listing.payment_token.symbol) === 'MATIC'">
      <span class="font-medium text-white">{{ (listing.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(3).replace(/\.?0+$/, '') }}M</span>
    </template>
  </button>
</template>

<script setup lang="ts">
import {ETH_TO_GWEI_MODIFIER} from "~/types/ethereum";
import {PropType} from "@vue/runtime-core";
import {Listing} from "~/types/listing";
import {useEthereumPriceMap} from "~/composables/states";
import {normalizeTokenSymbol} from "~/global/utils";

const props = defineProps({
  listing: {
    type: Object as PropType<Listing>,
    required: true
  }
});

const ethereumPriceMap = useEthereumPriceMap();
</script>

<style scoped>

</style>
