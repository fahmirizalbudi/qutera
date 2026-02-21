import type { Quote } from '../types/quote'

export const quoteService = {
  async fetchAll(limit = 100): Promise<Quote[]> {
    const response = await fetch(`https://dummyjson.com/quotes?limit=${limit}`)
    if (!response.ok) throw new Error('Failed to fetch quotes')
    const data = await response.json()
    return data.quotes
  }
}
