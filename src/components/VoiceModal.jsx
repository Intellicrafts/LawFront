import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Square, MessageCircle } from 'lucide-react';

const VoiceModal = ({ isOpen, onClose, onVoiceResult }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [conversation, setConversation] = useState([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Simulate audio level animation
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
    }
  }, [isListening]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      setIsSpeaking(false);
      setCurrentTranscript('');
      setIsProcessing(false);
      // Keep conversation history for user reference
    }
  }, [isOpen]);

  // Simulate conversation flow
  const handleStartListening = () => {
    setIsListening(true);
    setCurrentTranscript('');
    
    // Simulate real-time transcription
    setTimeout(() => {
      setCurrentTranscript('What are the legal implications of...');
    }, 1000);
    setTimeout(() => {
      setCurrentTranscript('What are the legal implications of contract breach?');
    }, 2500);
    
    // Auto stop after 5 seconds and respond
    setTimeout(() => {
      setIsListening(false);
      handleAIResponse();
    }, 5000);
  };

  const handleStopListening = () => {
    setIsListening(false);
    if (currentTranscript) {
      handleAIResponse();
    }
  };

  const handleAIResponse = () => {
    if (!currentTranscript) return;
    
    setIsProcessing(true);
    
    // Add user message
    const userMessage = currentTranscript;
    setConversation(prev => [...prev, { type: 'user', text: userMessage, timestamp: new Date() }]);
    
    // Optional: Send transcript back to parent component
    if (onVoiceResult) {
      onVoiceResult(currentTranscript);
    }
    
    setCurrentTranscript('');
    
    // AI response simulation
    setTimeout(() => {
      setIsProcessing(false);
      setIsSpeaking(true);
      
      const aiResponses = [
        "Contract breach occurs when one party fails to fulfill their obligations. The legal implications include potential damages, specific performance remedies, and possible termination rights. Would you like me to elaborate on any specific aspect?",
        "Based on your question about legal implications, I can provide detailed guidance on contract law, liability issues, and potential remedies available to you.",
        "That's an excellent legal question. Let me break down the key considerations and provide you with actionable legal insights."
      ];
      
      const aiResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      setConversation(prev => [...prev, { type: 'ai', text: aiResponse, timestamp: new Date() }]);
      
      // Simulate speaking duration based on text length
      const speakingDuration = Math.max(3000, aiResponse.length * 50);
      setTimeout(() => {
        setIsSpeaking(false);
      }, speakingDuration);
    }, 1500);
  };

  const handleClearConversation = () => {
    setConversation([]);
  };

  const handleCloseModal = () => {
  setShowModal(false);
};
  const [showModal, setShowModal] = useState(true);

  if (!isOpen) return null;

  return (
    
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F8F9FA] dark:bg-[#0F172A] bg-opacity-80 p-4">
   <div className="relative w-full h-[95vh] max-w-6xl mx-auto rounded-2xl bg-[#F8F9FA] dark:bg-[#0F172A] flex items-center justify-center">


    {/* Close Button */}
    <button
      onClick={handleCloseModal}
      className="absolute top-12 mt-60 right-4 text-gray-400 hover:text-gray-600 transition duration-200"
      aria-label="Close"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    {/* Mic Interface */}
    <div className="flex flex-col items-center justify-center space-y-6">

      {/* Mic Button with Animation */}
      <div
  className={`relative w-45 h-45 rounded-full border-1 flex items-center justify-center transition-all duration-500 ease-in-out
    ${
      isListening
        ? 'bg-blue-100 border-blue-300 animate-pulse ring-2 ring-blue-200'
        : isSpeaking
        ? 'bg-indigo-100 border-indigo-300'
        : isProcessing
        ? 'bg-green-100 border-green-300'
        : 'bg-blue-200 border-blue-300'
    }`}
>
    <img
    src="https://i.pinimg.com/originals/54/58/a1/5458a14ae4c8f07055b7441ff0f234cf.gif"
    alt="Voice activity"
    className="w-80 h-80 object-cover rounded-full"

  />
  {/* Icon */}
  {/* <div className="relative z-10 flex items-center justify-center">
    {isListening ? (
      <Mic size={48} className="text-black" />
    ) : isSpeaking ? (
      <Volume2 size={48} className="text-black" />
    ) : isProcessing ? (
      <div className="animate-spin">
        <MessageCircle size={48} className="text-black" />
      </div>
    ) : (
      <Mic size={48} className="text-black" />
    )}
  </div> */}

        {/* Ping Animation */}
        {(isListening || isSpeaking) && (
          <div className="absolute inset-0 rounded-full">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-full border-2 animate-ping border-blue-300"
                style={{
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '2s',
                }}
              />
            ))}
          </div>
        )}

   

        {/* Audio Bars */}
        {isListening && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-white rounded-full transition-all duration-100"
                style={{
                  height: `${Math.max(4, (audioLevel + i * 10) % 20)}px`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Status */}
      <div className="text-center">
        {isListening ? (
          <p className="text-blue-700 font-medium text-base animate-pulse">Listening...</p>
        ) : isSpeaking ? (
          <p className="text-blue-700 font-medium text-base animate-pulse">Speaking...</p>
        ) : isProcessing ? (
          <p className="text-blue-700 font-medium text-base">Processing...</p>
        ) : (
          <p className="text-blue-700 font-medium text-base">Tap mic to start</p>
        )}
      </div>

      {/* Transcript */}
      {/* {currentTranscript && (
        <div className="px-4 py-2 text-center bg-blue-600 text-white rounded-xl max-w-xs shadow-md">
          <p className="italic">"{currentTranscript}"</p>
        </div>
      )} */}

      {/* Controls */}
      <div className="flex space-x-4 mt-4">
        {!isListening ? (
          <button
            onClick={handleStartListening}
            disabled={isSpeaking || isProcessing}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium shadow-sm transition duration-200"
          >
            Start Speaking
          </button>
        ) : (
          <button
            onClick={handleStopListening}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-medium shadow-sm transition duration-200"
          >
            Stop
          </button>
        )}

        {conversation.length > 0 && (
          <button
            onClick={handleClearConversation}
            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full text-sm font-medium transition"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  </div>
</div>


  );
};

export default VoiceModal;