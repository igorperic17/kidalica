"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Music, Tag, SkipForward, Clock, User, List, Play, Pause, Menu, X } from "lucide-react";
import type { Song } from "@/lib/songs.server";

type SectionType = "chords" | "lyrics" | "info";

interface JamSongClientProps {
  song: Song;
  filteredSongs: Song[];
  currentIndex: number;
  searchParams: { queue?: string; difficulty?: string; query?: string };
  sections: { type: SectionType; content: string[] }[];
}

export function JamSongClient({ 
  song, 
  filteredSongs, 
  currentIndex, 
  searchParams, 
  sections 
}: JamSongClientProps) {
  const [autoscroll, setAutoscroll] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  // Create URL parameters for navigation
  const createQueueParams = () => {
    const params = new URLSearchParams();
    if (searchParams.queue) {
      params.set('queue', searchParams.queue);
    } else if (searchParams.difficulty) {
      params.set('difficulty', searchParams.difficulty);
    }
    if (searchParams.query) {
      params.set('query', searchParams.query);
    }
    return params.toString();
  };

  const prevSong = currentIndex > 0 ? filteredSongs[currentIndex - 1] : null;
  const nextSong = currentIndex >= 0 && currentIndex < filteredSongs.length - 1 ? filteredSongs[currentIndex + 1] : null;

  // Navigation functions
  const navigateToPrev = () => {
    const targetSlug = prevSong ? prevSong.slug : filteredSongs[filteredSongs.length - 1].slug;
    router.push(`/jam/${targetSlug}?${createQueueParams()}`);
  };

  const navigateToNext = () => {
    const targetSlug = nextSong ? nextSong.slug : filteredSongs[0].slug;
    router.push(`/jam/${targetSlug}?${createQueueParams()}`);
  };

  const scrollDown = () => {
    if (lyricsContainerRef.current) {
      lyricsContainerRef.current.scrollBy({
        top: 100,
        behavior: 'smooth'
      });
    }
  };

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          navigateToPrev();
          break;
        case 'ArrowRight':
          event.preventDefault();
          navigateToNext();
          break;
        case ' ':
          event.preventDefault();
          scrollDown();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, filteredSongs, searchParams]);

  // Chord color mapping for better visual distinction
  const getChordColor = (chord: string) => {
    const baseChord = chord.replace(/[#b]/g, '').replace(/[0-9]/g, '').replace(/\/.*$/, '');
    const isMinor = chord.includes('m') && !chord.includes('maj');
    const isDiminished = chord.includes('dim');
    const isAugmented = chord.includes('aug');
    const isSuspended = chord.includes('sus');
    const isSeventh = chord.includes('7');
    const isNinth = chord.includes('9');
    
    // Color scheme based on chord type and root note - subtle semi-transparent gradients
    const chordColors = {
      // Major chords - subtle warm colors
      'C': 'from-blue-400/20 to-blue-500/30 border-blue-400/40',
      'D': 'from-green-400/20 to-green-500/30 border-green-400/40', 
      'E': 'from-yellow-400/20 to-yellow-500/30 border-yellow-400/40',
      'F': 'from-purple-400/20 to-purple-500/30 border-purple-400/40',
      'F#': 'from-purple-500/20 to-purple-600/30 border-purple-500/40',
      'G': 'from-red-400/20 to-red-500/30 border-red-400/40',
      'A': 'from-indigo-400/20 to-indigo-500/30 border-indigo-400/40',
      'B': 'from-pink-400/20 to-pink-500/30 border-pink-400/40',
      'H': 'from-pink-400/20 to-pink-500/30 border-pink-400/40', // German notation for B
      
      // Minor chords - subtle cooler colors
      'Cm': 'from-blue-500/20 to-blue-600/30 border-blue-500/40',
      'Dm': 'from-green-500/20 to-green-600/30 border-green-500/40',
      'Em': 'from-yellow-500/20 to-yellow-600/30 border-yellow-500/40',
      'Fm': 'from-purple-500/20 to-purple-600/30 border-purple-500/40',
      'F#m': 'from-purple-600/20 to-purple-700/30 border-purple-600/40',
      'Gm': 'from-red-500/20 to-red-600/30 border-red-500/40',
      'Am': 'from-indigo-500/20 to-indigo-600/30 border-indigo-500/40',
      'Bm': 'from-pink-500/20 to-pink-600/30 border-pink-500/40',
      'Hm': 'from-pink-500/20 to-pink-600/30 border-pink-500/40', // German notation for Bm
      
      // Special chord types - subtle variations
      'dim': 'from-gray-500/20 to-gray-600/30 border-gray-500/40',
      'aug': 'from-orange-400/20 to-orange-500/30 border-orange-400/40',
      'sus': 'from-teal-400/20 to-teal-500/30 border-teal-400/40',
      '7': 'from-amber-400/20 to-amber-500/30 border-amber-400/40',
      '9': 'from-rose-400/20 to-rose-500/30 border-rose-400/40',
    };
    
    // Determine the color based on chord characteristics
    if (isDiminished) return chordColors['dim'];
    if (isAugmented) return chordColors['aug'];
    if (isSuspended) return chordColors['sus'];
    if (isNinth) return chordColors['9'];
    if (isSeventh) return chordColors['7'];
    
    // Check for exact match first
    if (chordColors[chord as keyof typeof chordColors]) {
      return chordColors[chord as keyof typeof chordColors];
    }
    
    // Check for minor chord
    if (isMinor) {
      const minorChord = baseChord + 'm';
      if (chordColors[minorChord as keyof typeof chordColors]) {
        return chordColors[minorChord as keyof typeof chordColors];
      }
    }
    
    // Default to major chord color
    return chordColors[baseChord as keyof typeof chordColors] || 'from-primary/20 to-primary/30 border-primary/40';
  };

  // Function to render line with inline chord chips
  const renderLineWithChords = (line: string) => {
    // Simple and robust regex to match all chord patterns
    // Matches any chord that starts with A-G or H, followed by optional modifiers
    // Include H for German notation (H = B in English notation)
    // This should catch all chord variations regardless of spacing
    const chordPattern = /\b([A-GH][#b]?(?:m|maj|min|dim|aug|sus|add)?[0-9]?(?:\/[A-GH][#b]?)?)\b/g;
    
    let lastIndex = 0;
    const parts: (string | { chord: string; index: number })[] = [];
    let match;
    
    while ((match = chordPattern.exec(line)) !== null) {
      // Add text before the chord
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index));
      }
      
      // Add the chord (without the leading space)
      parts.push({ chord: match[1], index: match.index });
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex));
    }
    
    return (
      <div className="flex flex-wrap items-center gap-0.5 leading-tight">
        {parts.map((part, index) => {
          if (typeof part === 'string') {
            return <span key={index}>{part}</span>;
          } else {
            const chordColor = getChordColor(part.chord);
            const [gradient, border] = chordColor.split(' ');
            return (
              <span key={index}>
                <span className={`inline-block bg-gradient-to-r ${gradient} border ${border} text-white text-xs font-semibold px-2 py-0.5 rounded-lg mx-0.5 transition-all duration-200 backdrop-blur-sm tech-glow hover:scale-105`}>
                  {part.chord}
                </span>
              </span>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto max-w-7xl py-2 px-2 sm:py-6 sm:px-4">
        <div className="flex gap-2 sm:gap-6 h-[calc(100vh-1rem)] sm:h-[calc(100vh-3rem)]">
          {/* Left Sidebar - Song Queue */}
          <div className={`${sidebarOpen ? 'block' : 'hidden'} sm:block w-full sm:w-80 flex-shrink-0 absolute sm:relative z-50 sm:z-auto bg-slate-900/95 sm:bg-transparent backdrop-blur-xl sm:backdrop-blur-none`}>
            <div className="relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl"></div>
              <div className="relative p-4 sm:p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm h-full flex flex-col">
                {/* Mobile Close Button */}
                <div className="sm:hidden mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(false)}
                    className="absolute top-2 right-2 p-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Back Button */}
                <div className="mb-4 sm:mb-6">
                  <Link 
                    href="/jam" 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-background/80 hover:bg-background transition-all duration-200 text-sm font-medium border border-border/50 hover:border-border"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Jam
                  </Link>
                </div>
                
                {/* Song Info */}
                <div className="space-y-4 mb-6">
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-2">
                      {song.title}
                    </h1>
                    {song.artist && (
                      <div className="flex items-center gap-2 text-base text-muted-foreground mb-4">
                        <User className="h-4 w-4" />
                        {song.artist}
                      </div>
                    )}
                  </div>
                  
                  {/* Tags and Difficulty */}
                  <div className="space-y-3">
                    {song.difficulty && (
                      <Badge 
                        variant="secondary" 
                        className="px-3 py-1 text-sm font-medium bg-gradient-to-r from-green-100 to-green-200 text-green-800 dark:from-green-900 dark:to-green-800 dark:text-green-200 border-0"
                      >
                        <Clock className="mr-1 h-3 w-3" />
                        {song.difficulty}
                      </Badge>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {song.tags?.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className="px-3 py-1 text-sm font-medium border-border/50 bg-background/50"
                        >
                          <Tag className="mr-1 h-3 w-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Song Queue */}
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-2 mb-3">
                    <List className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Jam Queue ({filteredSongs.length})
                    </h3>
                  </div>
                  <div className="space-y-1 overflow-y-auto h-full pr-2">
                    {filteredSongs.map((songItem, index) => {
                      const isCurrent = songItem.slug === song.slug;
                      return (
                        <Link
                          key={songItem.slug}
                          href={`/jam/${songItem.slug}?${createQueueParams()}`}
                          className={`block p-3 rounded-lg transition-all duration-200 ${
                            isCurrent
                              ? 'bg-primary/20 border border-primary/30 text-primary'
                              : 'bg-background/50 hover:bg-background/80 border border-border/30 hover:border-border/50 text-foreground'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                                  isCurrent 
                                    ? 'bg-primary text-primary-foreground' 
                                    : 'bg-muted text-muted-foreground'
                                }`}>
                                  #{index + 1}
                                </span>
                                <h4 className={`text-sm font-medium truncate ${
                                  isCurrent ? 'text-primary' : 'text-foreground'
                                }`}>
                                  {songItem.title}
                                </h4>
                              </div>
                              {songItem.artist && (
                                <p className="text-xs text-muted-foreground truncate">
                                  {songItem.artist}
                                </p>
                              )}
                            </div>
                            {songItem.difficulty && (
                              <Badge 
                                variant="outline" 
                                className={`text-xs px-2 py-0.5 ml-2 ${
                                  isCurrent 
                                    ? 'border-primary/30 text-primary' 
                                    : 'border-border/50 text-muted-foreground'
                                }`}
                              >
                                {songItem.difficulty}
                              </Badge>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Song Content */}
          <div className="flex-1">
            <div className="relative h-full">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/8 via-transparent to-purple-500/8 rounded-2xl"
                   style={{
                     backgroundImage: `
                       radial-gradient(ellipse 200px 150px at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 60%),
                       radial-gradient(ellipse 180px 120px at 80% 80%, rgba(147, 51, 234, 0.12) 0%, transparent 55%),
                       radial-gradient(ellipse 160px 200px at 50% 50%, rgba(236, 72, 153, 0.08) 0%, transparent 65%),
                       radial-gradient(ellipse 140px 180px at 10% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                       radial-gradient(ellipse 120px 160px at 90% 30%, rgba(147, 51, 234, 0.08) 0%, transparent 45%),
                       radial-gradient(ellipse 100px 140px at 70% 10%, rgba(236, 72, 153, 0.06) 0%, transparent 40%)
                     `
                   }}></div>
              <div ref={lyricsContainerRef} className="relative p-4 sm:p-8 rounded-2xl border border-blue-500/25 bg-slate-900/80 backdrop-blur-xl h-full overflow-y-auto"
                   style={{
                     boxShadow: `
                       0 0 20px rgba(59, 130, 246, 0.15),
                       inset 0 1px 0 rgba(255, 255, 255, 0.1)
                     `
                   }}>
                {/* Song Header */}
                <div className="sticky top-0 z-10 bg-slate-900/90 backdrop-blur-xl border-b border-blue-500/25 pb-2 sm:pb-4 mb-4 sm:mb-6 -mx-4 sm:-mx-8 px-4 sm:px-8"
                     style={{
                       boxShadow: `
                         0 0 20px rgba(59, 130, 246, 0.1),
                         inset 0 1px 0 rgba(255, 255, 255, 0.1)
                       `
                     }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div>
                        <h1 className="text-lg sm:text-xl font-bold text-slate-100"
                            style={{
                              textShadow: '0 0 15px rgba(59, 130, 246, 0.3)'
                            }}>
                          {song.title}
                        </h1>
                        {song.artist && (
                          <p className="text-xs sm:text-sm text-slate-300">
                            {song.artist}
                          </p>
                        )}
                        <p className="text-xs text-slate-400 mt-1 hidden sm:block">
                          ← → to navigate • Space to scroll
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      {/* Mobile Menu Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSidebarOpen(true)}
                        className="sm:hidden bg-slate-900/80 hover:bg-slate-800 border-blue-500/30 hover:border-blue-400/50 transition-all duration-200 p-2"
                        style={{
                          boxShadow: '0 0 15px rgba(59, 130, 246, 0.1)'
                        }}
                      >
                        <Menu className="h-3 w-3" />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={navigateToPrev}
                        className="bg-slate-900/80 hover:bg-slate-800 border-blue-500/30 hover:border-blue-400/50 transition-all duration-200 p-2 sm:p-3"
                        style={{
                          boxShadow: '0 0 15px rgba(59, 130, 246, 0.1)'
                        }}
                      >
                        <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAutoscroll(!autoscroll)}
                        className={`bg-slate-900/80 hover:bg-slate-800 border-blue-500/30 hover:border-blue-400/50 transition-all duration-200 p-2 sm:p-3 ${
                          autoscroll ? 'text-blue-400 border-blue-400/50' : 'text-slate-300'
                        }`}
                        style={{
                          boxShadow: autoscroll 
                            ? '0 0 20px rgba(59, 130, 246, 0.2)' 
                            : '0 0 15px rgba(59, 130, 246, 0.1)'
                        }}
                      >
                        {autoscroll ? <Play className="h-3 w-3 sm:h-4 sm:w-4" /> : <Pause className="h-3 w-3 sm:h-4 sm:w-4" />}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={navigateToNext}
                        className="bg-slate-900/80 hover:bg-slate-800 border-blue-500/30 hover:border-blue-400/50 transition-all duration-200 p-2 sm:p-3"
                        style={{
                          boxShadow: '0 0 15px rgba(59, 130, 246, 0.1)'
                        }}
                      >
                        <SkipForward className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="prose prose-neutral max-w-none dark:prose-invert prose-lg">
                  {sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="mb-2 last:mb-0">
                      {section.content.map((line, lineIndex) => (
                        <div key={lineIndex} className="mb-0.5 last:mb-0">
                          {renderLineWithChords(line)}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
