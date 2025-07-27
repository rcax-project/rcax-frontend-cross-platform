<template>
  <div>
    <!-- Mobile Menu Button -->
    <button 
      @click="toggleSidebar()"
      class="lg:hidden fixed top-4 left-4 z-50 flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-slate-300 hover:text-white hover:bg-zinc-700/50 transition-all duration-200"
      :class="{ 'left-64': sidebarOpen }"
    >
      <Bars3Icon v-if="!sidebarOpen" class="w-5 h-5" />
      <XMarkIcon v-else class="w-5 h-5" />
    </button>

    <!-- Sidebar Overlay (Mobile) -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="sidebarOpen" 
        @click="closeSidebar()"
        class="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      ></div>
    </Transition>

    <!-- Sidebar -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <aside 
        v-show="sidebarOpen || isDesktop"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false; appsMenuOpen = false"
        class="group fixed left-0 top-0 h-full bg-[#141415] border-r border-zinc-800/50 flex flex-col transition-all duration-300 ease-in-out"
        :class="[
          { 'sidebar-mobile-padding-top': Capacitor.isNativePlatform() },
          isDesktop && isCompact && !isHovered ? 'w-16 z-40' : 'w-64 z-50'
        ]"
      >
        <!-- Logo Section -->
        <div class="px-4 py-6 overflow-hidden">
          <div class="flex items-center gap-3">
            <div class="relative flex-shrink-0">
              <img class="h-8 w-8 transition-transform duration-300" src="/images/branding/rcax/RCAX_RoundedSquare_Color.svg">
            </div>
            <div
              class="transition-all duration-300 overflow-hidden"
              :class="isDesktop && isCompact && !isHovered ? 'w-0 opacity-0' : 'w-auto opacity-100'"
            >
              <img class="h-5 w-auto transition-opacity duration-300" src="/images/branding/rcax/RCAX_Text_White.svg">
            </div>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="flex-1 overflow-y-auto px-2 py-0">
          <!-- Main Navigation -->
          <div class="space-y-1">
            
            <NuxtLink 
              to="/" 
              exact-active-class="sidebar-link-active" 
              class="sidebar-link"
              :class="{ 'compact-mode': isDesktop && isCompact && !isHovered }"
              @click="closeSidebarOnMobile"
            >
              <HomeIcon class="sidebar-icon flex-shrink-0" />
              <span>Avatars</span>
            </NuxtLink>
            
            <NuxtLink 
              to="/avatar" 
              active-class="sidebar-link-active" 
              class="sidebar-link"
              :class="{ 'compact-mode': isDesktop && isCompact && !isHovered }"
              @click="closeSidebarOnMobile"
            >
              <PhotoIcon class="sidebar-icon flex-shrink-0" />
              <span>Exporter</span>
            </NuxtLink>

          </div>

          <!-- Analytics Section -->
          <div class="space-y-1">
            
            <NuxtLink 
              to="/wallet" 
              active-class="sidebar-link-active" 
              class="sidebar-link"
              :class="{ 'compact-mode': isDesktop && isCompact && !isHovered }"
              @click="closeSidebarOnMobile"
            >
              <WalletIcon class="sidebar-icon flex-shrink-0" />
              <span>Wallet</span>
            </NuxtLink>

            <NuxtLink 
              to="/watchlist" 
              exact-active-class="sidebar-link-active" 
              class="sidebar-link"
              :class="{ 'compact-mode': isDesktop && isCompact && !isHovered }"
              @click="closeSidebarOnMobile"
            >
              <StarIcon class="sidebar-icon flex-shrink-0" />
              <span>Watchlist</span>
            </NuxtLink>

            <NuxtLink 
              to="/stats/general" 
              active-class="sidebar-link-active" 
              class="sidebar-link"
              :class="{ 'compact-mode': isDesktop && isCompact && !isHovered }"
              @click="closeSidebarOnMobile"
            >
              <ChartBarIcon class="sidebar-icon flex-shrink-0" />
              <span>Stats</span>
            </NuxtLink>

            <NuxtLink 
              to="/events" 
              active-class="sidebar-link-active" 
              class="sidebar-link"
              :class="{ 'compact-mode': isDesktop && isCompact && !isHovered }"
              @click="closeSidebarOnMobile"
            >
              <BoltIcon class="sidebar-icon flex-shrink-0" />
              <span>Activity</span>
            </NuxtLink>
          </div>

          <!-- Marketplace Section -->
          <div class="space-y-1">
            
            <NuxtLink 
              to="/shop" 
              active-class="sidebar-link-active" 
              class="sidebar-link"
              :class="{ 'compact-mode': isDesktop && isCompact && !isHovered }"
              @click="closeSidebarOnMobile"
            >
              <ShoppingBagIcon class="sidebar-icon flex-shrink-0" />
              <span>Shop</span>
            </NuxtLink>

            <NuxtLink 
              to="/listings" 
              active-class="sidebar-link-active" 
              class="sidebar-link"
              :class="{ 'compact-mode': isDesktop && isCompact && !isHovered }"
              @click="closeSidebarOnMobile"
            >
              <GlobeEuropeAfricaIcon class="sidebar-icon flex-shrink-0" />
              <span>Browser</span>
            </NuxtLink>

            <NuxtLink 
              to="/alerts" 
              active-class="sidebar-link-active" 
              class="sidebar-link"
              :class="{ 'compact-mode': isDesktop && isCompact && !isHovered }"
              @click="closeSidebarOnMobile"
            >
              <BellIcon class="sidebar-icon flex-shrink-0" />
              <span>Alerts</span>
            </NuxtLink>
          </div>

          <!-- Apps Section -->
          <template v-if="!Capacitor.isNativePlatform() && !(isDesktop && isCompact && !isHovered)">
            <div class="mt-3 pt-3 border-t border-zinc-700/50 space-y-1">
              <NuxtLink 
                to="/dapps/randomavatarswap"
                class="sidebar-link"
                @click="closeSidebarOnMobile"
              >
                <Squares2X2Icon class="sidebar-icon flex-shrink-0" />
                <span>Random Avatar Swap</span>
              </NuxtLink>
              <NuxtLink 
                to="https://avatartraits.xyz"
                target="_blank"
                class="sidebar-link"
                @click="closeSidebarOnMobile"
              >
                <GlobeAltIcon class="sidebar-icon flex-shrink-0" />
                <span>AvatarTraits.xyz</span>
              </NuxtLink>
            </div>
          </template>
        </nav>

        <!-- Bottom Section -->
        <div 
          v-if="!(isDesktop && isCompact && !isHovered)"
          class="border-t border-zinc-800/50 p-4 space-y-3"
        >
          <!-- Currency Selector -->
          <div class="relative">
            <select 
              v-model="settings.currency.preferred"
              class="w-full appearance-none bg-zinc-800/30 border border-zinc-700/30 text-zinc-400 text-sm rounded-lg px-3 py-2 pr-8 hover:bg-zinc-700/40 hover:border-zinc-600/50 focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all duration-200"
            >
              <option v-for="currency in CURRENCIES" :key="currency.ticker" :value="currency.ticker" class="bg-zinc-800">
                {{ currency.ticker }}
              </option>
            </select>
            <ChevronDownIcon class="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>

          <!-- User Section -->
          <template v-if="user?.username">
            <div class="space-y-2">
              <div class="flex items-center space-x-3 px-3 py-2 bg-zinc-800/30 rounded-lg">
                <div class="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {{ user.username.charAt(0).toUpperCase() }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-white font-medium text-sm truncate">{{ user.username }}</div>
                  <div class="text-zinc-500 text-xs">{{ user.tier < 1 ? 'Free User' : 'Pro User' }}</div>
                </div>
              </div>
              
              <template v-if="user?.tier < 1">
                <NuxtLink
                  to="/upgrade"
                  @click="closeSidebarOnMobile"
                  class="block w-full px-3 py-2 text-amber-400 hover:text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 rounded-lg transition-all duration-200 font-medium text-sm text-center"
                >
                  Upgrade to Pro
                </NuxtLink>
              </template>
              
              <button 
                @click="logout()"
                class="block w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-zinc-700/50 rounded-lg transition-all duration-200 text-sm"
              >
                Sign out
              </button>
            </div>
          </template>
          <template v-else>
            <div class="space-y-2">
              <NuxtLink
                to="/login"
                @click="closeSidebarOnMobile"
                class="block px-3 py-2 text-slate-300 hover:text-white hover:bg-zinc-700/50 rounded-lg transition-all duration-200 font-medium text-sm text-center border border-zinc-700/50"
              >
                Login
              </NuxtLink>
              <NuxtLink
                to="/signup"
                @click="closeSidebarOnMobile"
                class="block px-3 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-200 font-medium text-sm text-center"
              >
                Create account
              </NuxtLink>
            </div>
          </template>
        </div>
      </aside>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from '#imports';
