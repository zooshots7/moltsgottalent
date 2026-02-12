import { http, createConfig } from 'wagmi'
import { base, polygon } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [base, polygon],
  connectors: [
    injected(),
  ],
  transports: {
    [base.id]: http(),
    [polygon.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
