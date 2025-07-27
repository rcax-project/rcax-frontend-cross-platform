<template>
  <!-- The overlay is used to cover the main content when the drawer is open -->
  <div class="fixed inset-0 bg-black/50 z-40" v-if="open" @click="close"></div>

  <!-- The drawer content -->
  <transition name="slide">
    <div v-if="open" class="fixed flex flex-col top-0 left-0 bottom-0 sm:right-0 sm:left-auto w-96 max-w-[93%] bg-[#141415] border-l border-zinc-800/50 shadow-lg z-50" :class="{ 'page-mobile-padding-top': Capacitor.isNativePlatform() }">
      <!-- Header -->
      <div class="px-4 lg:px-6 py-4 sticky top-0 flex items-center justify-between bg-[#141415]/90 backdrop-blur-xl border-b border-zinc-800/50 z-30">
        <span class="text-white font-medium">{{ selectedAvatar.series }}</span>
        <button @click.stop="close" class="p-2 hover:bg-zinc-800/50 text-zinc-400 hover:text-white rounded-lg transition-all duration-200">
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>
      
      <div class="relative px-4 lg:px-6 py-6 w-full h-full flex flex-col gap-6 overflow-y-auto scrollbar-hide" :class="{ 'page-mobile-padding-bottom': Capacitor.isNativePlatform() }">
        <!-- Avatar Image Section -->
        <div class="flex flex-col items-center gap-4">
          <div class="relative max-w-[18rem] z-20">
            <img-placeholder :src="avatarImage" />
          </div>
          <div class="absolute top-6 z-10">
            <img-placeholder img-class="blur-3xl opacity-20" :src="avatarImage" />
          </div>
          
          <!-- Avatar Info -->
          <div class="flex flex-col items-center gap-3 z-30">
            <h2 class="text-white font-semibold text-lg">{{ selectedAvatar.series }}</h2>
            <div class="flex flex-wrap gap-2 text-sm justify-center">
              <div class="px-3 py-2 bg-zinc-800/30 border border-zinc-700/30 rounded-lg" :class="getMintClasses(selectedAvatar.seriesStats.series.total_quantity)">
                <span class="text-white">{{ Math.max(selectedAvatar.seriesStats.series.total_quantity, selectedAvatar.seriesStats.series.total_sold) }}</span>
              </div>
              <div class="px-3 py-2 bg-zinc-800/30 border border-zinc-700/30 rounded-lg">
                <span class="text-zinc-300">${{ selectedAvatar.seriesStats.series.mint_price / 100 }}</span>
              </div>
              <template v-if="selectedAvatar.seriesStats.series.total_sold >= selectedAvatar.seriesStats.series.total_quantity || !selectedAvatar.seriesStats.series.id">
                <div class="px-3 py-2 bg-zinc-800/30 border border-zinc-700/30 rounded-lg">
                  <span class="text-zinc-400">SOLD OUT</span>
                </div>
              </template>
              <template v-else>
                <a :href="`https://www.reddit.com/avatar/shop/product/${selectedAvatar.seriesStats.series.id}`" target="_blank" class="px-3 py-2 bg-amber-500 hover:bg-amber-600 border border-amber-500 hover:border-amber-600 rounded-lg transition-all duration-200">
                  <span class="text-white font-medium">BUY NOW</span>
                </a>
              </template>
            </div>
          </div>
        </div>
        <!-- Details Sections -->
        <div class="flex flex-col gap-4 w-full">
          <div class="bg-zinc-800/30 border border-zinc-700/30 rounded-xl overflow-hidden">
            <div @click="settings.extraInfoOptions.marketData = !settings.extraInfoOptions.marketData" class="px-4 py-3 flex justify-between items-center text-zinc-400 hover:text-white cursor-pointer transition-colors duration-200 border-b border-zinc-800/50">
              <h3 class="text-sm font-medium">Advanced Details</h3>
              <ChevronDownIcon class="w-5 h-5 transition-transform duration-200" :class="{ 'rotate-180': settings.extraInfoOptions.marketData }" />
            </div>
            <template v-if="settings.extraInfoOptions.marketData">
              <div class="px-4 py-3 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-zinc-400">Name:</span>
                  <button @click="openLinkWith(marketplaceLink(seriesStats))" class="text-sm text-white hover:text-zinc-300 transition-colors duration-200 truncate ml-2">{{ seriesStats.series.name }}</button>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-zinc-400">Collection:</span>
                  <button @click="openLinkWith(marketplaceLink(seriesStats))" class="text-sm text-white hover:text-zinc-300 transition-colors duration-200 truncate ml-2">{{ seriesStats.collection.name.replace("x Reddit Collectible Avatars", "") }}</button>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-zinc-400">Artist:</span>
                  <a :href="`https://reddit.com/u/${seriesStats?.collection.artist.displayName}`" target="_blank" class="text-sm text-white hover:text-zinc-300 transition-colors duration-200">{{ seriesStats.collection.artist.displayName }}</a>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-zinc-400">Shop Supply:</span>
                  <span class="text-sm text-white">{{ seriesStats.series.total_quantity }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-zinc-400">Total Minted:</span>
                  <span class="text-sm text-white">{{ seriesStats.series.total_sold }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-zinc-400">Stock Left:</span>
                  <span class="text-sm text-white">{{ Math.max((seriesStats.series.total_quantity - seriesStats.series.total_sold), 0) }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-zinc-400">Listed:</span>
                  <span class="text-sm text-white">{{ seriesStats.stats.listed_percentage.toFixed(2) }}%</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-zinc-400">24h Volume:</span>
                  <div class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-zinc-400"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                    <span class="text-sm text-white">{{ (seriesStats.stats.daily_volume).toFixed(2) }}</span>
                    <span class="text-xs text-zinc-500">({{ ethereumInLocalCurrency(seriesStats.stats.daily_volume * 1000000000000000000, true) }})</span>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-zinc-400">7D Volume:</span>
                  <div class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-zinc-400"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                    <span class="text-sm text-white">{{ (seriesStats.stats.weekly_volume).toFixed(2) }}</span>
                    <span class="text-xs text-zinc-500">({{ ethereumInLocalCurrency(seriesStats.stats.weekly_volume * 1000000000000000000, true) }})</span>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-zinc-400">Total Volume:</span>
                  <div class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-zinc-400"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                    <span class="text-sm text-white">{{ (seriesStats.stats.total_volume / 1000000000000000000).toFixed(2) }}</span>
                    <span class="text-xs text-zinc-500">({{ ethereumInLocalCurrency(seriesStats.stats.total_volume, true) }})</span>
                  </div>
                </div>
                <template v-if="seriesStats.stats.lowest_listing">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-zinc-400">Market Cap:</span>
                    <div class="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-zinc-400"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                      <span class="text-sm text-white">{{ (seriesStats.series.total_sold * seriesStats.stats.lowest_listing?.payment_token.base_price / 1000000000000000000).toFixed(2) }}</span>
                      <span class="text-xs text-zinc-500">({{ ethereumInLocalCurrency(seriesStats.series.total_sold * seriesStats.stats.lowest_listing?.payment_token.base_price, true) }})</span>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-zinc-400">Floor / Mint %:</span>
                    <span class="text-sm text-white">{{ Math.round(((seriesStats.stats.lowest_listing?.payment_token.base_price / 1000000000000000000) * ethereumPriceInUsd) / (seriesStats.series.mint_price / 100) * 100) }}%</span>
                  </div>
                </template>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-zinc-400">Last 5 Sales Avg:</span>
                  <div class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-zinc-400"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                    <span class="text-sm text-white">{{ (seriesStats.stats.five_last_sales_average).toFixed(4) }}</span>
                    <span class="text-xs text-zinc-500">({{ ethereumInLocalCurrency(seriesStats.stats.five_last_sales_average * 1000000000000000000) }})</span>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-zinc-400">7D Avg Sale Price:</span>
                  <template v-if="seriesStats.stats.weekly_average_price">
                    <div class="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-zinc-400"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                      <span class="text-sm text-white">{{ (seriesStats.stats.weekly_average_price).toFixed(4) }}</span>
                      <span class="text-xs text-zinc-500">({{ ethereumInLocalCurrency(seriesStats.stats.weekly_average_price * 1000000000000000000) }})</span>
                    </div>
                  </template>
                  <template v-else>
                    <span class="text-sm text-zinc-500 italic">No sales</span>
                  </template>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-zinc-400">14D Avg Sale Price:</span>
                  <template v-if="seriesStats.stats.two_weekly_average_price">
                    <div class="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-zinc-400"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                      <span class="text-sm text-white">{{ (seriesStats.stats.two_weekly_average_price).toFixed(4) }}</span>
                      <span class="text-xs text-zinc-500">({{ ethereumInLocalCurrency(seriesStats.stats.two_weekly_average_price * 1000000000000000000) }})</span>
                    </div>
                  </template>
                  <template v-else>
                    <span class="text-sm text-zinc-500 italic">No sales</span>
                  </template>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-zinc-400">30D Avg Sale Price:</span>
                  <template v-if="seriesStats.stats.monthly_average_price">
                    <div class="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-zinc-400"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221-152 92.8z"></path></svg>
                      <span class="text-sm text-white">{{ (seriesStats.stats.monthly_average_price).toFixed(4) }}</span>
                      <span class="text-xs text-zinc-500">({{ ethereumInLocalCurrency(seriesStats.stats.monthly_average_price * 1000000000000000000) }})</span>
                    </div>
                  </template>
                  <template v-else>
                    <span class="text-sm text-zinc-500 italic">No sales</span>
                  </template>
                </div>
              </div>
            </template>
          </div>
          <template v-if="listings">
            <div class="bg-zinc-800/30 border border-zinc-700/30 rounded-xl overflow-hidden">
              <div @click="settings.extraInfoOptions.listings = !settings.extraInfoOptions.listings" class="px-4 py-3 flex justify-between items-center text-zinc-400 hover:text-white cursor-pointer transition-colors duration-200 border-b border-zinc-800/50">
                <h3 class="text-sm font-medium">Listings</h3>
                <ChevronDownIcon class="w-5 h-5 transition-transform duration-200" :class="{ 'rotate-180': settings.extraInfoOptions.listings }" />
              </div>
              <template v-if="settings.extraInfoOptions.listings">
                <div class="px-4 py-3">
                  <div class="overflow-x-auto">
                    <table class="w-full text-xs">
                      <thead>
                      <tr class="border-b border-zinc-700/30 text-zinc-400">
                        <th class="text-left px-2 py-2 cursor-pointer hover:text-white transition-colors" :class="{ 'text-amber-500': listingsSortColumn === 'payment_token.base_price' }" @click="sortListings('payment_token.base_price')">Price</th>
                        <th class="text-left px-2 py-2 cursor-pointer hover:text-white transition-colors" :class="{ 'text-amber-500': listingsSortColumn === 'token.mint_number' }" @click="sortListings('token.mint_number')">Mint</th>
                        <th class="text-left px-2 py-2 cursor-pointer hover:text-white transition-colors" :class="{ 'text-amber-500': listingsSortColumn === 'maker_address' }" @click="sortListings('maker_address')">Seller</th>
                        <th class="text-left px-2 py-2 cursor-pointer hover:text-white transition-colors" :class="{ 'text-amber-500': listingsSortColumn === 'date_listed' }" @click="sortListings('date_listed')">Date</th>
                      </tr>
                      </thead>
                      <tbody>
                      <template v-for="(listing, index) in slicedListings" :key="index">
                        <tr class="border-b border-zinc-800/30 hover:bg-zinc-800/20 text-white transition-colors duration-200">
                          <td class="px-2 py-2 truncate">
                            <span class="text-white">{{ (listing.payment_token.base_price / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }} {{ listing.payment_token.symbol }}</span>
                            <template v-if="normalizeTokenSymbol(listing.payment_token.symbol) === 'ETH'">
                              <div class="text-xs text-zinc-500">({{ ethereumInLocalCurrency(listing.payment_token.base_price) }})</div>
                            </template>
                            <template v-else-if="normalizeTokenSymbol(listing.payment_token.symbol) === 'MATIC'">
                              <div class="text-xs text-zinc-500">({{ ethereumInLocalCurrency(getListingAsGweiPrice(listing)) }})</div>
                            </template>
                          </td>
                          <td class="px-2 py-2">
                            <button @click="openLinkWith(`https://opensea.io/assets/matic/${listing.token.contract_address}/${listing.token.id}`)" class="text-amber-500 hover:text-amber-400 transition-colors">#{{ listing.token.mint_number }}</button>
                          </td>
                          <td class="px-2 py-2">
                            <button @click="openLinkWith(`https://opensea.io/${listing.maker_address}`)" class="text-amber-500 hover:text-amber-400 transition-colors">{{ listing.maker_address.slice(2, 5) }}</button>
                          </td>
                          <td class="px-2 py-2 text-zinc-400 truncate">{{ $timeAgo(new Date(listing.date_listed)) }}</td>
                        </tr>
                      </template>
                      </tbody>
                    </table>
                  </div>
                  <div class="flex justify-center mt-4">
                    <Pagination :total-items="listings.length" :page-size="pageSize" v-model:current-page="listingsCurrentPage" />
                  </div>
                </div>
              </template>
            </div>
          </template>
          <template v-if="sales">
            <div class="bg-zinc-800/30 border border-zinc-700/30 rounded-xl overflow-hidden">
              <div @click="settings.extraInfoOptions.salesGraph = !settings.extraInfoOptions.salesGraph" class="px-4 py-3 flex justify-between items-center text-zinc-400 hover:text-white cursor-pointer transition-colors duration-200 border-b border-zinc-800/50">
                <h3 class="text-sm font-medium">Sales Chart</h3>
                <ChevronDownIcon class="w-5 h-5 transition-transform duration-200" :class="{ 'rotate-180': settings.extraInfoOptions.salesGraph }" />
              </div>
              <template v-if="settings.extraInfoOptions.salesGraph">
                <div class="px-4 py-3">
                  <SalesChart :sales="sales" />
                </div>
              </template>
            </div>
            <div class="bg-zinc-800/30 border border-zinc-700/30 rounded-xl overflow-hidden">
              <div @click="settings.extraInfoOptions.sales = !settings.extraInfoOptions.sales" class="px-4 py-3 flex justify-between items-center text-zinc-400 hover:text-white cursor-pointer transition-colors duration-200 border-b border-zinc-800/50">
                <h3 class="text-sm font-medium">Sales</h3>
                <ChevronDownIcon class="w-5 h-5 transition-transform duration-200" :class="{ 'rotate-180': settings.extraInfoOptions.sales }" />
              </div>
              <template v-if="settings.extraInfoOptions.sales">
                <div class="px-4 py-3">
                  <div class="overflow-x-auto">
                    <table class="w-full text-xs">
                      <thead>
                      <tr class="border-b border-zinc-700/30 text-zinc-400">
                        <th class="text-left px-2 py-2 cursor-pointer hover:text-white transition-colors" :class="{ 'text-amber-500': salesSortColumn === 'payment_token.base_price' }" @click="sortSales('payment_token.base_price')">Price</th>
                        <th class="text-left px-2 py-2 cursor-pointer hover:text-white transition-colors" :class="{ 'text-amber-500': salesSortColumn === 'token.mint_number' }" @click="sortSales('token.mint_number')">Mint</th>
                        <th class="text-left px-2 py-2 cursor-pointer hover:text-white transition-colors" :class="{ 'text-amber-500': salesSortColumn === 'buyer' }" @click="sortSales('buyer')">Buyer</th>
                        <th class="text-left px-2 py-2 cursor-pointer hover:text-white transition-colors" :class="{ 'text-amber-500': salesSortColumn === 'date_sold' }" @click="sortSales('date_sold')">Date</th>
                      </tr>
                      </thead>
                      <tbody>
                      <template v-for="(sale, index) in slicedSales" :key="index">
                        <tr class="border-b border-zinc-800/30 hover:bg-zinc-800/20 text-white transition-colors duration-200">
                          <td class="px-2 py-2 truncate">
                            <span class="text-white">{{ (sale.payment_token.base_price / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }} {{ sale.payment_token.symbol }}</span>
                            <template v-if="normalizeTokenSymbol(sale.payment_token.symbol) === 'ETH'">
                              <div class="text-xs text-zinc-500">({{ ethereumInLocalCurrency(sale.payment_token.base_price) }})</div>
                            </template>
                            <template v-else-if="normalizeTokenSymbol(sale.payment_token.symbol) === 'MATIC'">
                              <div class="text-xs text-zinc-500">({{ ethereumInLocalCurrency(getSaleAsGweiPrice(sale)) }})</div>
                            </template>
                          </td>
                          <td class="px-2 py-2">
                            <button @click="openLinkWith(`https://opensea.io/assets/matic/${sale.token.contract_address}/${sale.token.id}`)" class="text-amber-500 hover:text-amber-400 transition-colors">#{{ sale.token.mint_number }}</button>
                          </td>
                          <td class="px-2 py-2">
                            <button @click="openLinkWith(`https://opensea.io/${sale.buyer}`)" class="text-amber-500 hover:text-amber-400 transition-colors">{{ sale.buyer.slice(2, 5) }}</button>
                          </td>
                          <td class="px-2 py-2 text-zinc-400 truncate">{{ $timeAgo(new Date(sale.date_sold)) }}</td>
                        </tr>
                      </template>
                      </tbody>
                    </table>
                  </div>
                  <div class="flex justify-center mt-4">
                    <Pagination :total-items="sales.length" :page-size="pageSize" v-model:current-page="salesCurrentPage" />
                  </div>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import {computed, ref, watch} from "vue";
import {
  useEthereumUsdPrice,
  useSelectedAvatar,
  useSettings,
  useUser,
  getListingAsGweiPrice,
  getSaleAsGweiPrice
} from "#imports";
import {ChevronDownIcon, XMarkIcon} from "@heroicons/vue/24/solid";
import {getTokenImage} from "~/global/utils";
import {Ref} from "@vue/reactivity";
import {Sale} from "~/types/sale";
import {Listing} from "~/types/listing";
import {fetchListingsForSeries} from "~/composables/api/listings";
import {fetchSalesForSeries} from "~/composables/api/sales";
import {Capacitor} from "@capacitor/core";
import {marketplaceLink} from "~/global/marketplace";
import {getMintClasses} from "~/global/mint";
import {normalizeTokenSymbol} from "~/global/utils";

const selectedAvatar = useSelectedAvatar();
const ethereumPriceInUsd = useEthereumUsdPrice();
const user = useUser();
const settings = useSettings();

const pageSize = 5;
const sales: Ref<Array<Sale>> = ref([]);
const salesSortColumn = ref('date_sold');
const salesSortDirection = ref('desc');
const salesCurrentPage = ref(1);

const open = ref(false);
const listings: Ref<Array<Listing>> = ref([]);
const listingsSortColumn = ref('payment_token.base_price');
const listingsSortDirection = ref('asc');
const listingsCurrentPage = ref(1);

watch([selectedAvatar], () => {
  if (selectedAvatar.value) {
    open.value = true;
    refresh();
  }
});

function close() {
  selectedAvatar.value = null;
  open.value = false;
}

const avatarImage = computed(() => {
  return getTokenImage(selectedAvatar.value.seriesStats.series.image);
});

const seriesStats = computed(() => {
  return selectedAvatar.value.seriesStats;
});

const contract = computed(() => {
  return selectedAvatar.value.contract;
});

const series = computed(() => {
  return selectedAvatar.value.series;
});

const slicedListings = computed(() => {
  const start = (listingsCurrentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return sortedListings().slice(start, end);
});

function sortedListings(): Listing[] {
  return listings.value.sort((a, b) => {
    let aValue = a[listingsSortColumn.value];
    let bValue = b[listingsSortColumn.value];

    if (listingsSortColumn.value === "payment_token.base_price") {
      aValue = getListingAsGweiPrice(a);
      bValue = getListingAsGweiPrice(b);
    } else if (listingsSortColumn.value === "token.mint_number") {
      aValue = a.token.mint_number;
      bValue = b.token.mint_number;
    }

    if (aValue > bValue) {
      return listingsSortDirection.value === 'asc' ? 1 : -1;
    } else if (aValue < bValue) {
      return listingsSortDirection.value === 'asc' ? -1 : 1;
    } else {
      return 0;
    }
  });
}

function sortListings(column: string) {
  if (listingsSortColumn.value === column) {
    listingsSortDirection.value = listingsSortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    listingsSortColumn.value = column;
    listingsSortDirection.value = 'asc';
  }

  listingsCurrentPage.value = 1;
}

const slicedSales = computed(() => {
  const start = (salesCurrentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return sortedSales().slice(start, end);
});

function sortedSales(): Sale[] {
  return sales.value.sort((a, b) => {
    let aValue = a[salesSortColumn.value];
    let bValue = b[salesSortColumn.value];

    if (salesSortColumn.value === "payment_token.base_price") {
      aValue = a.payment_token.base_price;
      bValue = b.payment_token.base_price;
    } else if (salesSortColumn.value === "token.mint_number") {
      aValue = a.token.mint_number;
      bValue = b.token.mint_number;
    }

    if (aValue > bValue) {
      return salesSortDirection.value === 'asc' ? 1 : -1;
    } else if (aValue < bValue) {
      return salesSortDirection.value === 'asc' ? -1 : 1;
    } else {
      return 0;
    }
  });
}

function sortSales(column: string) {
  if (salesSortColumn.value === column) {
    salesSortDirection.value = salesSortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    salesSortColumn.value = column;
    salesSortDirection.value = 'asc';
  }

  salesCurrentPage.value = 1;
}

function refresh() {
  fetchListingsForSeries(contract.value, series.value).then((seriesListings) => {
    listings.value = seriesListings;
  });

  fetchSalesForSeries(contract.value, series.value).then((seriesSales) => {
    sales.value = seriesSales;
  });
}
</script>

<style scoped>
.slide-enter-active {
  transition: all 0.2s ease-in-out;
}

.slide-leave-active {
  transition: all 0.2s ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-240px);
  opacity: 0;
}

@media screen and (min-width: 640px) {
  .slide-enter-from,
  .slide-leave-to {
    transform: translateX(240px);
  }
}

/* For Webkit-based browsers (Chrome, Safari and Opera) */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* For IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
