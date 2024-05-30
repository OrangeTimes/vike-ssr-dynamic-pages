import type { Config } from 'vike/types'

// https://vike.dev/config
export default {
  // https://vike.dev/clientRouting
  clientRouting: true,
  // https://vike.dev/meta
  meta: {
    // Define new setting 'title'
    title: {
      env: { server: false, client: true }
    },
    // Define new setting 'description'
    description: {
      env: { server: true }
    },
    Page: {
      env: { server: true, client: true } 
  },
},
  hydrationCanBeAborted: true
} satisfies Config


