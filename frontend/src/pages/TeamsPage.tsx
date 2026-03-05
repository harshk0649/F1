import React, { useState } from 'react';
import { Navbar, Sidebar } from '../components/Layout';
import { motion } from 'framer-motion';
import { Info, Cpu, MapPin, User, FastForward } from 'lucide-react';

const TEAMS = [
  { 
    id: "redbull", 
    name: "Oracle Red Bull Racing", 
    color: "#0600EF", 
    drivers: ["Max Verstappen", "Liam Lawson"],
    image: "/assets/teams/redbull_car.png",
    facts: { powerUnit: "Red Bull Ford", base: "Milton Keynes, UK", principal: "Christian Horner", championships: "7" }
  },
  { 
    id: "ferrari", 
    name: "Scuderia Ferrari", 
    color: "#EF1A2D", 
    drivers: ["Lewis Hamilton", "Charles Leclerc"],
    image: "/assets/teams/ferrari_car.png",
    facts: { powerUnit: "Ferrari", base: "Maranello, Italy", principal: "Frédéric Vasseur", championships: "16" }
  },
  { 
    id: "mclaren", 
    name: "McLaren Formula 1", 
    color: "#FF8700", 
    drivers: ["Lando Norris", "Oscar Piastri"],
    image: "/assets/teams/mclaren_car.png",
    facts: { powerUnit: "Mercedes", base: "Woking, UK", principal: "Andrea Stella", championships: "8" }
  },
  { 
    id: "mercedes", 
    name: "Mercedes-AMG Petronas", 
    color: "#27F4D2", 
    drivers: ["George Russell", "Kimi Antonelli"],
    image: "/assets/teams/mercedes_car.png",
    facts: { powerUnit: "Mercedes", base: "Brackley, UK", principal: "Toto Wolff", championships: "8" }
  },
  { 
    id: "aston", 
    name: "Aston Martin Aramco", 
    color: "#229971", 
    drivers: ["Fernando Alonso", "Lance Stroll"],
    image: "/assets/teams/aston_car.png",
    facts: { powerUnit: "Mercedes", base: "Silverstone, UK", principal: "Mike Krack", championships: "0" }
  },
  { 
    id: "audi", 
    name: "Audi F1 Team", 
    color: "#F50537", 
    drivers: ["Nico Hulkenberg", "Gabriel Bortoleto"],
    image: "/assets/teams/audi_car.png",
    facts: { powerUnit: "Audi", base: "Neuburg, Germany", principal: "Mattia Binotto", championships: "0" }
  },
  { 
    id: "cadillac", 
    name: "Cadillac F1 Team", 
    color: "#FFFFFF", 
    drivers: ["Alex Palou", "Colton Herta"],
    image: "/assets/teams/cadillac_car.png",
    facts: { powerUnit: "Cadillac", base: "Charlotte, USA", principal: "Michael Andretti", championships: "0" }
  },
  { 
    id: "williams", 
    name: "Williams Racing", 
    color: "#64C4FF", 
    drivers: ["Alex Albon", "Carlos Sainz"],
    image: "/assets/teams/williams_car.png",
    facts: { powerUnit: "Mercedes", base: "Grove, UK", principal: "James Vowles", championships: "9" }
  },
  { 
    id: "alpine", 
    name: "Alpine F1 Team", 
    color: "#0093CC", 
    drivers: ["Pierre Gasly", "Jack Doohan"],
    image: "/assets/teams/alpine_car.png",
    facts: { powerUnit: "Mercedes", base: "Enstone, UK", principal: "Oliver Oakes", championships: "2" }
  },
  { 
    id: "vcarb", 
    name: "Visa Cash App RB", 
    color: "#6692FF", 
    drivers: ["Yuki Tsunoda", "Isack Hadjar"],
    image: "/assets/teams/vcarb_car.png",
    facts: { powerUnit: "Red Bull Ford", base: "Faenza, Italy", principal: "Laurent Mekies", championships: "0" }
  },
  { 
    id: "haas", 
    name: "MoneyGram Haas F1", 
    color: "#B6BABD", 
    drivers: ["Esteban Ocon", "Oliver Bearman"],
    image: "/assets/teams/haas_car.png",
    facts: { powerUnit: "Ferrari", base: "Kannapolis, USA", principal: "Ayao Komatsu", championships: "0" }
  }

];


