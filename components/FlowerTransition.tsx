import React, { useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';

interface FlowerTransitionProps {
  onComplete: () => void;
}

const FlowerTransition: React.FC<FlowerTransitionProps> = ({ onComplete }) => {
  // Mobile/Desktop balance - density high enough to cover screen
  const rows = 12; 
  const cols = 8; 
  
  // Play magical bloom sound on mount
  useEffect(() => {
    const playBreezeSound = () => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const now = ctx.currentTime;

            // --- 1. The Breeze (Soft Wind) ---
            const bufferSize = ctx.sampleRate * 3; // 3 seconds buffer
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            
            // Create soft noise
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1);
            }

            const noiseSrc = ctx.createBufferSource();
            noiseSrc.buffer = buffer;

            // Filter to make it sound like wind/breeze (Lowpass)
            const noiseFilter = ctx.createBiquadFilter();
            noiseFilter.type = 'lowpass';
            noiseFilter.Q.value = 1; // Slight resonance for wind character
            noiseFilter.frequency.setValueAtTime(150, now);
            noiseFilter.frequency.exponentialRampToValueAtTime(600, now + 1.2); // Swell up
            noiseFilter.frequency.exponentialRampToValueAtTime(100, now + 2.5); // Die down

            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0, now);
            noiseGain.gain.linearRampToValueAtTime(0.08, now + 0.5); // Very soft fade in
            noiseGain.gain.linearRampToValueAtTime(0, now + 2.5);   // Fade out

            noiseSrc.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(ctx.destination);
            noiseSrc.start(now);

            // --- 2. The Flowers Popping (Soft chime/sparkles) ---
            // Random soft tinkles to represent flowers opening
            const sparkleCount = 12;
            for (let i = 0; i < sparkleCount; i++) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);

                // High pitched but pleasant frequencies (Pentatonic C6)
                // C6, D6, E6, G6, A6
                const notes = [1046.50, 1174.66, 1318.51, 1567.98, 1760.00];
                const freq = notes[Math.floor(Math.random() * notes.length)];
                
                osc.type = 'sine'; // Sine waves are "soft"
                osc.frequency.setValueAtTime(freq, now);

                // Spread them out over the animation duration (approx 2s)
                const startTime = now + (Math.random() * 1.8);
                const duration = 0.3 + Math.random() * 0.2;
                
                // Envelope - gentle bell shape
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.03, startTime + 0.05); // Very quiet
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

                osc.start(startTime);
                osc.stop(startTime + duration);
            }
        } catch (e) {
            console.error("Audio play failed", e);
        }
    };

    playBreezeSound();
  }, []);

  // Create grid of flower data
  const flowers = useMemo(() => {
    const items = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        items.push({ 
            id: `${r}-${c}`, 
            r, 
            c,
            // Random positioning offsets to look organic
            xOffset: (Math.random() - 0.5) * 40,
            yOffset: (Math.random() - 0.5) * 40,
            scale: 2 + Math.random() * 1.5, // Large scale to ensure coverage
            type: Math.floor(Math.random() * 3), // 3 distinct flower shapes
            rotation: Math.random() * 360,
            colorVariant: Math.floor(Math.random() * 3) // 3 color palettes
        });
      }
    }
    return items;
  }, []);

  // We want the callback to fire when the LAST flower finishes.
  // In our bottom-to-top logic, the Top row (r=0) has the longest delay.
  // So we attach the onComplete callback to the first flower of the top row.
  const triggerIndex = flowers.findIndex(f => f.r === 0 && f.c === 0);

  return (
    // z-[100] ensures it appears on top of the "You Win" modal (which is z-50)
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden flex flex-wrap">
      {flowers.map((flower, i) => (
        <Flower 
            key={flower.id} 
            data={flower}
            rows={rows} 
            cols={cols}
            onComplete={i === triggerIndex ? onComplete : undefined}
        />
      ))}
    </div>
  );
};

interface FlowerData {
    id: string;
    r: number;
    c: number;
    xOffset: number;
    yOffset: number;
    scale: number;
    type: number;
    rotation: number;
    colorVariant: number;
}

