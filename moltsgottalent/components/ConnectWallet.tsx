"use client";

import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function ConnectWallet() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="glass px-5 py-2.5 rounded-full font-mono text-sm font-medium backdrop-blur-2xl">
          <span className="text-white/60">●</span> {address.slice(0, 6)}...{address.slice(-4)}
        </div>
        <button
          onClick={() => disconnect()}
          className="glass px-5 py-2.5 rounded-full font-medium transition-all hover:bg-red-500/20 hover:border-red-500/30 text-sm"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      {connectors.slice(0, 1).map((connector) => (
        <button
          key={connector.id}
          onClick={() => connect({ connector })}
          className="glass-strong px-6 py-2.5 rounded-full font-semibold transition-all hover:scale-105 hover:bg-white/20 text-sm backdrop-blur-2xl"
        >
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Connect Wallet
          </span>
        </button>
      ))}
    </div>
  )
}
