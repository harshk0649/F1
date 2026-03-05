import React, { Suspense, useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, Stars, Float, Html } from '@react-three/drei';
import { Navbar, Sidebar } from '../components/Layout';
import { useLatestSession } from '../hooks/useLatestSession';
import { useF1Live, DriverLocation } from '../hooks/useF1Live';
import * as THREE from 'three';

// Coordinate scaling factor
const SCALE = 250; 

function RealtimeTrack({ sessionKey }: { sessionKey: number }) {
  const [points, setPoints] = useState<THREE.Vector3[]>([]);
  
  useEffect(() => {
    async function loadTrackShape() {
      try {
        // We try a few common driver numbers to find a valid track path
        const driversToTry = [1, 44, 4, 16, 63];
        let data: DriverLocation[] = [];
        
        for (const driverNum of driversToTry) {
          const resp = await fetch(`https://api.openf1.org/v1/location?session_key=${sessionKey}&driver_number=${driverNum}&n=1000`);
          const json = await resp.json();
          if (json && json.length > 10) {
            data = json;
            break;
          }
        }

        if (data.length === 0) return;
        
        // Find centers for normalization
        const xs = data.map(d => d.x);
        const ys = data.map(d => d.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        
        const centerX = (maxX + minX) / 2;
        const centerY = (maxY + minY) / 2;

        // Use a consistent scale based on track size
        const trackWidth = maxX - minX;
        const trackHeight = maxY - minY;
        const autoScale = Math.max(trackWidth, trackHeight) / 50; 

        const normalizedPoints = data.filter((_, i) => i % 5 === 0).map(d => 
          new THREE.Vector3((d.x - centerX) / autoScale, 0, (d.y - centerY) / autoScale)
        );
        
        setPoints(normalizedPoints);
      } catch (e) {
        console.error("Track loading failed", e);
      }
    }
    loadTrackShape();
  }, [sessionKey]);

  const curve = useMemo(() => {
    if (points.length < 2) return null;
    return new THREE.CatmullRomCurve3(points, true);
  }, [points]);

  if (!curve) return null;

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 100, 0.15, 8, true]} />
        <meshStandardMaterial color="#333" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <tubeGeometry args={[curve, 100, 0.04, 8, true]} />
        <meshStandardMaterial color="#ff1e1e" emissive="#ff1e1e" emissiveIntensity={3} />
      </mesh>
    </group>
  );
}

function LiveDriverMarker({ driver, location, color }: { driver: string, location: DriverLocation, color: string }) {
  // We'll use a reference to smoothly animate towards the new location
  const markerRef = useRef<THREE.Group>(null!);
  
  // Normalization logic should ideally be shared or passed in
  // For now we'll assume a standard center or offset
  // In a real app we'd fetch circuit metadata for precise offsets
  const x = location.x / SCALE;
  const z = location.y / SCALE;

  useFrame(() => {
    if (markerRef.current) {
        // Smoothly interpolate to new position
        markerRef.current.position.x = THREE.MathUtils.lerp(markerRef.current.position.x, x - 10, 0.1); 
        markerRef.current.position.z = THREE.MathUtils.lerp(markerRef.current.position.z, z - 10, 0.1);
    }
  });

  return (
    <group ref={markerRef}>
      <mesh castShadow>
        <boxGeometry args={[0.3, 0.2, 0.5]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
      <Html position={[0, 1.5, 0]} center>
        <div className="flex flex-col items-center select-none pointer-events-none">
          <div className="bg-black/95 border-b-2 text-white px-2 py-0.5" style={{ borderColor: color }}>
             <span className="text-[10px] font-black uppercase tracking-tighter">{driver}</span>
          </div>
        </div>
      </Html>
    </group>
  );
}

export default function TrackViewer() {
  const { session, loading: sessionLoading } = useLatestSession();
  const { locations, loading: liveLoading } = useF1Live(session?.session_key || null);

  return (
    <div className="relative w-full h-screen bg-neutral-950 overflow-hidden">
      <Navbar />
      <Sidebar />
      
      {/* Real-time Status Overlay */}
      <div className="absolute top-28 left-8 z-10 flex flex-col gap-1 pointer-events-none">
        <div className="flex items-center gap-3">
          <div className={`w-1 h-12 ${liveLoading ? 'bg-neutral-600' : 'bg-green-500 animate-pulse'}`} />
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
              {sessionLoading ? "SCANNING SATELLITES..." : session?.circuit_short_name}
            </h1>
            <p className="text-green-500 font-black text-[10px] tracking-[0.4em] uppercase">
              {liveLoading ? "Initializing Uplink..." : "Active Telemetry Stream • Live"}
            </p>
          </div>
        </div>
      </div>

      {/* Data Source Badge */}
      <div className="absolute bottom-10 right-8 z-20 flex flex-col items-end">
          <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Source: OpenF1 Oracle API</span>
          <div className="flex gap-2">
              <div className="px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-black uppercase text-white backdrop-blur-md">
                 Session #{session?.session_key}
              </div>
          </div>
      </div>

      <div className="w-full h-full">
        <Canvas shadows gl={{ antialias: true }}>
          <PerspectiveCamera makeDefault position={[0, 40, 40]} fov={40} />
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
          <color attach="background" args={['#020202']} />
          <fog attach="fog" args={['#020202', 50, 90]} />
          
          <ambientLight intensity={0.2} />
          <spotLight position={[0, 50, 0]} angle={0.4} penumbra={1} intensity={2} castShadow />
          
          <Suspense fallback={null}>
            {session && <RealtimeTrack sessionKey={session.session_key} />}
            
            {Object.entries(locations).map(([driverNum, loc]) => (
              <LiveDriverMarker 
                key={driverNum} 
                driver={driverNum} 
                location={loc} 
                color={driverNum === "1" ? "#0600EF" : "#EF1A2D"} 
              />
            ))}
            
            <Environment preset="night" />
          </Suspense>

          <OrbitControls maxPolarAngle={Math.PI / 2.1} makeDefault />
        </Canvas>
      </div>

      {/* Broadcast Ticker */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[60%] z-10 transition-opacity">
         <div className="bg-black/90 backdrop-blur-2xl border border-white/10 h-10 flex items-center px-4">
            <div className="bg-green-600 text-white text-[8px] font-black px-2 py-0.5 uppercase tracking-widest mr-4">Live</div>
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">
               Streaming live location data for {Object.keys(locations).length} drivers from <span className="text-white">{session?.location}</span>
            </div>
         </div>
      </div>
    </div>
  );
}