const TeamCard = ({ team }: { team: typeof TEAMS[0] }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative h-[400px] w-full perspective-1000 cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 25 }}
        className="relative w-full h-full transform-style-3d shadow-2xl"
      >
        {/* FRONT SIDE */}
        <div 
          className="absolute inset-0 backface-hidden bg-neutral-900 border border-white/5 p-6 flex flex-col justify-between overflow-hidden z-20"
          style={{ visibility: isFlipped ? 'hidden' : 'visible' }}
        >
          <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: team.color }} />
          
          <div className="z-10">
            <h2 className="text-xl font-black italic uppercase tracking-tighter leading-none mb-2">{team.name}</h2>
            <div className="flex gap-2">
              {team.drivers.map(d => (
                <span key={d} className="text-[8px] font-black uppercase text-neutral-500 tracking-widest">{d}</span>
              ))}
            </div>
          </div>

          <div className="relative flex-1 flex items-center justify-center py-2">
             <img 
                src={team.image} 
                alt={team.name}
                className="w-[90%] h-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)]"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/f1-stats/f1-icons/main/cars/f1-car-generic.png';
                }}
             />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] font-black italic opacity-[0.02] pointer-events-none select-none">
                {team.id.toUpperCase()}
             </div>
          </div>

          <div className="flex justify-between items-center z-10">
             <div className="flex items-center gap-2">
                <Info size={12} className="text-red-600" />
                <span className="text-[9px] font-black uppercase text-neutral-400">Scan for Data</span>
             </div>
             <div className="px-3 py-1.5 border border-white/10 text-[8px] font-black uppercase tracking-widest">
                Constructors 2026
             </div>
          </div>
        </div>

        {/* BACK SIDE (FACTS) */}
        <div 
          className="absolute inset-0 backface-hidden bg-neutral-950 border border-red-600/20 p-8 rotateY-180 flex flex-col gap-6 z-10"
          style={{ visibility: isFlipped ? 'visible' : 'hidden' }}
        >
           <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-red-600" />
              <h3 className="text-lg font-black italic uppercase tracking-tighter text-white">Grid Intel</h3>
           </div>

           <div className="space-y-4 flex-1">
              {[
                { icon: <Cpu size={16} />, label: "Power Unit", value: team.facts.powerUnit },
                { icon: <MapPin size={16} />, label: "Base", value: team.facts.base },
                { icon: <User size={16} />, label: "Principal", value: team.facts.principal },
                { icon: <FastForward size={16} />, label: "World Titles", value: team.facts.championships }
              ].map((fact, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="text-neutral-600">{fact.icon}</div>
                  <div>
                    <span className="block text-[7px] font-black uppercase text-neutral-500 tracking-widest">{fact.label}</span>
                    <span className="text-xs font-bold uppercase text-white">{fact.value}</span>
                  </div>
                </div>
              ))}
           </div>

           <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[9px] text-red-600 font-black italic uppercase">SECURE_LINK_CONNECTED</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function TeamsPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 md:p-12 lg:p-24 pt-32">
      <Navbar />
      <Sidebar />

      <div className="max-w-7xl mx-auto">
        <header className="mb-12 border-l-4 border-red-600 pl-6">
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter">THE <span className="text-red-600">GRID</span></h1>
          <p className="text-neutral-500 font-black uppercase tracking-[0.3em] text-[10px] mt-2">Uplinking constructor signatures // 11-TEAMS_CONNECTED</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {TEAMS.map((team, i) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <TeamCard team={team} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}


