'use client';

import { useState } from 'react';
import { LeaderboardEntry } from '@/lib/services/leaderboard-service';
import { formatDate } from '@/lib/utils';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  isLoading?: boolean;
  showGameTitle?: boolean;
}

export default function LeaderboardTable({ entries, isLoading = false, showGameTitle = true }: LeaderboardTableProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  if (isLoading) {
    return <LeaderboardSkeleton />;
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Henüz skor kaydı bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-secondary text-white">
            <th className="px-4 py-2 text-left">Sıra</th>
            <th className="px-4 py-2 text-left">Kullanıcı</th>
            {showGameTitle && <th className="px-4 py-2 text-left">Oyun</th>}
            <th className="px-4 py-2 text-right">Skor</th>
            <th className="px-4 py-2 text-right">Tarih</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr 
              key={entry.id}
              className={`border-b border-gray-200 ${
                hoveredRow === entry.id ? 'bg-gray-100' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              }`}
              onMouseEnter={() => setHoveredRow(entry.id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <td className="px-4 py-3">
                {index === 0 ? (
                  <span className="inline-block bg-yellow-500 text-white w-6 h-6 rounded-full text-center">1</span>
                ) : index === 1 ? (
                  <span className="inline-block bg-gray-400 text-white w-6 h-6 rounded-full text-center">2</span>
                ) : index === 2 ? (
                  <span className="inline-block bg-amber-700 text-white w-6 h-6 rounded-full text-center">3</span>
                ) : (
                  <span className="inline-block text-gray-500 w-6 h-6 text-center">{index + 1}</span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center">
                  {entry.avatar_url ? (
                    <img 
                      src={entry.avatar_url} 
                      alt={entry.username} 
                      className="w-8 h-8 rounded-full mr-2 object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 mr-2 flex items-center justify-center">
                      <span className="text-gray-600 text-sm">{entry.username.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                  <span>{entry.username}</span>
                </div>
              </td>
              {showGameTitle && <td className="px-4 py-3">{entry.game_title}</td>}
              <td className="px-4 py-3 text-right font-semibold">{entry.score.toLocaleString()}</td>
              <td className="px-4 py-3 text-right text-gray-500">{formatDate(entry.played_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-secondary text-white">
            <th className="px-4 py-2 text-left">Sıra</th>
            <th className="px-4 py-2 text-left">Kullanıcı</th>
            <th className="px-4 py-2 text-left">Oyun</th>
            <th className="px-4 py-2 text-right">Skor</th>
            <th className="px-4 py-2 text-right">Tarih</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, index) => (
            <tr key={index} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
              <td className="px-4 py-3">
                <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 animate-pulse"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse ml-auto"></div>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse ml-auto"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 