interface FlowerProps {
    data: FlowerData;
    rows: number;
    cols: number;
    onComplete?: () => void;
}

const Flower: React.FC<FlowerProps> = ({ data, rows, cols, onComplete }) => {
    const { r, c, xOffset, yOffset, scale, type, rotation, colorVariant } = data;

    // Calculate Grid Position
    const left = (c / cols) * 100;
    const top = (r / rows) * 100;
    
    // Bottom-to-top delay logic:
    // r ranges from 0 (top) to rows-1 (bottom).
    // We want bottom to start first (delay ~ 0).
    // We want top to start last (delay ~ max).
    // Formula: (rows - 1 - r) gives 0 at bottom, max at top.
    const baseDelay = (rows - 1 - r) * 0.08; 
    const randomDelay = Math.random() * 0.15; // Jitter to make it less robotic
    const totalDelay = baseDelay + randomDelay;

    // Palette Configuration
    const palettes = [
        { main: 'text-fred-pink', center: 'text-yellow-200' },     // Variant 0
        { main: 'text-fred-red', center: 'text-orange-200' },      // Variant 1
        { main: 'text-fred-yellow', center: 'text-yellow-600' }    // Variant 2
    ];

    const { main, center } = palettes[colorVariant];

    return (
        <motion.div
            className={`absolute ${main} flex items-center justify-center`}
            style={{
                left: `calc(${left}% + ${xOffset}px)`,
                top: `calc(${top}% + ${yOffset}px)`,
                width: `${100/cols}%`, 
                height: `${100/rows}%`,
                zIndex: r, // Simple layering
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: scale, opacity: 1 }}
            transition={{
                duration: 0.9,
                delay: totalDelay,
                ease: [0.34, 1.56, 0.64, 1] // Spring-like expansion
            }}
            onAnimationComplete={onComplete}
        >
             <svg 
                viewBox="0 0 100 100" 
                className="w-full h-full overflow-visible drop-shadow-sm" 
                style={{ transform: `rotate(${rotation}deg)` }}
             >
                {/* Green Leaves layer (behind petals) */}
                <g className="text-green-300" opacity="0.8">
                     <path d="M50 50 Q 20 80 10 50 Q 20 20 50 50" fill="currentColor" transform="rotate(45, 50, 50) scale(1.3)" />
                     <path d="M50 50 Q 80 80 90 50 Q 80 20 50 50" fill="currentColor" transform="rotate(-45, 50, 50) scale(1.3)" />
                </g>

                {/* Flower Type 0: Daisy (Classic petals) */}
                {type === 0 && (
                    <g fill="currentColor">
                        {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                            <ellipse key={deg} cx="50" cy="20" rx="12" ry="30" transform={`rotate(${deg} 50 50)`} />
                        ))}
                        <circle cx="50" cy="50" r="18" className={center} fill="currentColor" />
                    </g>
                )}

                {/* Flower Type 1: Rose/Peony (Layered circles) */}
                {type === 1 && (
                    <g fill="currentColor">
                         <circle cx="50" cy="50" r="42" opacity="0.7" />
                         <circle cx="45" cy="45" r="35" opacity="0.8" filter="brightness(1.1)" />
                         <circle cx="55" cy="55" r="28" opacity="0.9" filter="brightness(0.9)" />
                         <circle cx="50" cy="50" r="20" filter="brightness(1.2)" />
                         <circle cx="50" cy="50" r="10" className={center} fill="currentColor" />
                    </g>
                )}
                
                {/* Flower Type 2: Tropical (Rounded Square-ish petals) */}
                {type === 2 && (
                    <g fill="currentColor">
                        <circle cx="35" cy="35" r="25" />
                        <circle cx="65" cy="35" r="25" />
                        <circle cx="35" cy="65" r="25" />
                        <circle cx="65" cy="65" r="25" />
                        <circle cx="50" cy="50" r="15" className={center} fill="currentColor" />
                    </g>
                )}
            </svg>
        </motion.div>
    )
}

export default FlowerTransition;