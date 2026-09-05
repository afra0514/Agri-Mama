import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Play, Pause, Copy, Check, ExternalLink } from 'lucide-react'; 
 
const AudioPlayer = ({ src, isUser }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const audioRef = useRef(null);

  const toggle = () => { 
    if(isPlaying) audioRef.current.pause(); 
    else audioRef.current.play(); 
    setIsPlaying(!isPlaying); 
  };
  
  const changeSpeed = () => {
    const next = speed === 1 ? 1.5 : speed === 1.5 ? 2 : 1;
    setSpeed(next);
    audioRef.current.playbackRate = next;
  };

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const upd = () => setCurrentTime(a.currentTime);
    const met = () => setDuration(a.duration);
    a.addEventListener('timeupdate', upd);
    a.addEventListener('loadedmetadata', met);
    a.addEventListener('ended', () => setIsPlaying(false));
    return () => { 
      a.removeEventListener('timeupdate', upd); 
      a.removeEventListener('loadedmetadata', met); 
    };
  }, []);

  return (
    <div className={`ms-audio-message-player ${isUser ? 'ms-player-user' : 'ms-player-ai'}`}>
      <audio ref={audioRef} src={src} />
      <button onClick={toggle} className="ms-audio-play-btn-main">
        {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
      </button>
      <div className="ms-audio-waveform-main">
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`ms-audio-bar-main ${currentTime/duration > i/12 ? 'ms-active' : ''}`} style={{height: `${Math.random()*12 + 8}px`}} />
        ))}
      </div>
      <div className="ms-audio-info-area">
        <button onClick={changeSpeed} className="ms-audio-speed-badge">{speed}x</button>
      </div>
    </div>
  );
};

const Message = ({ role, content, image, audio }) => {
  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);
  const hasContent = content && content.trim().length > 0;

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`ms-bubble ${isUser ? 'ms-bubble-user' : 'ms-bubble-ai'}`}>
      <div className="ms-bubble-header">
        <div className="ms-bubble-meta">{isUser ? 'You' : 'Agri Mama'}</div>
        
        {hasContent && !isUser && (
          <button className="ms-copy-btn" onClick={handleCopy} title="Copy message">
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
        )}
      </div>
      
      {image && (
        <div className="ms-bubble-image-container">
          <img src={image} alt="Upload" className="ms-bubble-image" />
        </div>
      )}
      
      {audio && <AudioPlayer src={audio} isUser={isUser} />}

      {hasContent && (
        <div className="ms-markdown-content">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ node, ...props }) => (
                <a 
                  {...props} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="ms-chat-link"
                >
                  {props.children}
                  {!isUser && <ExternalLink size={12} style={{ display: 'inline', marginLeft: '4px' }} />}
                </a>
              ),
              table: ({ node, ...props }) => (
                <div style={{ overflowX: 'auto', margin: '10px 0' }}>
                  <table {...props} style={{ width: '100%', borderCollapse: 'collapse' }} />
                </div>
              )
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default Message;