import { useUser, useSettings, useRouter } from '#imports';
import { deleteToken } from '~/composables/api/user';
import { CURRENCIES } from '~/types/currency';
import { Capacitor } from '@capacitor/core';
import { 
  ChevronDownIcon, Bars3Icon, XMarkIcon, HomeIcon, PhotoIcon,
  Squares2X2Icon, WalletIcon, ChartBarIcon, BoltIcon, 
  ShoppingBagIcon, GlobeEuropeAfricaIcon, BellIcon, StarIcon, GlobeAltIcon
} from '@heroicons/vue/24/outline';

const user = useUser();
const settings = useSettings();
const router = useRouter();

const sidebarOpen = ref(false);
const appsMenuOpen = ref(false);
const isDesktop = ref(false);
const isCompact = ref(true);
const isHovered = ref(false);

const checkDesktop = () => {
  isDesktop.value = window.innerWidth >= 1024;
};

onMounted(() => {
  checkDesktop();
  window.addEventListener('resize', checkDesktop);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkDesktop);
});

router.afterEach(() => {
  if (!isDesktop.value) {
    sidebarOpen.value = false;
  }
});

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
}

function closeSidebar() {
  sidebarOpen.value = false;
}

function closeSidebarOnMobile() {
  if (!isDesktop.value) {
    sidebarOpen.value = false;
  }
}

