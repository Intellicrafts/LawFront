import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  MessageCircle, 
  FileText, 
  Share2, 
  Settings, 
  Send,
  Paperclip,
  Users,
  Clock,
  Shield,
  Star,
  Download,
  ChevronDown,
  CircleDot,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Zap,
  Eye,
  Calendar,
  Award,
  CheckCircle,
  MessageSquare,
  FileImage,
  Camera,
  Smile,
  BookOpen,
  Bell,
  BellOff,
  Loader2
} from 'lucide-react';

export default function PersonalRoom() {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Advocate Sarah Wilson',
      message: 'Hello! I\'ve reviewed your case documents thoroughly. Let\'s discuss your legal options and next steps.',
      time: '10:30 AM',
      isAdvocate: true,
      type: 'text'
    },
    {
      id: 2,
      sender: 'You',
      message: 'Thank you for taking the time to review my case. I have some questions about the contract dispute.',
      time: '10:32 AM',
      isAdvocate: false,
      type: 'text'
    },
    {
      id: 3,
      sender: 'Advocate Sarah Wilson',
      message: 'Of course! I see there are several clauses that need attention. Let me share my screen to show you the specific sections.',
      time: '10:33 AM',
      isAdvocate: true,
      type: 'text'
    },
    {
      id: 4,
      sender: 'System',
      message: 'Document "Contract_Analysis.pdf" shared by Advocate Sarah Wilson',
      time: '10:34 AM',
      isAdvocate: true,
      type: 'file'
    }
  ]);
  const [sessionTime, setSessionTime] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState('excellent');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const qualities = ['excellent', 'good', 'fair'];
    const interval = setInterval(() => {
      setConnectionQuality(qualities[Math.floor(Math.random() * qualities.length)]);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages(prevMessages => {
        const newId = prevMessages.length + 1;
        const newMessage = {
          id: newId,
          sender: 'You',
          message: message,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAdvocate: false,
          type: 'text'
        };
        return [...prevMessages, newMessage];
      });
      setMessage('');
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const responses = [
          'I understand your concern. Let me explain the legal implications in detail.',
          'That\'s a valid point. Based on contract law, here\'s what we can do to strengthen your position.',
          'I\'ll need to review that clause more carefully. Can you provide more specific details about the timeline?',
          'This is indeed a complex matter. Let me share some relevant case precedents that support your case.',
          'Based on my experience with similar cases, I recommend we proceed with the following strategy.'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        setMessages(prevMessages => {
          const newId = prevMessages.length + 1;
          const advocateResponse = {
            id: newId,
            sender: 'Advocate Sarah Wilson',
            message: randomResponse,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isAdvocate: true,
            type: 'text'
          };
          return [...prevMessages, advocateResponse];
        });
      }, 2000);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionColor = () => {
    switch(connectionQuality) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-yellow-600';
      case 'fair': return 'text-orange-600';
      default: return 'text-red-600';
    }
  };

  const participants = [
    { 
      id: 1, 
      name: 'Advocate Sarah Wilson', 
      role: 'Senior Legal Counsel', 
      avatar: '👩‍💼', 
      active: true,
      expertise: ['Corporate Law', 'Contract Disputes'],
      rating: 4.9,
      cases: 150
    },
    { 
      id: 2, 
      name: 'You', 
      role: 'Client', 
      avatar: '👤', 
      active: true 
    },
    { 
      id: 3, 
      name: 'Legal Assistant Maya', 
      role: 'Research Assistant', 
      avatar: '👨‍💻', 
      active: false 
    }
  ];

  const handleEndSession = () => {
    console.log('End Session clicked');
  };

  const handleShareScreen = () => {
    console.log('Share screen clicked');
  };

  const handleDocuments = () => {
    console.log('Documents clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      <div className="h-4"></div>
      <div className="flex flex-col h-[calc(100vh-1rem)]">

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                
               
              </div>
              
           {/* ====================Top timer left ========================== */}
            </div>
            {/* ================== Profile top right corner ================ */}
            
          </div>
       
        <div className="flex-1 flex relative">
          <div className="flex-1 flex flex-col">
            <div className="flex-1 relative bg-gray-100 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-50"></div>
              <div className="relative w-full h-full flex items-center justify-center p-8">
                <div className="relative bg-white rounded-3xl shadow-md border border-gray-200 p-8 max-w-2xl w-full ">
                  <div className="text-center">
                    <div className="relative mb-6">
                      <div className="w-40 h-40 bg-blue-500 rounded-full mx-auto flex items-center justify-center shadow-xl ring-8 ring-blue-100">
                        <span className="text-6xl">👩‍💼</span>
                      </div>
                      <div className="absolute -bottom-2 -right-2 p-2 bg-green-600 rounded-full shadow-md">
                        <Video className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Advocate Sarah Wilson</h3>
                    <p className="text-blue-600 text-lg mb-4">Senior Legal Counsel</p>
                    <div className="flex items-center justify-center space-x-4 mb-6">
                      <div className="flex items-center space-x-1">
                        <Award className="w-5 h-5 text-yellow-500" />
                        <span className="text-gray-800 font-semibold">15+ Years</span>
                      </div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        <span className="text-gray-800 font-semibold">4.9 Rating</span>
                      </div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-800 font-semibold">150+ Wins</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <div className="px-4 py-2 bg-blue-100 border border-blue-200 rounded-full">
                        <span className="text-blue-600 text-sm font-medium">Corporate Law</span>
                      </div>
                      <div className="px-4 py-2 bg-blue-100 border border-blue-200 rounded-full">
                        <span className="text-blue-600 text-sm font-medium">Contract Disputes</span>
                      </div>
                      <div className="px-4 py-2 bg-blue-100 border border-blue-200 rounded-full">
                        <span className="text-blue-600 text-sm font-medium">Litigation</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-6 left-6 flex items-center space-x-2 px-4 py-2 mt-10 bg-gray-90 rounded-full shadow-md">
                  <Share2 className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-500 font-medium">Screen Sharing</span>
                     <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600 font-mono">{formatTime(sessionTime)}</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full">
                  <div className={`w-2 h-2 rounded-full ${connectionQuality === 'excellent' ? 'bg-green-600' : connectionQuality === 'good' ? 'bg-yellow-600' : 'bg-orange-600'} animate-pulse`}></div>
                  <span className={`text-sm font-medium ${getConnectionColor()}`}>
                    {connectionQuality.charAt(0).toUpperCase() + connectionQuality.slice(1)}
                  </span>
                </div>
                {isRecording && (
                  <div className="flex items-center space-x-2 px-3 py-1 bg-red-100 border border-red-200 rounded-full">
                    <CircleDot className="w-4 h-4 text-red-600 animate-pulse" />
                    <span className="text-sm text-red-600 font-medium">Recording</span>
                  </div>
                )}
              </div>
                </div>
                
                <div className="absolute top-6 right-6 flex items-center space-x-2 px-3 py-2 mt-10 bg-gray-200 rounded-full">
                  <div className="flex items-center space-x-4">
              <button
                onClick={() => setNotifications(!notifications)}
                aria-label={notifications ? "Disable notifications" : "Enable notifications"}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200"
              >
                {notifications ? 
                  <Bell className="w-5 h-5 text-blue-500" /> : 
                  <BellOff className="w-5 h-5 text-gray-500" />
                }
              </button>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-semibold text-gray-800">Advocate Sarah Wilson</p>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-yellow-500 font-medium">4.9</span>
                  </div>
                  <span className="text-gray-500">•</span>
                  <span className="text-green-600 font-medium">150+ cases won</span>
                </div>
              </div>
              <div className="relative">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ring-4 ring-blue-100">
                  SW
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-600 rounded-full border-2 border-white animate-pulse"></div>
              </div>
            </div>
                  <Zap className={`w-4 h-4 ${getConnectionColor()}`} />
                  <span className={`text-sm font-medium ${getConnectionColor()}`}>
                    {connectionQuality}
                  </span>
                </div>
              </div>
              <div className="absolute bottom-6 right-6 w-64 h-40 bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-md">
                <div className="w-full h-full relative">
                 <div
  className="absolute inset-0 bg-pink-50 bg-cover bg-center"
  style={{ backgroundImage: "url('https://t4.ftcdn.net/jpg/09/70/14/35/360_F_970143501_JklW6K2we4ML4Dsx6PR7AeWVA8VXcDvs.jpg')" }}
></div>

                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center shadow-md">
                        <span className="text-2xl">👤</span>
                      </div>
                      <p className="text-gray-800 font-medium">You</p>
                      <p className="text-xs text-gray-500">Client</p>
                    </div>
                  </div>
                  {!isVideoOn && (
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                      <VideoOff className="w-8 h-8 text-gray-500" />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2">
                    {isAudioOn ? (
                      <div className="p-1 bg-green-600 rounded-full">
                        <Mic className="w-3 h-3 text-white" />
                      </div>
                    ) : (
                      <div className="p-1 bg-red-600 rounded-full">
                        <MicOff className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                    className="absolute bottom-2 right-2 p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                  >
                    {isFullscreen ? 
                      <Minimize2 className="w-3 h-3 text-gray-600" /> : 
                      <Maximize2 className="w-3 h-3 text-gray-600" />
                    }
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white border-t border-gray-200 px-6 py-2 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    aria-label={isVideoOn ? "Turn off camera" : "Turn on camera"}
                    className={`group relative p-4 rounded-xl transition-all duration-300 ${
                      isVideoOn 
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-600 shadow-sm' 
                        : 'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-200/50'
                    }`}
                  >
                    {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {isVideoOn ? 'Turn off camera' : 'Turn on camera'}
                    </div>
                  </button>
                  <button
                    onClick={() => setIsAudioOn(!isAudioOn)}
                    aria-label={isAudioOn ? "Mute microphone" : "Unmute microphone"}
                    className={`group relative p-4 rounded-xl transition-all duration-300 ${
                      isAudioOn 
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-600 shadow-sm' 
                        : 'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-200/50'
                    }`}
                  >
                    {isAudioOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {isAudioOn ? 'Mute' : 'Unmute'}
                    </div>
                  </button>
                  <button
                    onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                    aria-label={isSpeakerOn ? "Mute speaker" : "Unmute speaker"}
                    className="group relative p-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-300 shadow-sm"
                  >
                    {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {isSpeakerOn ? 'Mute speaker' : 'Unmute speaker'}
                    </div>
                  </button>
                  <button
                    onClick={handleShareScreen}
                    aria-label="Share screen"
                    className="group relative p-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-300 shadow-sm"
                  >
                    <Share2 className="w-6 h-6" />
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Share screen
                    </div>
                  </button>
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    aria-label={isRecording ? "Stop recording" : "Start recording"}
                    className={`group relative p-4 rounded-xl transition-all duration-300 ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-200/50' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600 shadow-sm'
                    }`}
                  >
                    <CircleDot className={`w-6 h-6 ${isRecording ? 'animate-pulse' : ''}`} />
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {isRecording ? 'Stop recording' : 'Start recording'}
                    </div>
                  </button>
                  <button
                    onClick={handleDocuments}
                    aria-label="Open documents"
                    className="group relative p-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-300 shadow-sm"
                  >
                    <FileText className="w-6 h-6" />
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Documents
                    </div>
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowParticipants(!showParticipants)}
                    aria-label="Show participants"
                    className="group relative p-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-300 shadow-sm"
                  >
                    <Users className="w-6 h-6" />
                    <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {participants.filter(p => p.active).length}
                    </span>
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Participants
                    </div>
                  </button>
                  <button
                    onClick={() => setShowChat(!showChat)}
                    aria-label="Toggle chat"
                    className="group relative p-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 shadow-md shadow-blue-200/50"
                  >
                    <MessageCircle className="w-6 h-6" />
                    {messages.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                        {messages.length}
                      </span>
                    )}
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Chat
                    </div>
                  </button>
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    aria-label="Open settings"
                    className="group relative p-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-300 shadow-sm"
                  >
                    <Settings className="w-6 h-6" />
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Settings
                    </div>
                  </button>
                  <button
                    onClick={handleEndSession}
                    aria-label="End session"
                    className="group relative px-6 py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 shadow-md shadow-red-200/50"
                  >
                    <Phone className="w-5 h-5" />
                    <span>End Session</span>
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      End consultation
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Chat Sidebar */}
          {showChat && (
            <div className="w-full sm:w-96 bg-white border-l border-gray-200 flex flex-col shadow-sm">
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                    <MessageSquare className="w-6 h-6 text-blue-500" />
                    <span>Consultation Chat</span>
                  </h3>
                  <button 
                    onClick={() => setShowChat(false)}
                    aria-label="Close chat"
                    className="text-gray-500 hover:text-gray-800 transition-colors p-1 rounded-lg hover:bg-gray-100"
                  >
                    <span className="text-xl">×</span>
                  </button>
                </div>
                
                {/* Participants in Chat Header */}
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-blue-600 mb-3">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="font-medium">Active Participants ({participants.filter(p => p.active).length})</span>
                  </div>
                  {participants.map(participant => (
                    <div key={participant.id} className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200">
                      <div className="relative">
                        <span className="text-2xl">{participant.avatar}</span>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${participant.active ? 'bg-green-600' : 'bg-gray-500'}`}></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">{participant.name}</p>
                        <p className="text-xs text-gray-500">{participant.role}</p>
                        {participant.expertise && (
                          <div className="flex space-x-1 mt-1">
                            {participant.expertise.slice(0, 2).map((skill, idx) => (
                              <span key={idx} className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {participant.rating && (
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-yellow-500 font-bold">{participant.rating}</span>
                          </div>
                          <p className="text-xs text-gray-500">{participant.cases} cases</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isAdvocate ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
                      msg.isAdvocate 
                        ? 'bg-gray-200 text-gray-800' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      <p className="text-sm font-medium mb-1">{msg.sender}</p>
                      {msg.type === 'text' ? (
                        <p className="text-sm">{msg.message}</p>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4" />
                          <a href="#" className="text-sm underline hover:text-blue-400">{msg.message}</a>
                        </div>
                      )}
                      <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-xs sm:max-w-md px-4 py-2 rounded-lg bg-gray-200 text-gray-800">
                      <p className="text-sm font-medium mb-1">Advocate Sarah Wilson</p>
                      <div className="flex space-x-1">
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></span>
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-800 transition-colors" aria-label="Attach file">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Type your message"
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    aria-label="Send message"
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  All communications are encrypted and confidential
                </p>
              </div>
            </div>
          )}

          {/* Settings Modal */}
          {showSettings && (
            <div className="fixed inset-0 bg-gray-800/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-gray-200 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                    <Settings className="w-6 h-6 text-blue-500" />
                    <span>Settings</span>
                  </h3>
                  <button 
                    onClick={() => setShowSettings(false)}
                    aria-label="Close settings"
                    className="text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    <span className="text-xl">×</span>
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800">Notifications</span>
                    <button
                      onClick={() => setNotifications(!notifications)}
                      aria-label={notifications ? "Disable notifications" : "Enable notifications"}
                      className={`p-2 rounded-lg ${notifications ? 'bg-green-600' : 'bg-gray-500'}`}
                    >
                      {notifications ? <Bell className="w-5 h-5 text-white" /> : <BellOff className="w-5 h-5 text-white" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800">Speaker</span>
                    <button
                      onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                      aria-label={isSpeakerOn ? "Mute speaker" : "Unmute speaker"}
                      className={`p-2 rounded-lg ${isSpeakerOn ? 'bg-green-600' : 'bg-gray-500'}`}
                    >
                      {isSpeakerOn ? <Volume2 className="w-5 h-5 text-white" /> : <VolumeX className="w-5 h-5 text-white" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800">Video Quality</span>
                    <select
                      className="bg-gray-100 text-gray-800 rounded-lg px-2 py-1 focus:outline-none"
                      aria-label="Select video quality"
                    >
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Participants Modal */}
          {showParticipants && (
            <div className="fixed inset-0 bg-gray-800/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-gray-200 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                    <Users className="w-6 h-6 text-blue-500" />
                    <span>Participants</span>
                  </h3>
                  <button 
                    onClick={() => setShowParticipants(false)}
                    aria-label="Close participants"
                    className="text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    <span className="text-xl">×</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {participants.map(participant => (
                    <div key={participant.id} className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50">
                      <div className="relative">
                        <span className="text-2xl">{participant.avatar}</span>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${participant.active ? 'bg-green-600' : 'bg-gray-500'}`}></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">{participant.name}</p>
                        <p className="text-xs text-gray-500">{participant.role}</p>
                        {participant.expertise && (
                          <div className="flex space-x-1 mt-1">
                            {participant.expertise.map((skill, idx) => (
                              <span key={idx} className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {participant.rating && (
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-yellow-500 font-bold">{participant.rating}</span>
                          </div>
                          <p className="text-xs text-gray-500">{participant.cases} cases</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}