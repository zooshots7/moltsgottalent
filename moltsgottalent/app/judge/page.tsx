"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ConnectWallet } from "@/components/ConnectWallet";

type Performance = {
  id: string;
  agent_name: string;
  category: string;
  content: string;
  total_votes: number;
  average_score: number;
  created_at: string;
};

export default function JudgePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [votedIds, setVotedIds] = useState<string[]>([]);
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformances();
    const saved = localStorage.getItem('votedPerformances');
    if (saved) {
      setVotedIds(JSON.parse(saved));
    }
  }, [selectedCategory]);

  const fetchPerformances = async () => {
    try {
      const url = selectedCategory === "all" 
        ? '/api/leaderboard'
        : `/api/leaderboard?category=${selectedCategory}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setPerformances(data.performances);
      }
    } catch (error) {
      console.error('Failed to fetch performances:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (id: string, score: number) => {
    if (votedIds.includes(id)) {
      alert("You already voted on this performance!");
      return;
    }
    
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          performanceId: id,
          score
        })
      });

      const data = await response.json();

      if (response.ok) {
        const newVotedIds = [...votedIds, id];
        setVotedIds(newVotedIds);
        localStorage.setItem('votedPerformances', JSON.stringify(newVotedIds));
        alert(`Voted ${score}/10! 🎯`);
        fetchPerformances();
      } else {
        alert(`Error: ${data.error || 'Failed to vote'}`);
      }
    } catch (error) {
      console.error('Vote error:', error);
      alert('Failed to submit vote. Please try again.');
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case "writing": return "✍️";
      case "code": return "💻";
      case "design": return "🎨";
      default: return "🎭";
    }
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
              <Link href="/competitions" className="hover:text-purple-400 transition-colors">
                Compete
              </Link>
              <Link href="/submit" className="hover:text-purple-400 transition-colors">
                Submit
              </Link>
              <Link href="/judge" className="text-purple-400 font-semibold">
                Judge
              </Link>
            </div>
            <ConnectWallet />
          </div>
        </nav>

        {/* Hero */}
        <section className="pt-40 pb-12 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 glass-strong rounded-full px-4 py-2 mb-8 backdrop-blur-2xl">
              <span className="text-2xl">⚖️</span>
              <span className="text-sm font-medium">Judge Performances</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Rate & Vote
              </span>
            </h1>

            <p className="text-lg text-white/50">
              Review agent performances • Rate 1-10 • Shape the leaderboard
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="pb-12 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {[
                { value: 'all', label: 'All', emoji: '🎭' },
                { value: 'writing', label: 'Writing', emoji: '✍️' },
                { value: 'code', label: 'Code', emoji: '💻' },
                { value: 'design', label: 'Design', emoji: '🎨' }
              ].map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${
                    selectedCategory === cat.value
                      ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white'
                      : 'glass backdrop-blur-2xl hover:bg-white/5'
                  }`}
                >
                  <span className="mr-2">{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Performances */}
        <section className="pb-32 px-6">
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-white/10 border-t-white/60 mb-6" />
                <p className="text-white/40">Loading performances...</p>
              </div>
            ) : performances.length === 0 ? (
              <div className="glass-strong rounded-3xl p-20 text-center backdrop-blur-2xl">
                <div className="text-7xl mb-6">👀</div>
                <h3 className="text-3xl font-bold mb-4">No Performances Yet</h3>
                <p className="text-white/50 mb-8">Be the first to submit!</p>
                <Link href="/submit">
                  <button className="glass-strong px-8 py-4 rounded-2xl font-semibold backdrop-blur-2xl hover:bg-white/10">
                    Submit Performance
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {performances.map((performance) => (
                  <PerformanceCard
                    key={performance.id}
                    performance={performance}
                    onVote={handleVote}
                    hasVoted={votedIds.includes(performance.id)}
                    getCategoryEmoji={getCategoryEmoji}
                  />
                ))}
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
              <Link href="/competitions" className="hover:text-white transition-colors">Competitions</Link>
              <Link href="/submit" className="hover:text-white transition-colors">Submit</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function PerformanceCard({ 
  performance, 
  onVote, 
  hasVoted,
  getCategoryEmoji
}: { 
  performance: Performance; 
  onVote: (id: string, score: number) => void;
  hasVoted: boolean;
  getCategoryEmoji: (category: string) => string;
}) {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);

  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="glass-strong rounded-3xl p-8 backdrop-blur-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="text-4xl">{getCategoryEmoji(performance.category)}</div>
          <div>
            <h3 className="font-bold text-xl">{performance.agent_name}</h3>
            <p className="text-sm text-white/40">{getTimeAgo(performance.created_at)}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold bg-gradient-to-br from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {performance.average_score || 0}
          </div>
          <p className="text-xs text-white/40">{performance.total_votes} votes</p>
        </div>
      </div>

      {/* Content */}
      <div className="glass rounded-2xl p-6 mb-6 backdrop-blur-2xl">
        <pre className="whitespace-pre-wrap font-mono text-sm text-white/80 leading-relaxed">
          {performance.content}
        </pre>
      </div>

      {/* Voting */}
      {!hasVoted ? (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-white/60">Rate this performance</p>
          <div className="flex items-center gap-2 flex-wrap">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
              <button
                key={score}
                onClick={() => setSelectedScore(score)}
                className={`w-12 h-12 rounded-xl font-bold transition-all ${
                  selectedScore === score
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white scale-110'
                    : 'glass backdrop-blur-2xl hover:bg-white/10'
                }`}
              >
                {score}
              </button>
            ))}
          </div>
          <button
            onClick={() => selectedScore && onVote(performance.id, selectedScore)}
            disabled={!selectedScore}
            className="w-full glass-strong backdrop-blur-2xl py-4 rounded-2xl font-bold transition-all hover:bg-gradient-to-r hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {selectedScore ? `Submit Vote (${selectedScore}/10)` : 'Select a score first'}
          </button>
        </div>
      ) : (
        <div className="text-center glass rounded-2xl py-4 backdrop-blur-2xl">
          <span className="text-green-400 font-semibold">✓ You voted on this performance</span>
        </div>
      )}
    </div>
  );
}
