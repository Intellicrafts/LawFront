import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, MicOff, Phone, PhoneOff, Upload, Settings, Sparkles } from 'lucide-react';

// Import API services for voice functionality (with fallback)
let apiServices = null;
try {
  const api = require('../api/apiService');
  apiServices = api.apiServices;
} catch (error) {
  console.log('API services not available, using local voice processing');
}

const VoiceModal = ({ isOpen, onClose, isVoiceActive, setIsVoiceActive, onVoiceResult }) => {
  // State management
  const [voiceState, setVoiceState] = useState('idle'); // 'idle', 'listening', 'processing', 'speaking'
  const [audioLevel, setAudioLevel] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [voiceSession, setVoiceSession] = useState(null);
  const [transcript, setTranscript] = useState('');
  
  // Enhanced voice visualization
  const [realTimeAudioLevel, setRealTimeAudioLevel] = useState(0);
  const [voiceFrequency, setVoiceFrequency] = useState(0);
  
  // Refs
  const modalRef = useRef(null);
  const audioAnimationRef = useRef(null);
  const hideControlsTimeoutRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  // Premium GIF Image URL - Using local background-removed version
  const premiumGifUrl = '/voice-modal.gif';

  // Setup real-time audio analysis for voice synchronization
  const setupAudioAnalysis = useCallback(async (stream) => {
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      // Real-time audio analysis
      const analyzeAudio = () => {
        if (analyserRef.current && voiceState === 'listening') {
          analyserRef.current.getByteFrequencyData(dataArray);
          
          // Calculate average volume
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const average = sum / bufferLength;
          
          // Calculate dominant frequency
          let maxIndex = 0;
          let maxValue = 0;
          for (let i = 0; i < bufferLength; i++) {
            if (dataArray[i] > maxValue) {
              maxValue = dataArray[i];
              maxIndex = i;
            }
          }
          
          setRealTimeAudioLevel(average);
          setVoiceFrequency(maxIndex);
          
          requestAnimationFrame(analyzeAudio);
        }
      };
      
      analyzeAudio();
    } catch (error) {
      console.error('Audio analysis setup failed:', error);
    }
  }, [voiceState]);

  // Get compatible background colors based on theme
  const getModalBackground = useCallback(() => {
    const isDark = document.documentElement.classList.contains('dark');
    
    if (isDark) {
      return {
        // Dark mode - deep tech blue gradients compatible with GIF
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 25%, #312e81 50%, #1e1b4b 75%, #0f172a 100%)',
        overlayColor: 'rgba(15, 23, 42, 0.85)'
      };
    } else {
      return {
        // Light mode - soft blue-gray gradients
        background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%, #f1f5f9 100%)',
        overlayColor: 'rgba(241, 245, 249, 0.9)'
      };
    }
  }, []);

  // Reset controls visibility timer
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideControlsTimeoutRef.current);
    hideControlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  }, []);

  // Handle modal state with improved timing
  useEffect(() => {
    if (isOpen) {
      // Ensure smooth modal opening
      document.body.style.overflow = 'hidden';
      
      // Use requestAnimationFrame to ensure DOM updates are processed
      requestAnimationFrame(() => {
        setIsConnected(true);
        setVoiceState(isVoiceActive ? 'listening' : 'idle');
        
        // Auto-hide controls after 3 seconds
        resetControlsTimer();
      });
    } else {
      document.body.style.overflow = 'auto';
      setIsConnected(false);
      setVoiceState('idle');
      clearTimeout(hideControlsTimeoutRef.current);
    }
    
    return () => {
      document.body.style.overflow = 'auto';
      clearTimeout(hideControlsTimeoutRef.current);
    };
  }, [isOpen, isVoiceActive, resetControlsTimer]);


  // Handle mouse movement to show controls
  const handleMouseMove = useCallback(() => {
    resetControlsTimer();
  }, [resetControlsTimer]);

  // Initialize modal with theme-compatible styling
  useEffect(() => {
    if (isOpen) {
      // Apply theme-aware styling when modal opens
      const modalBg = getModalBackground();
      if (modalRef.current) {
        modalRef.current.style.background = modalBg.background;
      }
    }
  }, [isOpen, getModalBackground]);

  // Enhanced audio levels with real-time voice synchronization
  useEffect(() => {
    if (voiceState === 'listening' || voiceState === 'speaking') {
      const interval = setInterval(() => {
        // Use real-time audio level if available, otherwise simulate
        if (realTimeAudioLevel > 0) {
          setAudioLevel(realTimeAudioLevel * 4); // Amplify for better visualization
        } else {
          setAudioLevel(Math.random() * 100);
        }
      }, 50); // Faster updates for smoother animation
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
      setRealTimeAudioLevel(0);
    }
  }, [voiceState, realTimeAudioLevel]);

  // Start voice recording with audio analysis
  const startVoiceRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      // Setup real-time audio analysis for voice synchronization
      await setupAudioAnalysis(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        // Process the audio if needed
        processVoiceInput(audioBlob);
        
        // Cleanup audio context
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
        
        // Cleanup stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setVoiceState('listening');
      console.log('Voice recording started with real-time analysis');
      
    } catch (error) {
      console.error('Error starting voice recording:', error);
      setVoiceState('idle');
      setIsVoiceActive(false);
    }
  }, [setupAudioAnalysis]);

  // Stop voice recording
  const stopVoiceRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setVoiceState('processing');
      console.log('Voice recording stopped');
    }
  }, []);

  // Process voice input (can be extended with API integration)
  const processVoiceInput = useCallback(async (audioBlob) => {
    try {
      setVoiceState('processing');
      
      // Simulate processing time for demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate transcript result for demo
      const simulatedTranscript = "Hello, I need legal advice about my case.";
      setTranscript(simulatedTranscript);
      
      // Call the onVoiceResult callback if provided
      if (onVoiceResult) {
        onVoiceResult(simulatedTranscript);
      }
      
      setVoiceState('idle');
      setIsVoiceActive(false);
      
    } catch (error) {
      console.error('Error processing voice input:', error);
      setVoiceState('idle');
      setIsVoiceActive(false);
    }
  }, [onVoiceResult]);

  // Enhanced voice toggle handler
  const handleVoiceToggle = useCallback(() => {
    if (isVoiceActive) {
      stopVoiceRecording();
      setIsVoiceActive(false);
    } else {
      setIsVoiceActive(true);
      startVoiceRecording();
    }
    resetControlsTimer();
  }, [isVoiceActive, setIsVoiceActive, resetControlsTimer, startVoiceRecording, stopVoiceRecording]);

  // Handle close with proper cleanup
  const handleClose = useCallback(() => {
    // Stop any ongoing voice recording
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    // Reset all states
    setIsVoiceActive(false);
    setVoiceState('idle');
    setTranscript('');
    
    // Call parent close handler
    onClose();
  }, [onClose, setIsVoiceActive]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return;
      
      if (event.key === 'Escape') {
        handleClose();
      } else if (event.key === ' ' || event.code === 'Space') {
        event.preventDefault();
        handleVoiceToggle();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose, handleVoiceToggle]);

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ 
            duration: 0.3, 
            ease: "easeOut",
            opacity: { duration: 0.2 },
            scale: { duration: 0.3 }
          }}
          className="fixed inset-0 z-[10000] flex items-center justify-center"
          style={{ 
            cursor: showControls ? 'default' : 'none',
            ...getModalBackground()
          }}
          onMouseMove={handleMouseMove}
          onClick={resetControlsTimer}
        >
          {/* Main Content Container - Perfectly Centered */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Dynamic Voice Animation GIF with Sound Wave Sync */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={
                voiceState === 'listening' ? {
                  // ACTIVE LISTENING - Dynamic sound wave synchronization
                  scale: [
                    1, 
                    1.03 + (realTimeAudioLevel / 300), 
                    1.01 + (realTimeAudioLevel / 400),
                    1.05 + (realTimeAudioLevel / 250),
                    1
                  ],
                  opacity: 1,
                  rotateZ: realTimeAudioLevel > 70 ? [0, 2, -2, 1, 0] : realTimeAudioLevel > 30 ? [0, 1, -1, 0] : 0,
                  y: realTimeAudioLevel > 80 ? [0, -2, 2, -1, 0] : 0
                } : voiceState === 'speaking' ? {
                  // SPEAKING - Rhythmic response animation
                  scale: [1, 1.08, 1.03, 1.12, 1],
                  opacity: 1,
                  rotateZ: [0, 3, -2, 1, 0],
                  y: [0, -3, 1, -2, 0]
                } : {
                  // IDLE - Slow, smooth, subtle breathing effect
                  scale: [1, 1.015, 1],
                  opacity: [0.95, 1, 0.95],
                  rotateZ: [0, 0.5, 0],
                  y: [0, -1, 0]
                }
              }
              transition={
                voiceState === 'listening' ? {
                  // Fast, responsive to audio
                  duration: Math.max(0.3, 1.2 - (realTimeAudioLevel / 150)),
                  repeat: Infinity,
                  ease: [0.4, 0, 0.6, 1], // Custom cubic-bezier for natural feel
                  times: [0, 0.25, 0.5, 0.75, 1]
                } : voiceState === 'speaking' ? {
                  // Energetic speaking rhythm
                  duration: 1.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.2, 0.5, 0.8, 1]
                } : {
                  // Slow, calm breathing when idle
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.5, 1]
                }
              }
              className="relative flex items-center justify-center"
            >
              {/* Enhanced Dynamic AI Voice Animation GIF */}
              <motion.img
                src={premiumGifUrl}
                alt="AI Voice Assistant"
                className={`w-[85vw] h-[85vw] max-w-[600px] max-h-[600px] md:w-[500px] md:h-[500px] object-contain ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                animate={
                  voiceState === 'listening' ? {
                    // LISTENING - Dynamic visual response to sound waves
                    filter: [
                      `brightness(1.1) saturate(1.3) contrast(1.1)`,
                      `brightness(${1.2 + (realTimeAudioLevel / 300)}) saturate(${1.4 + (realTimeAudioLevel / 250)}) contrast(${1.15 + (realTimeAudioLevel / 400)}) hue-rotate(${-3 + (voiceFrequency / 15)}deg)`,
                      `brightness(1.15) saturate(1.35) contrast(1.12)`,
                      `brightness(${1.25 + (realTimeAudioLevel / 350)}) saturate(${1.5 + (realTimeAudioLevel / 200)}) contrast(${1.2 + (realTimeAudioLevel / 300)}) hue-rotate(${-5 + (voiceFrequency / 12)}deg)`,
                      `brightness(1.1) saturate(1.3) contrast(1.1)`
                    ],
                    dropShadow: realTimeAudioLevel > 80 ? [
                      '0 0 20px rgba(59, 130, 246, 0.4)',
                      `0 0 ${30 + (realTimeAudioLevel / 5)}px rgba(99, 102, 241, ${0.3 + (realTimeAudioLevel / 400)})`,
                      '0 0 25px rgba(59, 130, 246, 0.5)',
                      `0 0 ${35 + (realTimeAudioLevel / 4)}px rgba(139, 92, 246, ${0.4 + (realTimeAudioLevel / 300)})`
                    ] : '0 0 15px rgba(59, 130, 246, 0.2)'
                  } : voiceState === 'speaking' ? {
                    // SPEAKING - Energetic response animation
                    filter: [
                      'brightness(1.2) saturate(1.4) contrast(1.2) hue-rotate(8deg)',
                      'brightness(1.35) saturate(1.6) contrast(1.25) hue-rotate(12deg)',
                      'brightness(1.25) saturate(1.45) contrast(1.22) hue-rotate(10deg)',
                      'brightness(1.4) saturate(1.7) contrast(1.3) hue-rotate(15deg)',
                      'brightness(1.2) saturate(1.4) contrast(1.2) hue-rotate(8deg)'
                    ],
                    dropShadow: [
                      '0 0 25px rgba(16, 185, 129, 0.4)',
                      '0 0 35px rgba(34, 197, 94, 0.6)',
                      '0 0 30px rgba(16, 185, 129, 0.5)',
                      '0 0 40px rgba(59, 130, 246, 0.7)',
                      '0 0 25px rgba(16, 185, 129, 0.4)'
                    ]
                  } : {
                    // IDLE - Subtle, calming presence
                    filter: [
                      'brightness(0.95) saturate(1.05) contrast(1.02)',
                      'brightness(1.0) saturate(1.1) contrast(1.05)',
                      'brightness(0.95) saturate(1.05) contrast(1.02)'
                    ],
                    dropShadow: [
                      '0 0 10px rgba(148, 163, 184, 0.1)',
                      '0 0 15px rgba(148, 163, 184, 0.15)',
                      '0 0 10px rgba(148, 163, 184, 0.1)'
                    ]
                  }
                }
                transition={
                  voiceState === 'listening' ? {
                    duration: Math.max(0.4, 1.5 - (realTimeAudioLevel / 120)),
                    repeat: Infinity,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    times: [0, 0.25, 0.5, 0.75, 1]
                  } : voiceState === 'speaking' ? {
                    duration: 1.1,
                    repeat: Infinity,  
                    ease: "easeInOut",
                    times: [0, 0.2, 0.5, 0.8, 1]
                  } : {
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.5, 1]
                  }
                }
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />
              
              {/* Fallback Loading Animation */}
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.8, 0.3]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-64 h-64 rounded-full border-4 border-white/30"
                  />
                  <motion.div
                    animate={{
                      scale: [1.2, 1.4, 1.2],
                      opacity: [0.2, 0.6, 0.2]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                    className="absolute w-80 h-80 rounded-full border-2 border-white/20"
                  />
                </div>
              )}
              
              {/* Enhanced Dynamic Glow Effects */}
              <motion.div
                animate={
                  voiceState === 'listening' ? {
                    // LISTENING - Reactive sound wave glow
                    scale: [
                      1, 
                      1.1 + (realTimeAudioLevel / 400), 
                      1.05 + (realTimeAudioLevel / 500),
                      1.15 + (realTimeAudioLevel / 350),
                      1
                    ],
                    opacity: [
                      0.15,
                      Math.min(0.5, 0.2 + (realTimeAudioLevel / 180)),
                      0.25,
                      Math.min(0.6, 0.3 + (realTimeAudioLevel / 150)),
                      0.15
                    ]
                  } : voiceState === 'speaking' ? {
                    // SPEAKING - Energetic pulsing glow
                    scale: [1, 1.25, 1.1, 1.3, 1],
                    opacity: [0.3, 0.7, 0.4, 0.8, 0.3]
                  } : {
                    // IDLE - Gentle breathing glow
                    scale: [1, 1.05, 1],
                    opacity: [0.05, 0.12, 0.05]
                  }
                }
                transition={
                  voiceState === 'listening' ? {
                    duration: Math.max(0.6, 2 - (realTimeAudioLevel / 100)),
                    repeat: Infinity,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    times: [0, 0.25, 0.5, 0.75, 1]
                  } : voiceState === 'speaking' ? {
                    duration: 1.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.2, 0.5, 0.8, 1]
                  } : {
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.5, 1]
                  }
                }
                className="absolute inset-0 rounded-full"
                style={{
                  background: voiceState === 'listening' ? 
                    `radial-gradient(circle, rgba(99, 102, 241, ${Math.min(0.4, 0.15 + (realTimeAudioLevel / 350))}) 0%, rgba(59, 130, 246, ${Math.min(0.3, 0.1 + (realTimeAudioLevel / 400))}) 40%, transparent 70%)` :
                    voiceState === 'speaking' ? 
                    'radial-gradient(circle, rgba(16, 185, 129, 0.35) 0%, rgba(59, 130, 246, 0.25) 40%, transparent 70%)' :
                    'radial-gradient(circle, rgba(148, 163, 184, 0.08) 0%, transparent 60%)',
                  filter: `blur(${voiceState === 'listening' ? 20 + (realTimeAudioLevel / 8) : voiceState === 'speaking' ? 28 : 15}px)`,
                  transform: voiceState === 'listening' && realTimeAudioLevel > 120 ? 
                    `scale(${1.02 + (realTimeAudioLevel - 120) / 1000})` : ''
                }}
              />
              
              {/* Advanced Frequency-Based Ring Effects */}
              {voiceState === 'listening' && realTimeAudioLevel > 50 && (
                <>
                  {/* Primary Sound Wave Ring */}
                  <motion.div
                    animate={{
                      scale: [1, 2.2, 3.5],
                      opacity: [
                        Math.min(0.7, realTimeAudioLevel / 120),
                        Math.min(0.4, realTimeAudioLevel / 200),
                        0
                      ]
                    }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: "easeOut",
                      times: [0, 0.6, 1]
                    }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      border: `2px solid rgba(99, 102, 241, ${Math.min(0.4, realTimeAudioLevel / 250)})`,
                      filter: 'blur(0.5px)'
                    }}
                  />
                  
                  {/* Secondary Harmonic Ring */}
                  {realTimeAudioLevel > 90 && (
                    <motion.div
                      animate={{
                        scale: [1, 1.8, 2.8],
                        opacity: [
                          Math.min(0.5, realTimeAudioLevel / 180),
                          Math.min(0.3, realTimeAudioLevel / 280),
                          0
                        ]
                      }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeOut",
                        delay: 0.3
                      }}
                      className="absolute inset-0 rounded-full"
                      style={{
                        border: `1px solid hsl(${240 + (voiceFrequency * 1.5)}, 70%, 60%)`,
                        filter: 'blur(1px)',
                        opacity: Math.min(0.6, realTimeAudioLevel / 200)
                      }}
                    />
                  )}
                </>
              )}
              
              {/* Speaking State Energy Rings */}
              {voiceState === 'speaking' && (
                <motion.div
                  animate={{
                    scale: [1, 2.5, 4],
                    opacity: [0.6, 0.3, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: '2px solid rgba(16, 185, 129, 0.4)',
                    filter: 'blur(1px)'
                  }}
                />
              )}
            </motion.div>







          </div>

          {/* Professional Mic Button - Positioned Under Image */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ 
              y: 0, 
              opacity: showControls ? 1 : 0,
              pointerEvents: showControls ? 'auto' : 'none'
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute bottom-16 sm:bottom-20 left-[48.8%] transform -translate-x-1/2"
          >
            {/* Elegant Professional Mic Button */}
            <motion.button
              whileHover={{ 
                scale: 1.08,
                y: -2
              }}
              whileTap={{ scale: 0.92 }}
              onClick={(e) => {
                e.stopPropagation();
                handleVoiceToggle();
              }}
              className="relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group"
              style={{
                backgroundColor: isVoiceActive 
                  ? document.documentElement.classList.contains('dark') 
                    ? 'rgba(99, 102, 241, 0.9)' 
                    : 'rgba(59, 130, 246, 0.9)'
                  : document.documentElement.classList.contains('dark')
                    ? 'rgba(30, 41, 59, 0.8)'
                    : 'rgba(248, 250, 252, 0.9)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${
                  isVoiceActive 
                    ? document.documentElement.classList.contains('dark')
                      ? 'rgba(99, 102, 241, 0.6)'
                      : 'rgba(59, 130, 246, 0.6)'
                    : document.documentElement.classList.contains('dark')
                      ? 'rgba(71, 85, 105, 0.3)'
                      : 'rgba(203, 213, 225, 0.4)'
                }`,
                boxShadow: isVoiceActive 
                  ? document.documentElement.classList.contains('dark')
                    ? '0 8px 32px rgba(99, 102, 241, 0.4), 0 0 0 1px rgba(99, 102, 241, 0.1)'
                    : '0 8px 32px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.1)'
                  : document.documentElement.classList.contains('dark')
                    ? '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(71, 85, 105, 0.1)'
                    : '0 4px 20px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(203, 213, 225, 0.2)',
                color: isVoiceActive 
                  ? '#ffffff'
                  : document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#475569'
              }}
            >
              {/* Subtle Active Pulse */}
              {isVoiceActive && (
                <motion.div
                  animate={{ 
                    scale: [1, 1.4, 1], 
                    opacity: [0, 0.3, 0] 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: document.documentElement.classList.contains('dark')
                      ? 'rgba(99, 102, 241, 0.4)'
                      : 'rgba(59, 130, 246, 0.4)'
                  }}
                />
              )}
              
              {/* Mic Icon with Smooth Animation */}
              <motion.div
                animate={isVoiceActive ? { 
                  scale: [1, 1.05, 1],
                } : {}}
                transition={{ 
                  duration: 1.5, 
                  repeat: isVoiceActive ? Infinity : 0,
                  ease: "easeInOut"
                }}
                className="relative z-10"
              >
                <Mic 
                  size={18} 
                  className={`transition-all duration-300 ${
                    isVoiceActive ? 'drop-shadow-sm' : ''
                  }`}
                  strokeWidth={2.5}
                />
              </motion.div>
              
              {/* Listening Indicator Dots */}
              {isVoiceActive && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1 p-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [0.8, 1.2, 0.8],
                        opacity: [0.4, 1, 0.4]
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut"
                      }}
                      className="w-1 h-1 rounded-full"
                      style={{
                        backgroundColor: document.documentElement.classList.contains('dark')
                          ? 'rgba(226, 232, 240, 0.8)'
                          : 'rgba(255, 255, 255, 0.9)'
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.button>
          </motion.div>

          {/* Professional Close Button - Enhanced Design */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
            animate={{ 
              opacity: showControls ? 1 : 0,
              scale: showControls ? 1 : 0.8,
              rotate: showControls ? 0 : -90,
              pointerEvents: showControls ? 'auto' : 'none'
            }}
            whileHover={{ 
              scale: 1.15, 
              rotate: 90,
              y: -1
            }}
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="absolute top-6 right-6 w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 z-50 group"
            style={{
              backgroundColor: document.documentElement.classList.contains('dark')
                ? 'rgba(15, 23, 42, 0.8)'
                : 'rgba(248, 250, 252, 0.95)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${
                document.documentElement.classList.contains('dark')
                  ? 'rgba(71, 85, 105, 0.3)'
                  : 'rgba(203, 213, 225, 0.4)'
              }`,
              boxShadow: document.documentElement.classList.contains('dark')
                ? '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(71, 85, 105, 0.2)'
                : '0 4px 20px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(203, 213, 225, 0.3)',
              color: document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#475569'
            }}
          >
            {/* Close Icon with Smooth Animation */}
            <motion.div
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative"
            >
              <X 
                size={16} 
                strokeWidth={2.5}
                className="transition-all duration-300 group-hover:drop-shadow-sm"
              />
            </motion.div>
            
            {/* Subtle Hover Glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ 
                opacity: 0.2, 
                scale: 1.3 
              }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 rounded-2xl"
              style={{
                background: document.documentElement.classList.contains('dark')
                  ? 'rgba(239, 68, 68, 0.3)'
                  : 'rgba(220, 38, 38, 0.2)'
              }}
            />
          </motion.button>

          {/* Elegant Gesture Hint */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: showControls && !isVoiceActive ? 0.6 : 0,
              y: showControls && !isVoiceActive ? 0 : 20
            }}
            transition={{ duration: 0.3, delay: 1.5 }}
            className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-xs font-medium tracking-wide"
            style={{
              color: document.documentElement.classList.contains('dark') ? 'rgba(226, 232, 240, 0.5)' : 'rgba(55, 65, 81, 0.5)'
            }}
          >
            Click mic or press Space to start
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceModal;