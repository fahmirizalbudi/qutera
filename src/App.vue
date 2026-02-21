<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
import gsap from 'gsap'

interface Quote {
  id: number
  quote: string
  author: string
}

const allQuotes = ref<Quote[]>([])
const displayedQuotes = ref<Quote[]>([])
const loading = ref(true)
const loadingMore = ref(false)
const observerTarget = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const fetchQuotes = async () => {
  try {
    const response = await fetch('https://dummyjson.com/quotes?limit=100')
    const data = await response.json()
    allQuotes.value = data.quotes
    appendQuotes()
    loading.value = false
  } catch (err) {
    console.error('Failed to fetch quotes:', err)
  }
}

const appendQuotes = () => {
  if (loadingMore.value) return
  loadingMore.value = true
  
  const currentCount = displayedQuotes.value.length
  const nextQuotes = [...allQuotes.value]
    .sort(() => 0.5 - Math.random())
    .slice(0, 9)
  
  displayedQuotes.value.push(...nextQuotes)
  
  nextTick(() => {
    const newCards = gsap.utils.toArray<HTMLElement>('.quote-tile').slice(currentCount)
    gsap.fromTo(newCards, 
      { opacity: 0, y: 30, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
    )
    loadingMore.value = false
  })
}

const setupInfiniteScroll = () => {
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !loading.value && !loadingMore.value) {
      appendQuotes()
    }
  }, { threshold: 0.1, rootMargin: '200px' })

  if (observerTarget.value) {
    observer.observe(observerTarget.value)
  }
}

const getFontSize = (quote: string) => {
  const len = quote.length
  if (len > 120) return 'text-xl md:text-2xl'
  if (len > 80) return 'text-2xl md:text-3xl'
  return 'text-3xl md:text-4xl'
}

onMounted(() => {
  fetchQuotes()
  setupInfiniteScroll()
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<template>
  <div class="min-h-screen w-full bg-[#FDFDFB] text-[#121212] font-sans flex flex-col selection:bg-[#121212] selection:text-[#FDFDFB]">
    <!-- Header: Floating Glass Island (Dribbble Inspired) -->
    <header class="fixed top-6 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none">
      <div class="pointer-events-auto bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-full px-6 md:px-8 py-3 flex items-center gap-8 md:gap-12 transition-all duration-500 hover:shadow-[0_8px_48_rgba(0,0,0,0.08)] hover:bg-white/80">
        <!-- Logo Section -->
        <div class="flex items-center group cursor-pointer">
          <img src="@/assets/logo.svg" alt="Qutera Logo" class="w-7 h-7 transition-transform duration-700 group-hover:rotate-[360deg]" />
        </div>
        
        <!-- Minimal Nav -->
        <nav class="hidden md:flex items-center gap-8 border-l border-stone-200/50 pl-8">
          <a href="#" class="text-[9px] font-bold uppercase text-stone-400 hover:text-stone-900 transition-colors tracking-widest">Archive</a>
          <a href="#" class="text-[9px] font-bold uppercase text-stone-400 hover:text-stone-900 transition-colors tracking-widest">Manifesto</a>
        </nav>

        <!-- Live Status -->
        <div class="flex items-center gap-3 md:border-l md:border-stone-200/50 md:pl-8">
          <div class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span class="text-[9px] font-bold uppercase text-stone-500 tracking-widest">Live</span>
        </div>
      </div>
    </header>

    <!-- Infinite Tile List -->
    <main class="flex-grow w-full">
      <div class="max-w-6xl mx-auto px-6 pt-32 pb-12 md:pb-24 w-full">
        <div v-if="loading" class="h-[60vh] flex items-center justify-center">
          <div class="w-6 h-6 border-2 border-stone-200 border-t-stone-900 rounded-full animate-spin"></div>
        </div>

        <div 
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20 md:gap-y-32"
        >
          <article 
            v-for="(item, index) in displayedQuotes" 
            :key="`${item.id}-${index}`"
            class="quote-tile flex flex-col group"
          >
            <!-- Index Decorator -->
            <div class="flex items-center gap-3 mb-8">
              <span class="text-[10px] font-bold text-stone-300 font-sans tabular-nums tracking-tighter">
                {{ String(index + 1).padStart(3, '0') }}
              </span>
              <div class="h-[1px] flex-grow bg-stone-100"></div>
            </div>

            <!-- Content -->
            <div class="flex-grow">
              <blockquote 
                class="font-serif leading-[1.35] text-stone-800 transition-colors duration-700 group-hover:text-black" 
                :class="getFontSize(item.quote)"
              >
                "{{ item.quote }}"
              </blockquote>
            </div>
            
            <!-- Metadata -->
            <div class="mt-10 flex items-center justify-between">
              <cite class="text-[11px] font-bold uppercase not-italic text-stone-400 group-hover:text-stone-900 transition-colors duration-500 tracking-wider">
                — {{ item.author }}
              </cite>
              <button class="opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-stone-300 hover:text-stone-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
          </article>
        </div>

        <!-- Intersection Observer Target -->
        <div ref="observerTarget" class="w-full py-20 flex justify-center">
          <div v-if="loadingMore" class="flex gap-1.5">
            <div class="w-1.5 h-1.5 rounded-full bg-stone-300 animate-bounce" style="animation-delay: 0ms"></div>
            <div class="w-1.5 h-1.5 rounded-full bg-stone-300 animate-bounce" style="animation-delay: 150ms"></div>
            <div class="w-1.5 h-1.5 rounded-full bg-stone-300 animate-bounce" style="animation-delay: 300ms"></div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@1,6..72,400;1,6..72,500;1,6..72,600&display=swap');

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #FDFDFB;
  -webkit-font-smoothing: antialiased;
}

.font-serif {
  font-family: 'Newsreader', serif;
}

.quote-tile {
  will-change: transform, opacity;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #FDFDFB;
}
::-webkit-scrollbar-thumb {
  background: #E5E5E0;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #D4D4D0;
}
</style>
