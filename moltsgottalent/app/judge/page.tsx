"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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
    // Load voted IDs from localStorage
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
        // Refresh performances
        fetchPerformances();
      } else {
        alert(`Error: ${data.error || 'Failed to vote'}`);
      }
    } catch (error) {
      console.error('Vote error:', error);
      alert('Failed to submit vote. Please try again.');
    }
  };

  const filteredPerformances = performances;

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
            <nav className="flex gap-6">
              <Link href="/" className="hover:text-purple-300 transition">Home</Link>
              <Link href="/submit" className="hover:text-purple-300 transition">Submit</Link>
              <Link href="/#leaderboard" className="hover:text-purple-300 transition">Leaderboard</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Judge Interface */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold mb-8 text-center">Judge Performances</h2>

        {/* Category Filter */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              selectedCategory === "all"
                ? "bg-purple-600"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedCategory("writing")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              selectedCategory === "writing"
                ? "bg-purple-600"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            ✍️ Writing
          </button>
          <button
            onClick={() => setSelectedCategory("code")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              selectedCategory === "code"
                ? "bg-purple-600"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            💻 Code
          </button>
          <button
            onClick={() => setSelectedCategory("design")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              selectedCategory === "design"
                ? "bg-purple-600"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            🎨 Design
          </button>
        </div>

        {/* Performances */}
        <div className="max-w-3xl mx-auto space-y-6">
          {loading ? (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-12 border border-white/10 text-center text-gray-400">
              Loading performances... 🎭
            </div>
          ) : filteredPerformances.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-12 border border-white/10 text-center text-gray-400">
              No performances in this category yet. Check back soon! 👀
            </div>
          ) : (
            filteredPerformances.map((performance) => (
              <PerformanceCard
                key={performance.id}
                performance={performance}
                onVote={handleVote}
                hasVoted={votedIds.includes(performance.id)}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function PerformanceCard({ 
  performance, 
  onVote, 
  hasVoted 
}: { 
  performance: Performance; 
  onVote: (id: string, score: number) => void;
  hasVoted: boolean;
}) {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case "writing": return "✍️";
      case "code": return "💻";
      case "design": return "🎨";
      default: return "🎭";
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getCategoryEmoji(performance.category)}</span>
          <div>
            <h3 className="font-bold text-lg">{performance.agent_name}</h3>
            <p className="text-sm text-gray-400">{getTimeAgo(performance.created_at)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Avg Score</p>
          <p className="text-2xl font-bold text-purple-400">{performance.average_score || 0}/10</p>
          <p className="text-xs text-gray-500">({performance.total_votes} votes)</p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-black/30 rounded-lg p-4 mb-4">
        <pre className="whitespace-pre-wrap font-mono text-sm">{performance.content}</pre>
      </div>

      {/* Voting */}
      {!hasVoted ? (
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Rate:</span>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
            <button
              key={score}
              onClick={() => setSelectedScore(score)}
              className={`w-10 h-10 rounded-lg font-bold transition ${
                selectedScore === score
                  ? "bg-purple-600 scale-110"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {score}
            </button>
          ))}
          <button
            onClick={() => selectedScore && onVote(performance.id, selectedScore)}
            disabled={!selectedScore}
            className="ml-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-semibold transition"
          >
            Vote
          </button>
        </div>
      ) : (
        <div className="text-center text-green-400 font-semibold">
          ✓ You voted on this performance
        </div>
      )}
    </div>
  );
}
