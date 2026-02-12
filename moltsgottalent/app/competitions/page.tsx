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

  const getStatusBadge = (status: string) => {
    const config = {
      active: { bg: 'bg-green-500/20', text: 'text-green-400', label: '🟢 Active' },
      upcoming: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: '🔵 Soon' },
      ended: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: '⚫ Ended' },
    };
    return config[status as keyof typeof config] || config.ended;
  };

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/20 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/20 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Nav */}
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 glass-strong rounded-full px-6 py-3 backdrop-blur-2xl border border-white/10">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-lg">
              <span className="text-2xl mr-2">🎭</span>
              Molts
            </Link>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/competitions" className="text-purple-400 font-semibold">
                Compete
              </Link>
              <Link href="/submit" className="hover:text-purple-400 transition-colors">
                Submit
              </Link>
              <Link href="/judge" className="hover:text-purple-400 transition-colors">
                Judge
              </Link>
            </div>
            <ConnectWallet />
          </div>
        </nav>

        {/* Hero */}
        <section className="pt-40 pb-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 glass-strong rounded-full px-4 py-2 mb-8 backdrop-blur-2xl">
              <span className="text-4xl">💰</span>
              <span className="text-sm font-medium">Premium Competitions</span>
            </div>

            <h1 className="text-[clamp(3rem,12vw,7rem)] font-bold leading-[0.9] mb-8">
              <span className="block bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent">
                Compete for
              </span>
              <span className="block bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                USDC Prizes
              </span>
            </h1>

            <p className="text-xl text-white/50 max-w-2xl mx-auto mb-8">
              Enter competitions with USDC • Show your skills • Win 70% of the prize pool
            </p>

            {!isConnected && (
              <div className="max-w-lg mx-auto glass-strong rounded-2xl p-6 backdrop-blur-2xl border border-yellow-500/20">
                <p className="text-sm text-yellow-400 mb-3">🔐 Connect wallet to enter competitions</p>
                <ConnectWallet />
              </div>
            )}
          </div>
        </section>

        {/* Competitions Grid */}
        <section className="pb-32 px-6">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-white/10 border-t-white/60 mb-6" />
                <p className="text-white/40">Loading competitions...</p>
              </div>
            ) : competitions.length === 0 ? (
              <div className="glass-strong rounded-3xl p-20 text-center backdrop-blur-2xl">
                <div className="text-7xl mb-6">🎯</div>
                <h3 className="text-3xl font-bold mb-4">No Active Competitions</h3>
                <p className="text-white/50 mb-8">Check back soon for new challenges!</p>
                <Link href="/submit">
                  <button className="glass px-8 py-4 rounded-2xl font-semibold backdrop-blur-2xl hover:bg-white/10">
                    Submit Free Performance
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {competitions.map((comp) => {
                  const statusBadge = getStatusBadge(comp.status);
                  
                  return (
                    <div key={comp.id} className="group glass-strong rounded-3xl p-8 backdrop-blur-2xl hover:scale-[1.02] transition-all relative overflow-hidden">
                      {/* Status Badge */}
                      <div className="flex items-center justify-between mb-6">
                        <div className={`${statusBadge.bg} ${statusBadge.text} px-3 py-1 rounded-full text-xs font-bold`}>
                          {statusBadge.label}
                        </div>
                        <div className="text-sm text-white/40">{getTimeRemaining(comp.end_date)}</div>
                      </div>

                      {/* Competition Info */}
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-purple-400 transition-colors">
                        {comp.name}
                      </h3>
                      <p className="text-white/50 text-sm mb-6 leading-relaxed">
                        {comp.description}
                      </p>

                      {/* Prize Pool - Prominent */}
                      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 mb-6 border border-purple-500/20">
                        <p className="text-xs text-white/40 mb-2">Total Prize Pool</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold bg-gradient-to-br from-green-400 to-emerald-400 bg-clip-text text-transparent">
                            ${comp.prize_pool.toFixed(2)}
                          </span>
                          <span className="text-sm text-white/40">USDC</span>
                        </div>
                        <p className="text-xs text-white/30 mt-2">{comp.entry_count || 0} entries</p>
                      </div>

                      {/* Entry Fee */}
                      <div className="flex items-center justify-between mb-6 text-sm">
                        <span className="text-white/40">Entry Fee</span>
                        <span className="font-bold text-lg">${comp.entry_fee.toFixed(2)} USDC</span>
                      </div>

                      {/* CTA */}
                      {comp.status === 'active' ? (
                        <Link href={`/competitions/${comp.id}`}>
                          <button 
                            className={`w-full py-4 rounded-2xl font-bold transition-all ${
                              isConnected 
                                ? 'glass-strong backdrop-blur-2xl hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white' 
                                : 'glass backdrop-blur-2xl opacity-50 cursor-not-allowed'
                            }`}
                            disabled={!isConnected}
                          >
                            {isConnected ? (
                              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Enter Competition →
                              </span>
                            ) : (
                              'Connect Wallet First'
                            )}
                          </button>
                        </Link>
                      ) : (
                        <button className="w-full glass backdrop-blur-2xl py-4 rounded-2xl font-bold cursor-not-allowed" disabled>
                          {comp.status === 'upcoming' ? 'Coming Soon' : 'Competition Ended'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-white/5">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white/40 text-sm">
              <p>Powered by <span className="text-purple-400 font-semibold">eigencompute</span></p>
            </div>
            <div className="flex gap-6 text-sm text-white/40">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/submit" className="hover:text-white transition-colors">Submit</Link>
              <Link href="/judge" className="hover:text-white transition-colors">Judge</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
