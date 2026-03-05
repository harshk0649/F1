import React, { Suspense, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float, useGLTF, PerspectiveCamera, Sparkles } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Play } from 'lucide-react';
import { Navbar, Sidebar } from '../components/Layout';

function F1Car() {
  const { scene } = useGLTF('/models/f1_car.glb');
  
  // Set up shadows for all meshes in the scene
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as any).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <primitive object={scene} scale={1.1} position={[2, -0.8, 0]} rotation={[0, -Math.PI / 4, 0]} />
    </Float>
  );
}

function Loader() {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-neutral-950">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: "200px" }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="h-[2px] bg-red-600 relative"
      >
        <span className="absolute top-4 left-0 text-[10px] font-black tracking-widest uppercase opacity-50">Initializing Systems...</span>
      </motion.div>
    </div>
  );
}

export default function LandingPage() {
  const [started, setStarted] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen bg-neutral-950 overflow-hidden">
      <Navbar />
      <Sidebar />

      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[5, 1.5, 7]} fov={35} />
          <color attach="background" args={['#050505']} />
          
          <fog attach="fog" args={['#050505', 10, 25]} />
          
          <ambientLight intensity={0.2} />
          <spotLight 
            position={[10, 10, 10]} 
            angle={0.15} 
            penumbra={1} 
            intensity={2} 
            castShadow 
            shadow-mapSize={[2048, 2048]}
          />
          <pointLight position={[-10, 5, -10]} intensity={1} color="#e10600" />
          <rectAreaLight
            width={10}
            height={10}
            color="#ffffff"
            intensity={0.5}
            position={[0, 5, 5]}
          />
          
          <Suspense fallback={null}>
            <F1Car />
            <Sparkles count={100} scale={10} size={1} speed={0.4} opacity={0.2} color="#ffffff" />
            <Environment preset="night" />
            <ContactShadows 
              position={[0, -1.2, 0]} 
              opacity={0.6} 
              scale={20} 
              blur={2.5} 
              far={4} 
              resolution={1024}
              color="#000000"
            />
          </Suspense>

          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate={!started}
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
      </div>

      {/* Overlay Content */}
      <AnimatePresence>
        {!started && (
          <div className="relative z-10 w-full h-full flex flex-col justify-center items-start px-8 md:px-24 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.8, ease: "circOut" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-[2px] bg-red-600" />
                <span className="text-red-500 font-black tracking-[0.3em] uppercase text-xs">Pinnacle of Racing</span>
              </div>
              <h1 className="text-7xl md:text-[10rem] font-black italic tracking-tighter uppercase leading-none text-white mix-blend-difference selection:bg-red-600">
                VISION
              </h1>
              <p className="mt-6 text-lg md:text-xl text-neutral-400 font-medium max-w-xl leading-relaxed">
                Experience the raw adrenaline of Formula 1 with state-of-the-art 3D telemetry and AI-driven race insights.
              </p>
              
              <div className="mt-12 flex flex-wrap gap-6 pointer-events-auto">
                <button 
                  onClick={() => setStarted(true)}
                  className="flex items-center gap-4 bg-red-600 hover:bg-white hover:text-black text-white px-10 py-5 rounded-none uppercase font-black tracking-[0.2em] transition-all hover:translate-x-2 group relative overflow-hidden"
                >
                  <span className="relative z-10 transition-colors uppercase">Start Engine</span>
                  <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                  <Play className="w-5 h-5 relative z-10 group-hover:fill-black group-hover:text-black transition-all" />
                </button>
                
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-4 border-2 border-neutral-800 hover:border-red-600/50 bg-black/40 backdrop-blur-md text-white px-10 py-5 rounded-none uppercase font-black tracking-[0.2em] transition-all hover:-translate-y-1"
                >
                  Live Race
                  <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HUD Elements when started */}
      <AnimatePresence>
        {started && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 pointer-events-none z-20"
          >
             {/* Add future dashboard elements here */}
             <div className="absolute bottom-12 right-12 text-right">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="text-red-600 font-black italic text-4xl">RB20</h3>
                  <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">Aero-Dynamic Specification</p>
                </motion.div>
             </div>
             <motion.button 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setStarted(false)}
                className="absolute bottom-12 left-12 pointer-events-auto text-xs font-black uppercase tracking-[0.3em] text-neutral-500 hover:text-white transition-colors"
             >
               {"// Back to Menu"}
             </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
