import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float, View } from '@react-three/drei';
import { Navbar, Sidebar } from '../components/Layout';
import { motion } from 'framer-motion';

const DRIVERS = [
  { id: 1, name: "Max Verstappen", team: "Oracle Red Bull Racing", number: "1", nationality: "Dutch", helmetColor: "#0600EF" },
  { id: 2, name: "Liam Lawson", team: "Oracle Red Bull Racing", number: "30", nationality: "New Zealander", helmetColor: "#0600EF" },
  { id: 3, name: "Lewis Hamilton", team: "Scuderia Ferrari", number: "44", nationality: "British", helmetColor: "#EF1A2D" },
  { id: 4, name: "Charles Leclerc", team: "Scuderia Ferrari", number: "16", nationality: "Monegasque", helmetColor: "#EF1A2D" },
  { id: 5, name: "George Russell", team: "Mercedes-AMG Petronas", number: "63", nationality: "British", helmetColor: "#27F4D2" },
  { id: 6, name: "Kimi Antonelli", team: "Mercedes-AMG Petronas", number: "12", nationality: "Italian", helmetColor: "#27F4D2" },
  { id: 7, name: "Lando Norris", team: "McLaren Formula 1", number: "4", nationality: "British", helmetColor: "#FF8700" },
  { id: 8, name: "Oscar Piastri", team: "McLaren Formula 1", number: "81", nationality: "Australian", helmetColor: "#FF8700" },
  { id: 9, name: "Fernando Alonso", team: "Aston Martin Aramco", number: "14", nationality: "Spanish", helmetColor: "#229971" },
  { id: 10, name: "Lance Stroll", team: "Aston Martin Aramco", number: "18", nationality: "Canadian", helmetColor: "#229971" },
  { id: 11, name: "Nico Hulkenberg", team: "Audi F1 Team", number: "27", nationality: "German", helmetColor: "#F50537" },
  { id: 12, name: "Gabriel Bortoleto", team: "Audi F1 Team", number: "33", nationality: "Brazilian", helmetColor: "#F50537" },
  { id: 13, name: "Valteri Bottas", team: "Cadillac F1 Team", number: "26", nationality: "American", helmetColor: "#FFFFFF" },
  { id: 14, name: "Serzio Perez", team: "Cadillac F1 Team", number: "10", nationality: "Spanish", helmetColor: "#FFFFFF" },
  { id: 15, name: "Pierre Gasly", team: "Alpine F1 Team", number: "10", nationality: "French", helmetColor: "#0093CC" },
  { id: 16, name: "Jack Doohan", team: "Alpine F1 Team", number: "61", nationality: "Australian", helmetColor: "#0093CC" },
  { id: 17, name: "Alex Albon", team: "Williams Racing", number: "23", nationality: "Thai", helmetColor: "#64C4FF" },
  { id: 18, name: "Carlos Sainz", team: "Williams Racing", number: "55", nationality: "Spanish", helmetColor: "#64C4FF" },
  { id: 19, name: "Yuki Tsunoda", team: "Visa Cash App RB", number: "22", nationality: "Japanese", helmetColor: "#6692FF" },
  { id: 20, name: "Isack Hadjar", team: "Visa Cash App RB", number: "6", nationality: "French", helmetColor: "#6692FF" },
  { id: 21, name: "Esteban Ocon", team: "MoneyGram Haas F1", number: "31", nationality: "French", helmetColor: "#8B8D8E" },
  { id: 22, name: "Oliver Bearman", team: "MoneyGram Haas F1", number: "87", nationality: "British", helmetColor: "#8B8D8E" },
];

function HelmetModel({ color }: { color: string }) {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh castShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
        <mesh position={[0.7, 0.2, 0]}>
            <boxGeometry args={[0.8, 0.4, 1.2]} />
            <meshStandardMaterial color="#000" metalness={1} roughness={0.1} />
        </mesh>
      </mesh>
    </Float>
  );
}

const HelmetScene = ({ color }: { color: string }) => (
  <>
    <ambientLight intensity={0.5} />
    <pointLight position={[10, 10, 10]} intensity={1} />
    <Suspense fallback={null}>
      <HelmetModel color={color} />
      <Environment preset="night" />
      <ContactShadows position={[0, -1.2, 0]} opacity={0.4} scale={5} blur={2} far={4} />
    </Suspense>
    <OrbitControls enableZoom={false} />
  </>
);

export default function DriversPage() {
  const container = useRef<HTMLDivElement>(null!);

  return (
    <div ref={container} className="min-h-screen bg-neutral-950 text-white p-8 md:p-24 pt-32 relative">
      <Navbar />
      <Sidebar />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-16 border-l-4 border-red-600 pl-6">
          <h1 className="text-6xl font-black italic uppercase tracking-tighter text-white">Grid Drivers</h1>
          <p className="text-neutral-500 font-bold uppercase tracking-widest text-sm mt-4">2026 World Championship Contenders</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DRIVERS.map((driver, i) => {
            const trackRef = useRef<HTMLDivElement>(null!);
            return (
              <motion.div 
                key={driver.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-neutral-900/30 border border-neutral-800/50 hover:border-red-600/50 transition-all p-6 relative group overflow-hidden"
              >
                <div className="absolute top-4 right-4 text-6xl font-black italic text-neutral-800 group-hover:text-red-900/20 transition-colors pointer-events-none">
                  #{driver.number}
                </div>
                
                <div className="relative z-10">
                  <h2 className="text-2xl font-black uppercase italic leading-none">{driver.name.split(' ')[0]}<br/>{driver.name.split(' ')[1]}</h2>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600 mt-2">{driver.team}</p>
                </div>

                <div ref={trackRef} className="h-48 mt-4" />
                <View track={trackRef}>
                    <HelmetScene color={driver.helmetColor} />
                </View>

                <div className="mt-6 flex justify-between items-center bg-black/40 p-4 border border-neutral-800">
                   <div className="text-center flex-1">
                      <span className="block text-neutral-500 text-[8px] font-black uppercase">Points</span>
                      <span className="text-xl font-black italic text-white">0</span>
                   </div>
                   <div className="w-[1px] h-8 bg-neutral-800" />
                   <div className="text-center flex-1">
                      <span className="block text-neutral-500 text-[8px] font-black uppercase">Podiums</span>
                      <span className="text-xl font-black italic text-white">0</span>
                   </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Canvas eventSource={container} className="pointer-events-none fixed inset-0 z-0">
      </Canvas>
    </div>
  );
}
