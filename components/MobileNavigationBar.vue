<template>
  <div class="fixed md:hidden bottom-0 w-full z-40 bg-secondary/90 backdrop-blur-lg border-t border-white/5" style="padding-bottom: env(safe-area-inset-bottom);">
    <div class="py-2 grid grid-cols-5 justify-around items-center text-white/40">
      <NuxtLink to="/" class="flex flex-col items-center justify-center" :class="{ 'active-tab': isActive('/') }">
        <component :is="iconForRoute('/')" class="icon-size"/>
        <span class="text-xs font-medium">Avatars</span>
      </NuxtLink>
      <NuxtLink to="/watchlist" class="flex flex-col items-center justify-center" :class="{ 'active-tab': isActive('/watchlist') }">
        <component :is="iconForRoute('/watchlist')" class="icon-size"/>
        <span class="text-xs font-medium">Watchlist</span>
      </NuxtLink>
      <NuxtLink to="/events" class="flex flex-col items-center justify-center" :class="{ 'active-tab': isActive('/events') }">
        <component :is="iconForRoute('/events')" class="icon-size"/>
        <span class="text-xs font-medium">Activity</span>
      </NuxtLink>
      <NuxtLink to="/wallet" class="flex flex-col items-center justify-center" :class="{ 'active-tab': isActive('/wallet') }">
        <component :is="iconForRoute('/wallet')" class="icon-size"/>
        <span class="text-xs font-medium">Wallet</span>
      </NuxtLink>
      <NuxtLink to="/shop" class="flex flex-col items-center justify-center" :class="{ 'active-tab': isActive('/shop') }">
        <component :is="iconForRoute('/shop')" class="icon-size"/>
        <span class="text-xs font-medium">Shop</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import {Capacitor} from "@capacitor/core";
import {
  HomeIcon, StarIcon, WalletIcon, BoltIcon, ShoppingBagIcon
} from "@heroicons/vue/24/outline";
import {
  HomeIcon as HomeIconSolid, StarIcon as StarIconSolid, WalletIcon as WalletIconSolid, BoltIcon as BoltIconSolid, ShoppingBagIcon as ShoppingBagIconSolid
} from "@heroicons/vue/24/solid";

const route = useRoute();

function isActive(targetRoute) {
  return route.path === targetRoute;
}

function iconForRoute(targetRoute) {
  const icons = {
    '/': isActive('/') ? HomeIconSolid : HomeIcon,
    '/watchlist': isActive('/watchlist') ? StarIconSolid : StarIcon,
    '/events': isActive('/events') ? BoltIconSolid : BoltIcon,
    '/wallet': isActive('/wallet') ? WalletIconSolid : WalletIcon,
    '/shop': isActive('/shop') ? ShoppingBagIconSolid : ShoppingBagIcon,
  };
  return icons[targetRoute] || null; // Return null or a default icon if route is not matched
}
</script>

<style>
.active-tab {
  @apply text-white;
}

.icon-size {
  @apply h-7 w-7;
}
</style>
