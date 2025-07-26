<template>
  <div class="sticky top-0 z-30 w-full bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-lg">
    <div class="px-4 lg:px-8 py-4">
      <div class="flex items-center justify-start gap-2 overflow-x-auto scrollbar-hide">
        <NuxtLink 
          to="/wallet" 
          active-class="stats-tab-active" 
          class="stats-tab group"
        >
          <WalletIcon class="stats-tab-icon" />
          <span class="relative z-10">Wallet</span>
          <div class="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-amber-500/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </NuxtLink>

        <NuxtLink 
          to="/watchlist" 
          exact-active-class="stats-tab-active" 
          class="stats-tab group"
        >
          <StarIcon class="stats-tab-icon" />
          <span class="relative z-10">Watchlist</span>
          <div class="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-amber-500/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </NuxtLink>

        <NuxtLink 
          to="/" 
          exact-active-class="stats-tab-active" 
          class="stats-tab group"
        >
          <ChartBarIcon class="stats-tab-icon" />
          <span class="relative z-10">Stats</span>
          <div class="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-amber-500/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </NuxtLink>

        <NuxtLink 
          to="/events" 
          active-class="stats-tab-active" 
          class="stats-tab group"
        >
          <BoltIcon class="stats-tab-icon" />
          <span class="relative z-10">Activity</span>
          <div class="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-amber-500/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </NuxtLink>

        <NuxtLink 
          to="/shop" 
          active-class="stats-tab-active" 
          class="stats-tab group"
        >
          <ShoppingBagIcon class="stats-tab-icon" />
          <span class="relative z-10">Shop</span>
          <div class="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-amber-500/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </NuxtLink>

        <NuxtLink 
          to="/listings" 
          active-class="stats-tab-active" 
          class="stats-tab group"
        >
          <GlobeEuropeAfricaIcon class="stats-tab-icon" />
          <span class="relative z-10">Browser</span>
          <div class="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-amber-500/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </NuxtLink>

        <NuxtLink 
          to="/alerts" 
          active-class="stats-tab-active" 
          class="stats-tab group"
        >
          <BellIcon class="stats-tab-icon" />
          <span class="relative z-10">Alerts</span>
          <div class="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-amber-500/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {StarIcon, BellIcon, ChartBarIcon, WalletIcon, TagIcon, BoltIcon, ShoppingBagIcon, GlobeEuropeAfricaIcon} from "@heroicons/vue/24/solid";
</script>

<style scoped>
.stats-tab {
  @apply relative inline-flex items-center gap-1.5 px-3 py-2 text-slate-300 hover:text-white bg-slate-800/30 hover:bg-slate-700/50 border border-slate-700/30 hover:border-slate-600/50 rounded-lg transition-all duration-200 font-medium whitespace-nowrap min-w-0 flex-shrink-0 text-sm;
}

.stats-tab-active {
  color: rgb(251 146 60) !important;
  background-color: rgb(251 146 60 / 0.15) !important;
  border-color: rgb(251 146 60 / 0.3) !important;
  box-shadow: 0 10px 15px -3px rgb(251 146 60 / 0.2), 0 4px 6px -4px rgb(251 146 60 / 0.2) !important;
}

.stats-tab-active:hover {
  color: rgb(254 215 170) !important;
  background-color: rgb(251 146 60 / 0.2) !important;
  border-color: rgb(251 146 60 / 0.4) !important;
}

.stats-tab-icon {
  @apply h-4 w-4 flex-shrink-0;
}

/* Active state for the gradient overlay */
.stats-tab-active .absolute {
  @apply opacity-30;
}

/* Custom scrollbar for horizontal overflow on mobile */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Additional responsive improvements */
@media (max-width: 768px) {
  .stats-tab {
    @apply px-2 py-1.5 text-xs gap-1;
  }
  
  .stats-tab-icon {
    @apply h-3.5 w-3.5;
  }
}
</style>
