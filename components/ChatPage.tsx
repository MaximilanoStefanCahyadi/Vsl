import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Sparkles, Instagram, X } from 'lucide-react';
import { ASSETS } from '../assets/images';

interface ChatPageProps {
  onComplete: () => void;
}

type MessageType = 'text' | 'sticker'; // Removed ig-box from message types
type Sender = 'bot' | 'user';

interface Message {
  id: string;
  type: MessageType;
  content: string; // Text content or Image URL
  sender: Sender;
}

const LOVE_LETTER = [
  "First of all, I’m truly grateful to have met someone as thoughtful and meticulous as you.",
  "You’ve become such an incredible person, even if you don’t always see it yourself. And “incredible” isn’t just about academics or achievements. It’s about who you are—resilient, steady, and carrying yourself with a quiet kind of elegance.",
  "I hope you continue to shine wherever life takes you in your new environment and in every unknown you’re about to face. Maybe I’m just someone cheering from the sidelines, but every time you accomplish something, I can’t help but feel proud and genuinely happy for you.",
  "Perhaps I’m only an admirer from a distance. Still, even from afar, you remain like a calm, radiant moon—steady and beautiful in your own way.",
  "Keep your spirit strong through every challenge that comes your way. I know things won’t always be easy, but the Sharon I know is more than capable of overcoming them all."
];

