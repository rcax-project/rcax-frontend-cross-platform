<template>
  <div class="flex items-center gap-0.5 text-xs">
    <template v-if="normalizeTokenSymbol(sale.payment_token.symbol) === 'ETH'">
      <span class="font-medium text-white">{{ (sale.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(3).replace(/\.?0+$/, '') }}</span>
    </template>
    <template v-else-if="normalizeTokenSymbol(sale.payment_token.symbol) === 'MATIC'">
      <span class="font-medium text-white">{{ (sale.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(3).replace(/\.?0+$/, '') }}M</span>
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
