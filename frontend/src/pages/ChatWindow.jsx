import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { chatService } from '../services/api';
import Sidebar from '../components/Sidebar';
import Message from '../components/Message';
import FileUpload from '../components/FileUpload';
import AudioRecorder from '../components/AudioRecorder';
import { Loader2, ArrowUp, X, Square } from 'lucide-react'; 
 
const ChatWindow = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false); 
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [recorderKey, setRecorderKey] = useState(0);
  const [thinkingMsg, setThinkingMsg] = useState("Consulting Agri Data...");
  const [isGoogleSearch, setIsGoogleSearch] = useState(false);
  
  const chatEndRef = useRef(null);
  const streamingIntervalRef = useRef(null);

  useEffect(() => { 
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [messages]);

  const handleStop = () => {
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
    }
    setLoading(false);
    setIsStreaming(false);
  };

  const simulateStreaming = (fullText) => {
    setIsStreaming(true);
    let currentText = "";
    const words = fullText.split(" ");
    let i = 0;

    setMessages(prev => [...prev, { role: 'assistant', content: "" }]);

    streamingIntervalRef.current = setInterval(() => {
      if (i < words.length) {
        currentText += words[i] + " ";
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content = currentText;
          return updated;
        });
        i++;
      } else {
        clearInterval(streamingIntervalRef.current);
        setIsStreaming(false);
      }
    }, 40);
  };

  const fetchSessions = async () => {
    if (user?.userId) {
      try {
        const res = await chatService.getSessions(user.userId);
        setSessions(res.data);
      } catch (err) { console.error("Session load error:", err); }
    }
  };

  useEffect(() => { fetchSessions(); }, [user]);

  const startNewChat = () => {
    handleStop();
    setMessages([]);
    setActiveSessionId(null);
    setInput("");
    setSelectedFile(null);
    setSelectedAudio(null);
    setRecorderKey(prev => prev + 1);
  };

  const handleSessionClick = async (sessionId) => {
    handleStop();
    setLoading(true);
    setActiveSessionId(sessionId);
    try {
      const res = await axios.get(`http://localhost:5000/api/chat/session/${sessionId}`);
      setMessages(res.data);
    } catch (err) { console.error("Load messages error:", err); }
    setLoading(false);
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await axios.delete(`http://localhost:5000/api/chat/session/${sessionId}`);
      if (activeSessionId === sessionId) startNewChat();
      fetchSessions();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedFile && !selectedAudio) return;

    if (isGoogleSearch) setThinkingMsg("Performing Google Search Grounding...");
    else if (selectedFile) setThinkingMsg("Analyzing image...");
    else if (selectedAudio) setThinkingMsg("Transcribing your voice message...");
    else if (input.toLowerCase().includes("price") || input.toLowerCase().includes("দাম")) setThinkingMsg("Searching live market prices...");
    else if (input.toLowerCase().includes("research") || input.toLowerCase().includes("paper")) setThinkingMsg("Querying academic journals...");
    else setThinkingMsg("Consulting Agri Mama database...");

    let imageUrl = selectedFile ? URL.createObjectURL(selectedFile) : null;
    let audioUrl = selectedAudio ? URL.createObjectURL(selectedAudio) : null;

    const userMsg = { role: 'user', content: input.trim() || "", image: imageUrl, audio: audioUrl };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    const formData = new FormData();
    formData.append('message', input.trim() || "");
    formData.append('userId', user ? user.userId : "guest");
    formData.append('google_search_enabled', isGoogleSearch ? "true" : "false"); // G toggle state
    if (activeSessionId) formData.append('sessionId', activeSessionId);
    if (selectedFile) formData.append('file', selectedFile);
    else if (selectedAudio) formData.append('file', selectedAudio);

    setInput(""); setSelectedFile(null); setSelectedAudio(null); setRecorderKey(p => p+1);

    try {
      const res = await chatService.sendMessage(formData);
      setLoading(false);
      simulateStreaming(res.data.reply);

      if (!activeSessionId && res.data.sessionId) {
        setActiveSessionId(res.data.sessionId);
        fetchSessions();
      }
    } catch (err) { 
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection Error. Please check if your server is running.' }]);
      setLoading(false);
    }
  };

  return (
    <div className="cw-chat-wrapper">
      <Sidebar onNewChat={startNewChat} sessions={sessions} activeId={activeSessionId} onSessionClick={handleSessionClick} onDelete={handleDeleteSession} />
      <main className="cw-chat-area">
        <div className="cw-messages-list">
          {messages.length === 0 ? (
            <div className="cw-welcome-container">
              <h1 className="cw-welcome-text">How can I help you today?</h1>
            </div>
          ) : (
            <div className="cw-message-bubble-wrapper">
              {messages.map((m, i) => <Message key={i} {...m} />)}
              {loading && (
                <div className="cw-thinking-state">
                  <Loader2 className="animate-spin" size={20}/> 
                  <span className="cw-animate-pulse">{thinkingMsg}</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        <div className="cw-input-container">
          {(selectedFile || selectedAudio) && (
            <div className="cw-file-preview-wrapper">
              <div className="cw-file-tag">
                {selectedFile ? 'File Selected' : 'Voice Ready'}
                <X size={14} className="cw-icon-close" onClick={() => {setSelectedFile(null); setSelectedAudio(null); setRecorderKey(p => p+1);}} />
              </div>
            </div>
          )}
          
          <div className="cw-input-bar">
            <div 
              className={`cw-google-btn ${isGoogleSearch ? 'active' : ''}`}
              onClick={() => setIsGoogleSearch(!isGoogleSearch)}
              title={isGoogleSearch ? "Google Search ON" : "Google Search OFF"}
            >
              G
            </div>

            <FileUpload onFileSelect={setSelectedFile} />
            <AudioRecorder key={recorderKey} onRecordingComplete={setSelectedAudio} />
            
            <input 
              className="cw-chat-input-field" 
              value={input} 
              onChange={(e)=>setInput(e.target.value)} 
              onKeyDown={(e)=>e.key==='Enter' && !loading && !isStreaming && handleSend()} 
              placeholder={isGoogleSearch ? "Search Google for live facts..." : "Ask Agri Mama..."} 
              disabled={loading || isStreaming}
            />
            
            {(loading || isStreaming) ? (
              <button onClick={handleStop} className="cw-send-btn" style={{backgroundColor: '#ef4444'}}>
                <Square size={18} fill="currentColor"/>
              </button>
            ) : (
              <button onClick={handleSend} className="cw-send-btn">
                <ArrowUp size={20}/>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatWindow;