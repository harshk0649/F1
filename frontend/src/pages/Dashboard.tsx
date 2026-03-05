import React, { useEffect, useState } from 'react';
import { Navbar, Sidebar } from '../components/Layout';
import { motion } from 'framer-motion';
import { Trophy, Clock, Zap, MapPin } from 'lucide-react';
import axios from 'axios';

export default function Dashboard() {
  const [raceData, setRaceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We'll use Ergast API (or OpenF1) to get the latest race results for now
    // This is a public API that doesn't require a key for basic data
    const fetchRaceData = async () => {
      try {
        const response = await axios.get('https://ergast.com/api/f1/current/last/results.json');
        setRaceData(response.data.MRData.RaceTable.Races[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching race data:", error);
        setLoading(false);
      }
    };
    fetchRaceData();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8 md:p-24 pt-32">
      <Navbar />
      <Sidebar />
      
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 border-l-4 border-red-600 pl-6">
          <div className="flex items-center gap-2 text-red-500 font-bold uppercase tracking-widest text-sm mb-2">
            <Zap size={16} fill="currentColor" />
            Live Analytics
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">
            {loading ? "Syncing Data..." : raceData?.raceName}
          </h1>
          {!loading && (
            <div className="flex items-center gap-4 mt-4 text-neutral-400 font-bold uppercase tracking-widest text-xs">
              <span className="flex items-center gap-1"><MapPin size={12} /> {raceData?.Circuit.circuitName}</span>
              <span className="flex items-center gap-1"><Clock size={12} /> Round {raceData?.round}</span>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Standings */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-neutral-500 font-black uppercase tracking-[0.2em] text-xs mb-6 flex items-center gap-2">
              <Trophy size={14} /> Classifications
            </h2>
            {loading ? (
                [1,2,3,4,5].map(i => (
                    <div key={i} className="h-20 bg-neutral-900/50 animate-pulse border border-neutral-800" />
                ))
            ) : (
                raceData?.Results.map((result: any, idx: number) => (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={idx} 
                        className="group flex items-center bg-neutral-900/40 hover:bg-neutral-800/60 border border-neutral-800/50 transition-all p-4 relative overflow-hidden"
                    >
                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="text-2xl font-black italic w-12 text-neutral-700 group-hover:text-red-600 transition-colors uppercase">
                            {result.position}
                        </span>
                        <div className="flex-1">
                            <h3 className="font-black uppercase tracking-tight">{result.Driver.givenName} {result.Driver.familyName}</h3>
                            <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">{result.Constructor.name}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-mono text-neutral-400">{result.Time?.time || "Finished"}</span>
                            <div className="text-[10px] text-red-500 font-black tracking-widest uppercase mt-1">+{result.points} pts</div>
                        </div>
                    </motion.div>
                ))
            )}
          </div>

          {/* AI Insights Sidebar */}
          <div className="space-y-8">
             <div className="bg-neutral-900 border border-neutral-800 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-[100px] pointer-events-none" />
                <h3 className="text-white font-black uppercase text-sm mb-4">Neural Predictor</h3>
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Target Driver</label>
                        <select className="w-full bg-black border border-neutral-800 p-3 text-xs font-bold uppercase tracking-widest text-white focus:border-red-600 outline-none">
                            <option>Max Verstappen</option>
                            <option>Lewis Hamilton</option>
                            <option>Lando Norris</option>
                            <option>Charles Leclerc</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Qualifying Pos (P1-P20)</label>
                        <input type="number" min="1" max="20" defaultValue="1" className="w-full bg-black border border-neutral-800 p-3 text-xs font-bold uppercase tracking-widest text-white focus:border-red-600 outline-none" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Circuit</label>
                        <select className="w-full bg-black border border-neutral-800 p-3 text-xs font-bold uppercase tracking-widest text-white focus:border-red-600 outline-none">
                            <option>Silverstone</option>
                            <option>Monaco</option>
                            <option>Monza</option>
                            <option>Spa-Francorchamps</option>
                        </select>
                    </div>

                    <button className="w-full bg-red-600 py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">
                        Run Model Analysis
                    </button>

                    <div className="mt-8 pt-8 border-t border-neutral-800 space-y-4">
                        <p className="text-neutral-500 text-[10px] leading-relaxed uppercase tracking-wider font-bold">
                            Live Result Prediction:
                        </p>
                        <div className="p-4 bg-black/40 border-l-4 border-red-600">
                            <span className="text-[9px] text-neutral-500 uppercase font-black mb-1 block">Win Probability</span>
                            <div className="flex justify-between items-end">
                                <span className="text-sm font-black italic uppercase">Primary Driver</span>
                                <span className="text-red-500 font-black italic text-xl">84.2%</span>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
