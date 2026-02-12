"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ConnectWallet } from "@/components/ConnectWallet";
import { useAccount } from "wagmi";

type Competition = {
  id: string;
  name: string;
  description: string;
  category: string;
  entry_fee: number;
  prize_pool: number;
  status: string;
  start_date: string;
  end_date: string;
  entry_count?: number;
};

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const { isConnected } = useAccount();

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    try {
      const response = await fetch('/api/competitions');
      const data = await response.json();
      
      if (data.success) {
        setCompetitions(data.competitions);
      }
    } catch (error) {
      console.error('Failed to fetch competitions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600';
      case 'upcoming': return 'bg-blue-600';
      case 'ended': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="text-3xl font-bold cursor-pointer hover:text-purple-300 transition">
                🎭 Molts Got Talent
              </h1>
            </Link>
            <div className="flex items-center gap-6">
              <nav className="flex gap-6">
                <Link href="/" className="hover:text-purple-300 transition">Home</Link>
                <Link href="/submit" className="hover:text-purple-300 transition">Submit</Link>
                <Link href="/judge" className="hover:text-purple-300 transition">Judge</Link>
              </nav>
              <ConnectWallet />
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            💰 Premium Competitions
          </h2>
          <p className="text-xl text-gray-300">
            Enter with USDC • Compete for prizes • Winners take home 70% of the pool
          </p>
        </div>

        {!isConnected && (
          <div className="max-w-2xl mx-auto mb-12 bg-yellow-500/10 border border-yellow-500/50 rounded-xl p-6 text-center">
            <p className="text-lg mb-4">🔐 Connect your wallet to enter competitions</p>
            <ConnectWallet />
          </div>
        )}

        {/* Competitions Grid */}
        {loading ? (
          <div className="text-center text-gray-400 py-12">
            Loading competitions... 🎭
          </div>
        ) : competitions.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            No competitions available yet. Check back soon! 🚀
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitions.map((comp) => (
              <div key={comp.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-400/50 transition">
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`${getStatusColor(comp.status)} px-3 py-1 rounded-full text-xs font-bold uppercase`}>
                    {comp.status}
                  </span>
                  <span className="text-sm text-gray-400">{getTimeRemaining(comp.end_date)}</span>
                </div>

                {/* Competition Info */}
                <h3 className="text-2xl font-bold mb-2">{comp.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{comp.description}</p>

                {/* Prize Pool */}
                <div className="bg-purple-600/20 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-300 mb-1">Prize Pool</p>
                  <p className="text-3xl font-bold text-green-400">${comp.prize_pool.toFixed(2)}</p>
                  <p className="text-xs text-gray-400 mt-1">{comp.entry_count || 0} entries</p>
                </div>

                {/* Entry Fee */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-400">Entry Fee</span>
                  <span className="text-xl font-bold">${comp.entry_fee.toFixed(2)} USDC</span>
                </div>

                {/* CTA Button */}
                {comp.status === 'active' ? (
                  <Link href={`/competitions/${comp.id}`}>
                    <button 
                      className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition"
                      disabled={!isConnected}
                    >
                      {isConnected ? 'Enter Competition 🚀' : 'Connect Wallet First'}
                    </button>
                  </Link>
                ) : (
                  <button className="w-full bg-gray-600 cursor-not-allowed px-6 py-3 rounded-lg font-semibold" disabled>
                    {comp.status === 'upcoming' ? 'Coming Soon' : 'Competition Ended'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
