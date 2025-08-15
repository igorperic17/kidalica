import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllSongSlugs, getSongBySlug, getAllSongs } from "@/lib/songs.server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Music, Tag, SkipForward, Clock, User, List } from "lucide-react";

export function generateStaticParams() {
  return getAllSongSlugs().map((slug) => ({ slug }));
}

type SectionType = "chords" | "lyrics" | "info";

export default function JamSongPage({ 
  params, 
  searchParams 
}: { 
  params: { slug: string };
  searchParams: { queue?: string; difficulty?: string; query?: string };
}) {
  const song = getSongBySlug(params.slug);
  if (!song) return notFound();

  // Get all songs and filter based on URL parameters
  const allSongs = getAllSongs();
  
  // Parse the queue from URL parameters
  let filteredSongs = allSongs;
  if (searchParams.queue) {
    try {
      const queueSlugs = JSON.parse(decodeURIComponent(searchParams.queue));
      filteredSongs = allSongs.filter(s => queueSlugs.includes(s.slug));
    } catch (e) {
      // If parsing fails, fall back to all songs
      filteredSongs = allSongs;
    }
  } else if (searchParams.difficulty || searchParams.query) {
    // Apply filters if no queue but filters are present
    filteredSongs = allSongs.filter(s => {
      const matchesDifficulty = !searchParams.difficulty || 
        searchParams.difficulty === 'any' || 
        s.difficulty === searchParams.difficulty;
      
      const matchesQuery = !searchParams.query || 
        s.title.toLowerCase().includes(searchParams.query.toLowerCase()) ||
        (s.artist && s.artist.toLowerCase().includes(searchParams.query.toLowerCase()));
      
      return matchesDifficulty && matchesQuery;
    });
  }

  // Find current song in the filtered queue
  const currentIndex = filteredSongs.findIndex(s => s.slug === params.slug);
  const nextSong = currentIndex >= 0 && currentIndex < filteredSongs.length - 1 ? filteredSongs[currentIndex + 1] : null;
  const prevSong = currentIndex > 0 ? filteredSongs[currentIndex - 1] : null;

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

  // Parse content into sections with improved chord detection
  const lines = song.content.split("\n");
  const sections: { type: SectionType; content: string[] }[] = [];
  let currentSection: { type: SectionType; content: string[] } = { type: "lyrics", content: [] };

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) {
      if (currentSection.content.length > 0) {
        sections.push({ ...currentSection, content: [...currentSection.content] });
        currentSection.content = [];
      }
    } else {
      // Improved chord detection - check if line contains chord patterns
      // Include H for German notation (H = B in English notation)
      const chordPattern = /[A-GH][#b]?(m|maj|min|dim|aug|sus|add)?[0-9]?(\/[A-GH][#b]?)?/g;
      const chords = trimmed.match(chordPattern);
      
      // If line contains chords (either standalone or mixed with text)
      if (chords && chords.length > 0) {
        // If it's mostly chords or has chord progression pattern
        const chordRatio = chords.join('').length / trimmed.length;
        const hasChordProgression = /^[A-GH][#b]?(m|maj|min|dim|aug|sus|add)?[0-9]?(\/[A-GH][#b]?)?\s+[A-GH][#b]?(m|maj|min|dim|aug|sus|add)?[0-9]?(\/[A-GH][#b]?)?/.test(trimmed);
        
        if (chordRatio > 0.3 || hasChordProgression) {
          if (currentSection.type !== "chords") {
            if (currentSection.content.length > 0) {
              sections.push({ ...currentSection, content: [...currentSection.content] });
            }
            currentSection = { type: "chords", content: [] };
          }
        }
      } else {
        if (currentSection.type !== "lyrics") {
          if (currentSection.content.length > 0) {
            sections.push({ ...currentSection, content: [...currentSection.content] });
          }
          currentSection = { type: "lyrics", content: [] };
        }
      }
      currentSection.content.push(line);
    }
  });

  if (currentSection.content.length > 0) {
    sections.push({ ...currentSection, content: [...currentSection.content] });
  }

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
      'G': 'from-red-400/20 to-red-500/30 border-red-400/40',
      'A': 'from-indigo-400/20 to-indigo-500/30 border-indigo-400/40',
      'B': 'from-pink-400/20 to-pink-500/30 border-pink-400/40',
      'H': 'from-pink-400/20 to-pink-500/30 border-pink-400/40', // German notation for B
      
      // Minor chords - subtle cooler colors
      'Cm': 'from-blue-500/20 to-blue-600/30 border-blue-500/40',
      'Dm': 'from-green-500/20 to-green-600/30 border-green-500/40',
      'Em': 'from-yellow-500/20 to-yellow-600/30 border-yellow-500/40',
      'Fm': 'from-purple-500/20 to-purple-600/30 border-purple-500/40',
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
    // More precise regex to match chords with proper spacing
    // Matches chords that are either:
    // 1. At the start of line followed by space or end of line
    // 2. Preceded by space and followed by space or end of line
    // 3. Preceded by space and at end of line
    // Include H for German notation (H = B in English notation)
    const chordPattern = /(?:^|\s)([A-GH][#b]?(?:m|maj|min|dim|aug|sus|add)?[0-9]?(?:\/[A-GH][#b]?)?)(?:\s|$)/g;
    
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
                <span className={`inline-block bg-gradient-to-r ${gradient} border ${border} text-foreground text-xs font-semibold px-2 py-0.5 rounded-lg mx-0.5 shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-sm`}>
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
      <div className="container mx-auto max-w-7xl py-6 px-4">
        <div className="flex gap-6 h-[calc(100vh-3rem)]">
          {/* Left Sidebar - Header */}
          <div className="w-80 flex-shrink-0">
            <div className="relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl"></div>
              <div className="relative p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm h-full flex flex-col">
                {/* Navigation Bar */}
                <div className="flex flex-col gap-4 mb-6">
                  <Link 
                    href="/jam" 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-background/80 hover:bg-background transition-all duration-200 text-sm font-medium border border-border/50 hover:border-border"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Jam
                  </Link>
                  <div className="flex gap-2">
                    <Link href={`/jam/${prevSong ? prevSong.slug : filteredSongs[filteredSongs.length - 1].slug}?${createQueueParams()}`}>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-background/80 hover:bg-background border-border/50 hover:border-border transition-all duration-200 flex-1"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Prev
                      </Button>
                    </Link>
                    <Link href={`/jam/${nextSong ? nextSong.slug : filteredSongs[0].slug}?${createQueueParams()}`}>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-background/80 hover:bg-background border-border/50 hover:border-border transition-all duration-200 flex-1"
                      >
                        <SkipForward className="mr-2 h-4 w-4" />
                        Next
                      </Button>
                    </Link>
                  </div>
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
                  
                  {/* Status */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
                      <Music className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">Ready to Jam</span>
                    </div>
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
                      const isCurrent = songItem.slug === params.slug;
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
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/5 to-transparent rounded-2xl"></div>
              <div className="relative p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm h-full overflow-y-auto">
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