function toggleAppsMenu() {
  appsMenuOpen.value = !appsMenuOpen.value;
}

function logout() {
  deleteToken();
  closeSidebarOnMobile();
}
</script>

<style scoped>
.sidebar-link {
  @apply flex items-center gap-3 px-2 text-slate-300 hover:text-white hover:bg-zinc-700/30 rounded-lg transition-all duration-200 text-sm font-medium relative h-10;
}

.sidebar-link span {
  @apply whitespace-nowrap;
}

.sidebar-link.compact-mode {
  @apply justify-center px-0 mx-auto w-10;
}

.sidebar-link.compact-mode span {
  @apply absolute left-14 top-1/2 transform -translate-y-1/2 bg-zinc-800 text-white px-2 py-1 rounded shadow-lg z-50 opacity-0 pointer-events-none transition-opacity duration-200 whitespace-nowrap border border-zinc-700;
}

.sidebar-link.compact-mode:hover span {
  @apply opacity-100;
}

.sidebar-link-active {
  @apply text-white bg-zinc-700/50 hover:bg-zinc-700/60;
}

.sidebar-sublink {
  @apply block px-3 py-1.5 text-slate-400 hover:text-white hover:bg-zinc-700/30 rounded-lg transition-all duration-200 text-sm;
}

.sidebar-icon {
  @apply h-5 w-5 flex-shrink-0;
}

.sidebar-mobile-padding-top {
  padding-top: env(safe-area-inset-top);
}
</style>