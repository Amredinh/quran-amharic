import React, { useRef, useEffect, useState } from 'react';
import { useApp } from '../services/context';
import { Play, Pause, X, Volume2 } from 'lucide-react';

const GlobalAudioPlayer: React.FC = () => {
  const { audioPlayerState, stopAudio } = useApp();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (audioRef.current && audioPlayerState.currentUrl) {
      audioRef.current.src = audioPlayerState.currentUrl;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log("Auto-play prevented");
            setPaused(true);
        });
      }
      setPaused(false);
    }
  }, [audioPlayerState.currentUrl]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (paused) {
        audioRef.current.play();
        setPaused(false);
      } else {
        audioRef.current.pause();
        setPaused(true);
      }
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  if (!audioPlayerState.showPlayer) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-50 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 transition-colors">
      <audio 
        ref={audioRef} 
        onTimeUpdate={onTimeUpdate}
        onEnded={() => setPaused(true)}
      />
      
      <div className="flex-1 text-center md:text-left">
        <h4 className="font-bold text-gray-800 dark:text-white">{audioPlayerState.surahName}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">{audioPlayerState.reciterName}</p>
      </div>

      <div className="flex items-center space-x-4">
        <button onClick={togglePlay} className="p-3 bg-primary text-white rounded-full hover:bg-green-600 transition shadow-md">
          {paused ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
        </button>
        <button onClick={stopAudio} className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500">
          <X size={20} />
        </button>
      </div>

      <div className="w-full md:w-1/3 flex items-center space-x-2">
        <span className="text-xs text-gray-400">
           {audioRef.current ? formatTime(audioRef.current.currentTime) : "0:00"}
        </span>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={progress} 
          onChange={(e) => {
            const val = Number(e.target.value);
            if (audioRef.current) {
              audioRef.current.currentTime = (val / 100) * audioRef.current.duration;
            }
          }}
          className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary"
        />
         <span className="text-xs text-gray-400">
           {audioRef.current ? formatTime(audioRef.current.duration || 0) : "0:00"}
        </span>
      </div>
       <div className="hidden md:flex items-center text-gray-400">
        <Volume2 size={16} />
      </div>
    </div>
  );
};

const formatTime = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

export default GlobalAudioPlayer;