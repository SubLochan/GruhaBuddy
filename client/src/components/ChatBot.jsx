import { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm GruhaBuddy. How can I help you design your space today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Call Backend API
        fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: input })
        })
            .then(res => res.json())
            .then(data => {
                const botResponse = data.reply || "Sorry, I didn't get that.";
                setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
            })
            .catch(err => {
                console.error(err);
                setMessages(prev => [...prev, { text: "Network error. Please try again.", sender: 'bot' }]);
            });
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-105"
                >
                    <MessageSquare className="h-6 w-6" />
                </button>
            )}

            {isOpen && (
                <div className="bg-white rounded-lg shadow-xl w-80 sm:w-96 flex flex-col h-96 border border-gray-200">
                    <div className="bg-primary-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                        <h3 className="font-medium">GruhaBuddy Assistant</h3>
                        <button onClick={toggleChat} className="hover:text-gray-200">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${msg.sender === 'user'
                                    ? 'bg-primary-600 text-white rounded-br-none'
                                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t border-gray-200">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type a message..."
                                className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                            />
                            <button onClick={handleSend} className="bg-primary-600 text-white p-2 rounded-md hover:bg-primary-700">
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
