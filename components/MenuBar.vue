<template>
  <div class="menubar" :class="{ 'mobile-padding-top': Capacitor.isNativePlatform() }">
    <div class="menubar-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>

import {Capacitor} from "@capacitor/core";
</script>

<style>
.menubar {
  @apply sticky top-[52px] sm:top-[63px] z-30 w-full bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-sm duration-500;
}

.menubar-content {
  @apply px-4 lg:px-8 py-3 flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-hide relative;
}

/* Prevent horizontal scroll when dropdowns are open */
.menubar-content:has(.filter-menu-button--menu) {
  @apply overflow-x-visible;
}

/* Fallback for browsers that don't support :has() */
.menubar-content.dropdown-open {
  @apply overflow-x-visible;
}

.menubar-content > * {
  @apply h-9 sm:h-10 flex-shrink-0;
}

/* Special handling for SearchBar - allow it to grow but not shrink */
.menubar-content > .searchbar {
  @apply flex-grow-0 flex-shrink-0;
}

/* Push subsequent items to the right */
.menubar-content > .searchbar ~ * {
  @apply ml-auto;
}

/* Reset margin for items after the first right-aligned item */
.menubar-content > .searchbar ~ * ~ * {
  @apply ml-0;
}

/* Modern select styling */
.menubar-content > select {
  @apply px-3 py-2 bg-slate-800/30 hover:bg-slate-700/50 border border-slate-700/30 hover:border-slate-600/50 text-sm text-slate-300 hover:text-white placeholder-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 rounded-lg transition-all duration-200 cursor-pointer min-w-0 w-full max-w-[7rem] md:max-w-fit;
}

.menubar-content > select > option {
  @apply bg-slate-800 text-slate-300;
}

/* Modern button styling for filter buttons */
.menubar-content > button {
  @apply px-3 py-2 bg-slate-800/30 hover:bg-slate-700/50 border border-slate-700/30 hover:border-slate-600/50 text-slate-300 hover:text-white rounded-lg transition-all duration-200 font-medium whitespace-nowrap;
}

.menubar-content > button.active {
  background-color: rgb(251 146 60 / 0.15);
  border-color: rgb(251 146 60 / 0.3);
  color: rgb(251 146 60);
}

.menubar-content > button.active:hover {
  color: rgb(254 215 170);
  background-color: rgb(251 146 60 / 0.2);
}

/* Custom scrollbar for horizontal overflow on mobile */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.mobile-padding-top {
  top: calc(52px + env(safe-area-inset-top));
}

/* Additional responsive improvements */
@media (max-width: 640px) {
  .menubar-content {
    @apply px-3 py-2;
  }
  
  .menubar-content > * {
    @apply h-8 text-sm;
  }
  
  .menubar-content > select,
  .menubar-content > button {
    @apply px-2.5 py-1.5 text-xs;
  }
}
</style>
