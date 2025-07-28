<template>
  <!-- The overlay is used to cover the main content when the drawer is open -->
  <div class="fixed inset-0 bg-black/50 z-40" v-if="open" @click="close"></div>

  <!-- The drawer content -->
  <transition name="slide">
    <div v-if="open" class="fixed flex flex-col top-0 left-0 bottom-0 sm:right-0 sm:left-auto w-96 max-w-[93%] bg-[#141415] border-l border-zinc-800/50 shadow-lg z-50" :class="{ 'page-mobile-padding-top': Capacitor.isNativePlatform() }">
      <!-- Header -->
      <div class="px-4 lg:px-6 py-4 sticky top-0 bg-[#141415]/95 backdrop-blur-xl border-b border-zinc-800/50 z-30">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3 min-w-0 flex-1">
            <div class="w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
              <img-placeholder 
                :src="avatarImage" 
                img-class="w-full h-full object-cover"
              />
            </div>
            <div class="min-w-0 flex-1">
              <h1 class="text-white font-semibold text-lg truncate">{{ selectedAvatar.series }}</h1>
              <p class="text-sm text-zinc-400 truncate">{{ seriesStats.collection.name.replace("x Reddit Collectible Avatars", "") }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <button @click="openLinkWith(marketplaceLink(seriesStats))" class="p-2 hover:bg-zinc-800/50 text-zinc-400 hover:text-white rounded-lg transition-all duration-200" title="View on Marketplace">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </button>
            <button @click.stop="close" class="p-2 hover:bg-zinc-800/50 text-zinc-400 hover:text-white rounded-lg transition-all duration-200">
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
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
        </div>

        <!-- Price and Actions -->
        <div class="space-y-4">
          <!-- Current Price -->
          <template v-if="seriesStats.stats.lowest_listing">
            <div class="text-center">
              <p class="text-sm text-zinc-400 mb-1">Current price</p>
              <div class="flex items-center justify-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-5 h-5 text-purple-400"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                <span class="text-xl font-bold text-white">{{ (seriesStats.stats.lowest_listing.payment_token.base_price / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }}</span>
              </div>
              <p class="text text-zinc-500 mt-1">{{ ethereumInLocalCurrency(seriesStats.stats.lowest_listing.payment_token.base_price) }}</p>
            </div>
          </template>

          <!-- Action Buttons -->
          <div class="grid grid-cols-1 gap-3">
            <template v-if="selectedAvatar.seriesStats.series.total_sold >= selectedAvatar.seriesStats.series.total_quantity || !selectedAvatar.seriesStats.series.id">
              <div class="px-4 py-3 bg-zinc-800/50 border border-zinc-700/30 rounded-xl text-center">
                <span class="text-zinc-400 font-medium">SOLD OUT</span>
              </div>
            </template>
            <template v-else>
              <a :href="`https://www.reddit.com/avatar/shop/product/${selectedAvatar.seriesStats.series.id}`" target="_blank" class="px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl text-center transition-all duration-200 shadow-lg hover:shadow-xl">
                <div class="flex items-center justify-center gap-2">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path fill="white" d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                  </svg>
                  <span class="text-white font-semibold">${{ selectedAvatar.seriesStats.series.mint_price / 100 }}</span>
                </div>
              </a>
            </template>
            <button @click="openLinkWith(`https://reddit.com/u/${seriesStats?.collection.artist.displayName}`)" target="_blank" class="px-4 py-3 bg-zinc-800/30 hover:bg-zinc-700/50 border border-zinc-700/30 hover:border-zinc-600/50 rounded-xl transition-all duration-200">
              <div class="flex items-center justify-center gap-2">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path fill="#FF4500" d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                </svg>
                <span class="text-white font-medium text-sm">{{ seriesStats.collection.artist.displayName }}</span>
              </div>
            </button>
          </div>
        </div>
        <!-- Quick Stats Grid -->
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-4 text-center">
            <p class="text-xs text-zinc-400 mb-1">Total Supply</p>
            <p class="text-lg font-semibold text-white">{{ seriesStats.series.total_quantity.toLocaleString() }}</p>
          </div>
          <div class="bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-4 text-center">
            <p class="text-xs text-zinc-400 mb-1">Minted</p>
            <p class="text-lg font-semibold text-white">{{ seriesStats.series.total_sold.toLocaleString() }}</p>
          </div>
          <div class="bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-4 text-center">
            <p class="text-xs text-zinc-400 mb-1">Listed</p>
            <p class="text-lg font-semibold text-white">{{ seriesStats.stats.listed_percentage.toFixed(1) }}%</p>
          </div>
          <div class="bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-4 text-center">
            <p class="text-xs text-zinc-400 mb-1">24h Volume</p>
            <div class="flex items-center justify-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-zinc-400"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
              <p class="text-lg font-semibold text-white">{{ seriesStats.stats.daily_volume.toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <!-- Details Sections -->
        <div class="flex flex-col gap-4 w-full">
          <!-- Collection Info -->
          <div class="bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-4">
            <h3 class="text-sm font-semibold text-white mb-3">Collection Details</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-zinc-400">Collection:</span>
                <button @click="openLinkWith(marketplaceLink(seriesStats))" class="text-sm text-white hover:text-zinc-300 transition-colors duration-200 truncate ml-2">{{ seriesStats.collection.name.replace("x Reddit Collectible Avatars", "") }}</button>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-zinc-400">Artist:</span>
                <a :href="`https://reddit.com/u/${seriesStats?.collection.artist.displayName}`" target="_blank" class="text-sm text-white hover:text-zinc-300 transition-colors duration-200">{{ seriesStats.collection.artist.displayName }}</a>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-zinc-400">Mint Price:</span>
                <span class="text-sm text-white">${{ selectedAvatar.seriesStats.series.mint_price / 100 }}</span>
              </div>
            </div>
          </div>

          <!-- Market Stats -->
          <div class="bg-zinc-800/30 border border-zinc-700/30 rounded-xl overflow-hidden">
            <div @click="settings.extraInfoOptions.marketData = !settings.extraInfoOptions.marketData" class="px-4 py-3 flex justify-between items-center text-zinc-400 hover:text-white cursor-pointer transition-colors duration-200 border-b border-zinc-800/50">
              <h3 class="text-sm font-semibold">Market Statistics</h3>
              <ChevronDownIcon class="w-5 h-5 transition-transform duration-200" :class="{ 'rotate-180': settings.extraInfoOptions.marketData }" />
            </div>
            <template v-if="settings.extraInfoOptions.marketData">
              <div class="px-4 py-3 space-y-3">
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
                <div class="flex items-center gap-2">
                  <h3 class="text-sm font-semibold">Active Listings</h3>
                  <span class="bg-zinc-700/50 text-zinc-300 text-xs px-2 py-0.5 rounded-full">{{ listings.length }}</span>
                </div>
                <ChevronDownIcon class="w-5 h-5 transition-transform duration-200" :class="{ 'rotate-180': settings.extraInfoOptions.listings }" />
              </div>
              <template v-if="settings.extraInfoOptions.listings">
                <div class="px-4 py-2 border-b border-zinc-800/30">
                  <div class="flex items-center gap-2 text-xs">
                    <span class="text-zinc-400">Sort by:</span>
                    <button @click="sortListings('payment_token.base_price')" class="px-2 py-1 rounded transition-colors" :class="{ 'text-white bg-zinc-700/50': listingsSortColumn === 'payment_token.base_price', 'text-zinc-400 hover:text-white': listingsSortColumn !== 'payment_token.base_price' }">
                      Price {{ listingsSortColumn === 'payment_token.base_price' ? (listingsSortDirection === 'asc' ? '↑' : '↓') : '' }}
                    </button>
                    <button @click="sortListings('date_listed')" class="px-2 py-1 rounded transition-colors" :class="{ 'text-white bg-zinc-700/50': listingsSortColumn === 'date_listed', 'text-zinc-400 hover:text-white': listingsSortColumn !== 'date_listed' }">
                      Date {{ listingsSortColumn === 'date_listed' ? (listingsSortDirection === 'asc' ? '↑' : '↓') : '' }}
                    </button>
                  </div>
                </div>
                <div class="divide-y divide-zinc-800/30">
                  <template v-for="(listing, index) in slicedListings" :key="index">
                    <div class="px-4 py-3 hover:bg-zinc-800/20 transition-colors duration-200">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                          <button @click="openLinkWith(`https://opensea.io/assets/matic/${listing.token.contract_address}/${listing.token.id}`)" class="w-10 h-10 bg-zinc-700/50 hover:bg-zinc-600/50 rounded-lg flex items-center justify-center transition-colors duration-200">
                            <span class="text-xs font-medium text-white">#{{ listing.token.mint_number }}</span>
                          </button>
                          <div>
                            <button @click="openLinkWith(`https://opensea.io/assets/matic/${listing.token.contract_address}/${listing.token.id}`)" class="flex items-center gap-1 hover:opacity-80 transition-opacity duration-200">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-400"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                              <span class="text-white text-sm font-medium">{{ (listing.payment_token.base_price / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }} {{ listing.payment_token.symbol }}</span>
                            </button>
                            <template v-if="normalizeTokenSymbol(listing.payment_token.symbol) === 'ETH'">
                              <p class="text-xs text-zinc-500">{{ ethereumInLocalCurrency(listing.payment_token.base_price) }}</p>
                            </template>
                            <template v-else-if="normalizeTokenSymbol(listing.payment_token.symbol) === 'MATIC'">
                              <p class="text-xs text-zinc-500">{{ ethereumInLocalCurrency(getListingAsGweiPrice(listing)) }}</p>
                            </template>
                          </div>
                        </div>
                        <div class="text-right">
                          <p class="text-xs text-zinc-500">{{ $timeAgo(new Date(listing.date_listed)) }}</p>
                          <button @click="openLinkWith(`https://opensea.io/${listing.maker_address}`)" class="text-xs text-zinc-400 hover:text-zinc-300 transition-colors mt-1">{{ listing.maker_address.slice(0, 6) }}...{{ listing.maker_address.slice(-4) }}</button>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
                <template v-if="listings.length > pageSize">
                  <div class="px-4 py-3 border-t border-zinc-800/30">
                    <Pagination :total-items="listings.length" :page-size="pageSize" v-model:current-page="listingsCurrentPage" />
                  </div>
                </template>
              </template>
            </div>
          </template>
          <template v-if="sales">
            <div class="bg-zinc-800/30 border border-zinc-700/30 rounded-xl overflow-hidden">
              <div @click="settings.extraInfoOptions.salesGraph = !settings.extraInfoOptions.salesGraph" class="px-4 py-3 flex justify-between items-center text-zinc-400 hover:text-white cursor-pointer transition-colors duration-200 border-b border-zinc-800/50">
                <h3 class="text-sm font-semibold">Price History</h3>
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
                <div class="flex items-center gap-2">
                  <h3 class="text-sm font-semibold">Recent Sales</h3>
                  <span class="bg-zinc-700/50 text-zinc-300 text-xs px-2 py-0.5 rounded-full">{{ sales.length }}</span>
                </div>
                <ChevronDownIcon class="w-5 h-5 transition-transform duration-200" :class="{ 'rotate-180': settings.extraInfoOptions.sales }" />
              </div>
              <template v-if="settings.extraInfoOptions.sales">
                <div class="px-4 py-2 border-b border-zinc-800/30">
                  <div class="flex items-center gap-2 text-xs">
                    <span class="text-zinc-400">Sort by:</span>
                    <button @click="sortSales('payment_token.base_price')" class="px-2 py-1 rounded transition-colors" :class="{ 'text-white bg-zinc-700/50': salesSortColumn === 'payment_token.base_price', 'text-zinc-400 hover:text-white': salesSortColumn !== 'payment_token.base_price' }">
                      Price {{ salesSortColumn === 'payment_token.base_price' ? (salesSortDirection === 'asc' ? '↑' : '↓') : '' }}
                    </button>
                    <button @click="sortSales('date_sold')" class="px-2 py-1 rounded transition-colors" :class="{ 'text-white bg-zinc-700/50': salesSortColumn === 'date_sold', 'text-zinc-400 hover:text-white': salesSortColumn !== 'date_sold' }">
                      Date {{ salesSortColumn === 'date_sold' ? (salesSortDirection === 'asc' ? '↑' : '↓') : '' }}
                    </button>
                  </div>
                </div>
                <div class="divide-y divide-zinc-800/30">
                  <template v-for="(sale, index) in slicedSales" :key="index">
                    <div class="px-4 py-3 hover:bg-zinc-800/20 transition-colors duration-200">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                          <button @click="openLinkWith(`https://opensea.io/assets/matic/${sale.token.contract_address}/${sale.token.id}`)" class="w-10 h-10 bg-zinc-700/50 hover:bg-zinc-600/50 rounded-lg flex items-center justify-center transition-colors duration-200">
                            <span class="text-xs font-medium text-white">#{{ sale.token.mint_number }}</span>
                          </button>
                          <div>
                            <button @click="openLinkWith(`https://opensea.io/assets/matic/${sale.token.contract_address}/${sale.token.id}`)" class="flex items-center gap-1 hover:opacity-80 transition-opacity duration-200">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-400"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                              <span class="text-white text-sm font-medium">{{ (sale.payment_token.base_price / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }} {{ sale.payment_token.symbol }}</span>
                            </button>
                            <template v-if="normalizeTokenSymbol(sale.payment_token.symbol) === 'ETH'">
                              <p class="text-xs text-zinc-500">{{ ethereumInLocalCurrency(sale.payment_token.base_price) }}</p>
                            </template>
                            <template v-else-if="normalizeTokenSymbol(sale.payment_token.symbol) === 'MATIC'">
                              <p class="text-xs text-zinc-500">{{ ethereumInLocalCurrency(getSaleAsGweiPrice(sale)) }}</p>
                            </template>
                          </div>
                        </div>
                        <div class="text-right">
                          <p class="text-xs text-zinc-500">{{ $timeAgo(new Date(sale.date_sold)) }}</p>
                          <button @click="openLinkWith(`https://opensea.io/${sale.buyer}`)" class="text-xs text-zinc-400 hover:text-zinc-300 transition-colors mt-1">{{ sale.buyer.slice(0, 6) }}...{{ sale.buyer.slice(-4) }}</button>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
                <template v-if="sales.length > pageSize">
                  <div class="px-4 py-3 border-t border-zinc-800/30">
                    <Pagination :total-items="sales.length" :page-size="pageSize" v-model:current-page="salesCurrentPage" />
                  </div>
                </template>
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
