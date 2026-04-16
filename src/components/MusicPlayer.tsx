import React, { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2 } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Track } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyberpunk Skyline',
    artist: 'Neural Synth',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/cyberpunk/400/400',
  },
  {
    id: '2',
    title: 'Neon Pulse',
    artist: 'Digital Echo',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/neon/400/400',
  },
  {
    id: '3',
    title: 'Synthwave Dreams',
    artist: 'AI Composer v2',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/synth/400/400',
  },
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [seek, setSeek] = useState(0);
  const [duration, setDuration] = useState(0);
  const soundRef = useRef<Howl | null>(null);
  const seekIntervalRef = useRef<number | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.unload();
    }

    soundRef.current = new Howl({
      src: [currentTrack.url],
      html5: true,
      volume: volume,
      onplay: () => {
        setIsPlaying(true);
        setDuration(soundRef.current?.duration() || 0);
      },
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onend: () => handleNext(),
      onload: () => setDuration(soundRef.current?.duration() || 0),
    });

    if (isPlaying) {
      soundRef.current.play();
    }

    return () => {
      soundRef.current?.unload();
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    if (isPlaying) {
      seekIntervalRef.current = window.setInterval(() => {
        if (soundRef.current) {
          setSeek(soundRef.current.seek() as number);
        }
      }, 1000);
    } else {
      if (seekIntervalRef.current) clearInterval(seekIntervalRef.current);
    }
    return () => {
      if (seekIntervalRef.current) clearInterval(seekIntervalRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (!soundRef.current) return;
    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    soundRef.current?.volume(newVolume);
  };

  const handleSeekChange = (value: number[]) => {
    const newSeek = value[0];
    setSeek(newSeek);
    soundRef.current?.seek(newSeek);
  };

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full flex items-center justify-between gap-10">
      {/* Album Art & Info */}
      <div className="flex items-center gap-5 w-[300px] flex-shrink-0">
        <div className="relative w-16 h-16 flex-shrink-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentTrack.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full object-cover rounded-xl shadow-lg border border-border"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
        </div>
        <div className="flex flex-col overflow-hidden">
          <h3 className="text-sm font-bold text-white truncate tracking-tight">{currentTrack.title}</h3>
          <p className="text-text-dim text-xs font-medium truncate">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-8 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrev}
          className="text-text-dim hover:text-white hover:bg-white/5 rounded-full"
        >
          <SkipBack className="w-6 h-6" />
        </Button>
        <Button
          size="icon"
          onClick={togglePlay}
          className="w-12 h-12 bg-white text-black hover:bg-neon-cyan hover:scale-105 transition-all rounded-full shadow-lg shadow-white/10"
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          className="text-text-dim hover:text-white hover:bg-white/5 rounded-full"
        >
          <SkipForward className="w-6 h-6" />
        </Button>
      </div>

      {/* Seek Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-[400px]">
        <span className="text-[10px] font-mono text-text-dim w-10 text-right">{formatTime(seek)}</span>
        <div className="flex-1">
          <Slider
            value={[seek]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeekChange}
            className="cursor-pointer"
          />
        </div>
        <span className="text-[10px] font-mono text-text-dim w-10">{formatTime(duration)}</span>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3 w-32 flex-shrink-0">
        <Volume2 className="w-4 h-4 text-neon-cyan opacity-70" />
        <Slider
          value={[volume]}
          max={1}
          step={0.01}
          onValueChange={handleVolumeChange}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};
