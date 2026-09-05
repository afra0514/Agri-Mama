import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Trash2, Play, Pause } from 'lucide-react';

const AudioRecorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => { if (audioURL) URL.revokeObjectURL(audioURL); };
  }, [audioURL]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        onRecordingComplete(new File([audioBlob], "voice.wav", { type: 'audio/wav' }));
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) { alert("Mic Error"); }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      setIsRecording(false);
    }
  };

  const discard = () => {
    if (audioURL) URL.revokeObjectURL(audioURL);
    setAudioURL(null);
    setIsPlaying(false);
    onRecordingComplete(null);
  };

  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  useEffect(() => {
    if (!audioURL) return;
    const a = audioRef.current;
    const upd = () => setCurrentTime(a.currentTime);
    const met = () => setDuration(a.duration);
    a.addEventListener('timeupdate', upd);
    a.addEventListener('loadedmetadata', met);
    a.addEventListener('ended', () => setIsPlaying(false));
    return () => {
      if(a) { a.removeEventListener('timeupdate', upd); a.removeEventListener('loadedmetadata', met); }
    };
  }, [audioURL]);

  return (
    <div style={{display: 'flex', alignItems: 'center'}}>
      {!isRecording && !audioURL && (
        <button onClick={startRecording} type="button" className="ms-icon-btn"><Mic size={22} /></button>
      )}

      {isRecording && (
        <div className="ms-recorder-recording">
          <div className="ms-recording-dot"></div>
          <button onClick={stopRecording} type="button" style={{color: 'inherit', background: 'none', border: 'none', cursor: 'pointer'}}>
            <Square size={18} fill="currentColor" />
          </button>
        </div>
      )}

      {audioURL && !isRecording && (
        <div className="ms-audio-preview-container">
          <audio ref={audioRef} src={audioURL} style={{display: 'none'}} />
          <button onClick={() => { if(isPlaying) audioRef.current.pause(); else audioRef.current.play(); setIsPlaying(!isPlaying); }} type="button" className="ms-audio-play-btn-small">
            {isPlaying ? <Pause size={14} fill="currentColor"/> : <Play size={14} fill="currentColor"/>}
          </button>
          <div className="ms-audio-waveform-mini">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`ms-audio-bar-mini ${currentTime/duration > i/8 ? 'ms-active' : ''}`} />
            ))}
          </div>
          <span className="ms-audio-time-mini">{formatTime(currentTime)}</span>
          <button onClick={discard} type="button" className="ms-icon-btn" style={{color: '#9ca3af'}}>
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;