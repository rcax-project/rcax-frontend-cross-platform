<template>
  <div class="flex items-center gap-0.5 text-xs">
    <template v-if="normalizeTokenSymbol(sale.payment_token.symbol) === 'ETH'">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-2.5 h-2.5 text-zinc-400">
        <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path>
      </svg>
      <span class="font-medium text-zinc-400">{{ (sale.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(3).replace(/\.?0+$/, '') }}</span>
    </template>
    <template v-else-if="normalizeTokenSymbol(sale.payment_token.symbol) === 'MATIC'">
      <span class="font-bold text-xs text-zinc-400">M</span>
      <span class="font-medium text-zinc-400">{{ (sale.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(3).replace(/\.?0+$/, '') }}</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import {ETH_TO_GWEI_MODIFIER} from "~/types/ethereum";
import {PropType} from "@vue/runtime-core";
import {useEthereumPriceMap} from "~/composables/states";
import {Sale} from "~/types/sale";
import {normalizeTokenSymbol} from "~/global/utils";

const props = defineProps({
  sale: {
    type: Object as PropType<Sale>,
    required: true
  }
});

const ethereumPriceMap = useEthereumPriceMap();
</script>

<style scoped>

</style>
