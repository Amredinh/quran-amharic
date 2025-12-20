import React, { useRef, useEffect, useState } from 'react';
import { useApp } from '../services/context';
import { Play, Pause, X, Volume2, SkipForward, SkipBack, Repeat, Repeat1 } from 'lucide-react';
import { SURAH_NAMES_EN } from '../constants';
import { getFullSurahAudioUrl } from '../services/quranService';

const GlobalAudioPlayer: React.FC = () => {
  const { audioPlayerState, stopAudio, playSurahAudio } = useApp();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one'>('none');

  useEffect(() => {
    if (audioRef.current && audioPlayerState.currentUrl) {
      audioRef.current.src = audioPlayerState.currentUrl;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => setPaused(true));
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

  const handleNext = () => {
    const nextId = audioPlayerState.surahId >= 114 ? 1 : audioPlayerState.surahId + 1;
    const surahName = SURAH_NAMES_EN[nextId - 1];
    const url = getFullSurahAudioUrl(audioPlayerState.reciterFolder, nextId);
    playSurahAudio(url, surahName, audioPlayerState.reciterName, nextId, audioPlayerState.reciterFolder);
  };

  const handlePrev = () => {
    const prevId = audioPlayerState.surahId <= 1 ? 114 : audioPlayerState.surahId - 1;
    const surahName = SURAH_NAMES_EN[prevId - 1];
    const url = getFullSurahAudioUrl(audioPlayerState.reciterFolder, prevId);
    playSurahAudio(url, surahName, audioPlayerState.reciterName, prevId, audioPlayerState.reciterFolder);
  };

  const handleEnded = () => {
    if (repeatMode === 'one' && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      handleNext();
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
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 shadow-[0_-10px_30px_-5px_rgba(0,0,0,0.1)] p-4 md:p-6 z-[60] animate-fade-in transition-all">
      <audio 
        ref={audioRef} 
        onTimeUpdate={onTimeUpdate}
        onEnded={handleEnded}
      />
      
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-4">
        
        {/* Info & Close */}
        <div className="w-full md:w-1/4 flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg shadow-green-500/20">
                    {audioPlayerState.surahId}
                </div>
                <div className="truncate">
                    <h4 className="font-bold text-gray-800 dark:text-white truncate">{audioPlayerState.surahName}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate font-medium">{audioPlayerState.reciterName}</p>
                </div>
            </div>
            <button onClick={stopAudio} className="md:hidden p-2 text-gray-400 hover:text-red-500 transition">
                <X size={20} />
            </button>
        </div>

        {/* Controls */}
        <div className="flex-1 w-full flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-6">
                <button 
                  onClick={() => setRepeatMode(repeatMode === 'none' ? 'one' : 'none')} 
                  className={`transition ${repeatMode === 'one' ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}
                >
                    {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
                </button>
                <button onClick={handlePrev} className="text-gray-500 hover:text-primary transition">
                    <SkipBack size={22} fill="currentColor" />
                </button>
                <button onClick={togglePlay} className="p-4 bg-primary text-white rounded-2xl hover:scale-110 transition shadow-xl shadow-green-500/30">
                    {paused ? <Play size={24} fill="currentColor" className="ml-1" /> : <Pause size={24} fill="currentColor" />}
                </button>
                <button onClick={handleNext} className="text-gray-500 hover:text-primary transition">
                    <SkipForward size={22} fill="currentColor" />
                </button>
                <button onClick={stopAudio} className="hidden md:block text-gray-400 hover:text-red-500 transition">
                    <X size={20} />
                </button>
            </div>

            <div className="w-full flex items-center space-x-3">
                <span className="text-[10px] font-bold text-gray-400 tabular-nums w-8 text-right">
                {audioRef.current ? formatTime(audioRef.current.currentTime) : "0:00"}
                </span>
                <div className="relative flex-1 group py-2 cursor-pointer">
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        step="0.1"
                        value={progress} 
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            if (audioRef.current) {
                            audioRef.current.currentTime = (val / 100) * (audioRef.current.duration || 0);
                            }
                        }}
                        className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary group-hover:h-2 transition-all"
                    />
                </div>
                <span className="text-[10px] font-bold text-gray-400 tabular-nums w-8">
                {audioRef.current ? formatTime(audioRef.current.duration || 0) : "0:00"}
                </span>
            </div>
        </div>

        {/* Volume - Desktop Only */}
        <div className="hidden md:flex w-1/4 justify-end items-center space-x-3">
            <Volume2 size={18} className="text-gray-400" />
            <input 
              type="range" 
              className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary" 
              onChange={(e) => { if(audioRef.current) audioRef.current.volume = Number(e.target.value)/100 }}
              defaultValue="80"
            />
        </div>
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