const ChatPage: React.FC<ChatPageProps> = ({ onComplete }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [optionState, setOptionState] = useState<'initial' | 'confirmation'>('initial');
  const [isTyping, setIsTyping] = useState(false);
  
  // State for the Final Pop-up
  const [showPopup, setShowPopup] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const addMessage = (content: string, sender: Sender, type: MessageType = 'text') => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random(),
      content,
      sender,
      type
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const botDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Initial Sequence
  useEffect(() => {
    const runSequence = async () => {
      // Message 1
      setIsTyping(true);
      await botDelay(2000); 
      setIsTyping(false);
      addMessage("Hey there! I want to say something.", 'bot');
      
      await botDelay(2500); // Read time for msg 1
      
      // Message 2
      setIsTyping(true);
      await botDelay(2000);
      setIsTyping(false);
      addMessage("Do you want to hear it?", 'bot');

      setShowOptions(true);
    };

    runSequence();
  }, []);

  const playLoveLetter = async () => {
    for (const paragraph of LOVE_LETTER) {
        setIsTyping(true);
        // Typing simulation: min 1.5s, plus time based on length
        await botDelay(Math.min(4000, 1500 + paragraph.length * 30)); 
        setIsTyping(false);
        addMessage(paragraph, 'bot');
        
        // Reading time calculation: slower reading speed (80ms/char), min 4s
        const readingDelay = Math.max(4000, paragraph.length * 80); 
        await botDelay(readingDelay);
    }
    
    // Happy sticker
    await botDelay(1000);
    setIsTyping(true);
    await botDelay(1500);
    setIsTyping(false);
    addMessage(ASSETS.STICKERS.HAPPY, 'bot', 'sticker');
    await botDelay(4000);
    
    // Final Sequence - The Twist
    setIsTyping(true);
    await botDelay(3000);
    setIsTyping(false);
    addMessage("Lastly, I know it's not fair that the only who talks here is FredBot right? I mean this is a chatbot that has to be two sides talking. So, I make this", 'bot');
    
    // The "Break" / Suspense
    // Long read time for previous message
    await botDelay(4000); 

    // Suspenseful typing, then show POPUP instead of message
    setIsTyping(true);
    await botDelay(3500); 
    setIsTyping(false);

    setShowPopup(true);
  };

  const handleOption = async (choice: 'yes' | 'no') => {
    setShowOptions(false);
    
    // User response
    if (optionState === 'initial') {
        if (choice === 'yes') {
            addMessage("Yes, please!", 'user');
            await botDelay(1000);

            setIsTyping(true);
            await botDelay(1500);
            setIsTyping(false);
            addMessage(ASSETS.STICKERS.HAPPY, 'bot', 'sticker');
            await botDelay(2500);
            await playLoveLetter();
        } else {
            addMessage("No thanks", 'user');
            await botDelay(1000);

            setIsTyping(true);
            await botDelay(1500);
            setIsTyping(false);
            addMessage(ASSETS.STICKERS.SAD, 'bot', 'sticker');
            await botDelay(2500);

            setIsTyping(true);
            await botDelay(2000);
            setIsTyping(false);
            addMessage("Really don't want to know?", 'bot');

            await botDelay(1000);
            setIsTyping(true);
            await botDelay(1000);
            setIsTyping(false);
            addMessage(ASSETS.STICKERS.CONFIRMATION, 'bot', 'sticker');
            
            setOptionState('confirmation');
            setShowOptions(true);
        }
    } else if (optionState === 'confirmation') {
        if (choice === 'yes') {
            // "Yes" here means "Yes, tell me" / changed mind
            addMessage("Okay, tell me!", 'user');
            await botDelay(1000);

            setIsTyping(true);
            await botDelay(1500);
            setIsTyping(false);
            addMessage(ASSETS.STICKERS.HAPPY, 'bot', 'sticker');
            await botDelay(2500);
            await playLoveLetter();
        } else {
            // "No" means really no
            addMessage("No, really", 'user');
            await botDelay(1000);

            setIsTyping(true);
            await botDelay(1500);
            setIsTyping(false);
            addMessage(ASSETS.STICKERS.SAD, 'bot', 'sticker');
            await botDelay(2500);

            setIsTyping(true);
            await botDelay(2000);
            setIsTyping(false);
            addMessage("I will still do it btw...", 'bot');

            await botDelay(1500);
            setIsTyping(true);
            await botDelay(1500);
            setIsTyping(false);
            addMessage(ASSETS.STICKERS.OOPS, 'bot', 'sticker');
            await botDelay(3000);
            await playLoveLetter();
        }
    }
  };

  const renderMessageContent = (msg: Message) => {
    if (msg.type === 'sticker') {
        return (
            <div className={`rounded-2xl overflow-hidden shadow-lg border-4 ${
                msg.sender === 'user' ? 'border-fred-pink' : 'border-white'
            }`}>
                <img src={msg.content} alt="sticker" className="w-48 h-auto object-cover bg-white" />
            </div>
        );
    }
    
    // Default text
    return (
        <div className={`px-5 py-3 rounded-2xl shadow-sm text-[15px] leading-relaxed relative ${
            msg.sender === 'user' 
                ? 'bg-fred-pink text-white rounded-br-none' 
                : 'bg-white text-gray-700 rounded-bl-none border border-gray-100'
        }`}>
            {msg.content}
        </div>
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-yellow-50 font-sans text-gray-800 relative overflow-hidden">
      
      {/* Decorative blurred blobs for more Yellow feeling */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-fred-yellow/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-fred-pink/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="w-full p-4 bg-white/80 backdrop-blur-md shadow-sm border-b border-yellow-100 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-fred-pink to-fred-yellow flex items-center justify-center text-white shadow-md">
                <Bot size={24} />
             </div>
             <div>
                <h3 className="font-bold text-gray-800 leading-tight">FredBot</h3>
                <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
                    <span className="text-xs text-gray-400 font-medium">Online</span>
                </div>
             </div>
        </div>
        <Sparkles className="text-fred-pink w-5 h-5" />
      </div>

      {/* Chat Area */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4 pb-32 z-10"
        ref={scrollRef}
      >
        {messages.map((msg) => (
            <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
                <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    
                    {renderMessageContent(msg)}
                    
                    <span className="text-[10px] text-gray-400 mt-1 px-1">
                        {msg.sender === 'bot' ? 'FredBot' : 'You'}
                    </span>
                </div>
            </motion.div>
        ))}

        {isTyping && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex justify-start w-full"
            >
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 flex items-center gap-1">
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </motion.div>
        )}
      </div>

      {/* Input Area / Options */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-white/90 backdrop-blur border-t border-yellow-100 z-30">
        <AnimatePresence mode="wait">
            {showOptions ? (
                <motion.div 
                    key="options"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="flex gap-3 justify-center"
                >
                    <button
                        onClick={() => handleOption('yes')}
                        className="flex-1 bg-fred-yellow hover:bg-yellow-400 text-gray-900 font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                    >
                        {optionState === 'initial' ? 'Yes, please!' : 'Okay, tell me!'}
                    </button>
                    <button
                        onClick={() => handleOption('no')}
                        className="flex-1 bg-white hover:bg-gray-50 text-gray-500 font-bold py-4 rounded-xl shadow border-2 border-gray-100 hover:border-gray-200 transition-all"
                    >
                         {optionState === 'initial' ? 'No thanks' : 'No, really'}
                    </button>
                </motion.div>
            ) : (
                 <motion.div 
                    key="input"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full flex gap-2 opacity-50 pointer-events-none"
                >
                    <div className="flex-1 h-12 bg-gray-100 rounded-full border border-gray-200" />
                    <div className="w-12 h-12 bg-fred-pink rounded-full flex items-center justify-center">
                        <Send className="text-white w-5 h-5" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* Modal Popup for IG Box */}
      <AnimatePresence>
        {showPopup && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            >
                <motion.div
                    initial={{ scale: 0.8, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-sm w-full cursor-pointer transform transition-transform hover:scale-105"
                    onClick={onComplete}
                >
                    {/* Instagram Gradient Header */}
                    <div className="bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 p-8 text-center text-white relative">
                         <div className="absolute top-4 left-4 opacity-60">
                            <Instagram size={24} />
                        </div>
                        <h3 className="font-bold text-2xl leading-tight drop-shadow-md mb-2">
                           How do you feel if we hang out sometimes?
                        </h3>
                    </div>

                    {/* Content */}
                    <div className="p-6 bg-white text-center">
                         <div className="bg-gray-100 rounded-full py-4 px-6 text-gray-500 text-base italic border border-gray-200 pointer-events-none">
                            Tap to reply...
                        </div>
                        <p className="text-xs text-gray-400 mt-4 animate-pulse">
                            Click this card to continue →
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ChatPage;