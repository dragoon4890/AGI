import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ChatBoi = ({ color, className }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "how can i help u", sender: 'ai' },
    { text: "hehe", sender: 'me' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim() !== '') {
      const userMessage = input.trim();
      setMessages([...messages, { text: userMessage, sender: 'me' }]);
      setInput('');

      fetch('http://localhost:8000/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userMessage, description: "Analyze and give answers, do low iterations so my output is fast" }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          const serverMessage = data.response;
          setMessages(prevMessages => [...prevMessages, { text: serverMessage, sender: 'ai' }]);
        })
        .catch(error => {
          console.error('Error sending message:', error);
        });
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" color='green' size="sm" className={className}>
            Chat
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[1366px]">
          <DialogHeader>
            <DialogTitle className="z-99">
              <div className="flex flex-row items-center gap-3 flex-1 ml-6">
                <div className="rounded-[50%] bg-green-600 px-4 py-4"></div>
                <p className="font-semibold">Ai Stack</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="chat-window h-96 overflow-y-scroll inline-block  p-4 border border-input rounded-lg">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`border p-5 rounded mb-2 max-w-2xl ${
                  message.sender === 'ai' ? 'bg-white text-left' : 'bg-slate-100 text-right'
                }`}
                style={{
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  maxWidth: '100%', // Ensure messages don't overflow horizontally
                }}
              >
                {message.sender === 'ai' ? (
                  message.text
                ) : (
                  message.text
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <textarea
              className="chat-input-textarea w-[100%] border resize-none pl-[9px] rounded"
              placeholder="Type your message here"
              value={input}
              onChange={handleInputChange}
            ></textarea>
            <Button onClick={sendMessage} variant="default">
              Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatBoi;
