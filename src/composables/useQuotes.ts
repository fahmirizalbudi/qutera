import { ref, nextTick } from 'vue'
import type { Quote } from '../types/quote'
import { quoteService } from '../services/quoteService'
import gsap from 'gsap'

export function useQuotes() {
  const allQuotes = ref<Quote[]>([])
  const displayedQuotes = ref<Quote[]>([])
  const loading = ref(true)
  const loadingMore = ref(false)

  const loadAllQuotes = async () => {
    try {
      allQuotes.value = await quoteService.fetchAll()
      appendInitialQuotes()
      loading.value = false
    } catch (err) {
      console.error(err)
    }
  }

  const appendInitialQuotes = () => {
    displayedQuotes.value = allQuotes.value
      .sort(() => 0.5 - Math.random())
      .slice(0, 9)
  }

  const appendMoreQuotes = async (isSearch = false) => {
    if (loadingMore.value || isSearch) return
    loadingMore.value = true
    
    const currentCount = displayedQuotes.value.length
    const currentIds = new Set(displayedQuotes.value.map(q => q.id))
    const nextQuotes = allQuotes.value
      .filter(q => !currentIds.has(q.id))
      .sort(() => 0.5 - Math.random())
      .slice(0, 9)
    
    displayedQuotes.value.push(...nextQuotes)
    
    await nextTick()
    const newCards = gsap.utils.toArray<HTMLElement>('.quote-tile').slice(currentCount)
    gsap.fromTo(newCards, 
      { opacity: 0, y: 30, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
    )
    loadingMore.value = false
  }

  return {
    allQuotes,
    displayedQuotes,
    loading,
    loadingMore,
    loadAllQuotes,
    appendMoreQuotes
  }
}
