import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Sparkles } from 'lucide-react';
import { ASSETS } from '../assets/images';

interface ChatPageProps {
  onComplete: () => void;
}

type MessageType = 'text' | 'sticker';
type Sender = 'bot' | 'user';

interface Message {
  id: string;
  type: MessageType;
  content: string; // Text content or Image URL
  sender: Sender;
}

const ChatPage: React.FC<ChatPageProps> = ({ onComplete }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [optionState, setOptionState] = useState<'initial' | 'confirmation'>('initial');
  const [isTyping, setIsTyping] = useState(false);
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
      setIsTyping(true);
      await botDelay(1500);
      addMessage("Hey there! I want to say something.", 'bot');
      
      await botDelay(1500);
      addMessage("Do you want to hear it?", 'bot');
      setIsTyping(false);
      setShowOptions(true);
    };

    runSequence();
  }, []);

  const handleOption = async (choice: 'yes' | 'no') => {
    setShowOptions(false);
    
    // User response
    if (optionState === 'initial') {
        if (choice === 'yes') {
            addMessage("Yes!", 'user');
            setIsTyping(true);
            await botDelay(1000);
            addMessage(ASSETS.STICKERS.HAPPY, 'bot', 'sticker');
            await botDelay(2500);
            onComplete();
        } else {
            addMessage("No", 'user');
            setIsTyping(true);
            await botDelay(1000);
            addMessage(ASSETS.STICKERS.SAD, 'bot', 'sticker');
            await botDelay(1500);
            addMessage("Really don't want to know?", 'bot');
            addMessage(ASSETS.STICKERS.CONFIRMATION, 'bot', 'sticker');
            setIsTyping(false);
            setOptionState('confirmation');
            setShowOptions(true);
        }
    } else if (optionState === 'confirmation') {
        if (choice === 'yes') {
            // "Yes" here means "Yes, tell me" / changed mind
            addMessage("Okay, tell me!", 'user');
            setIsTyping(true);
            await botDelay(1000);
            addMessage(ASSETS.STICKERS.HAPPY, 'bot', 'sticker');
            await botDelay(2500);
            onComplete();
        } else {
            // "No" means really no
            addMessage("No, I'm good", 'user');
            setIsTyping(true);
            await botDelay(1000);
            addMessage(ASSETS.STICKERS.SAD, 'bot', 'sticker');
            await botDelay(1500);
            addMessage("I will still do it btw...", 'bot');
            await botDelay(1000);
            addMessage(ASSETS.STICKERS.OOPS, 'bot', 'sticker');
            await botDelay(3000);
            onComplete();
        }
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-yellow-50 font-sans text-gray-800 relative">
      
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
        className="flex-1 overflow-y-auto p-4 space-y-4 pb-32"
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
                <div className={`flex flex-col max-w-[80%] md:max-w-[60%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    
                    {msg.type === 'text' ? (
                        <div className={`px-5 py-3 rounded-2xl shadow-sm text-[15px] leading-relaxed relative ${
                            msg.sender === 'user' 
                                ? 'bg-fred-pink text-white rounded-br-none' 
                                : 'bg-white text-gray-700 rounded-bl-none border border-gray-100'
                        }`}>
                            {msg.content}
                        </div>
                    ) : (
                        <div className={`rounded-2xl overflow-hidden shadow-lg border-4 ${
                            msg.sender === 'user' ? 'border-fred-pink' : 'border-white'
                        }`}>
                            <img src={msg.content} alt="sticker" className="w-48 h-auto object-cover bg-white" />
                        </div>
                    )}
                    
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

    </div>
  );
};

export default ChatPage;