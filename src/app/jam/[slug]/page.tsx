import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllSongSlugs, getSongBySlug, getAllSongs } from "@/lib/songs.server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Music, Tag, SkipForward, Clock, User } from "lucide-react";

export function generateStaticParams() {
  return getAllSongSlugs().map((slug) => ({ slug }));
}

type SectionType = "chords" | "lyrics" | "info";

export default function JamSongPage({ params }: { params: { slug: string } }) {
  const song = getSongBySlug(params.slug);
  if (!song) return notFound();

  // Get all songs to find next song
  const allSongs = getAllSongs();
  const currentIndex = allSongs.findIndex(s => s.slug === params.slug);
  const nextSong = currentIndex >= 0 && currentIndex < allSongs.length - 1 ? allSongs[currentIndex + 1] : null;

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
      const chordPattern = /[A-G][#b]?(m|maj|min|dim|aug|sus|add)?[0-9]?(\/[A-G][#b]?)?/g;
      const chords = trimmed.match(chordPattern);
      
      // If line contains chords (either standalone or mixed with text)
      if (chords && chords.length > 0) {
        // If it's mostly chords or has chord progression pattern
        const chordRatio = chords.join('').length / trimmed.length;
        const hasChordProgression = /^[A-G][#b]?(m|maj|min|dim|aug|sus|add)?[0-9]?(\/[A-G][#b]?)?\s+[A-G][#b]?(m|maj|min|dim|aug|sus|add)?[0-9]?(\/[A-G][#b]?)?/.test(trimmed);
        
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

  // Function to render line with inline chord chips
  const renderLineWithChords = (line: string) => {
    // Improved regex to capture complete chords including "m"
    const chordPattern = /[A-G][#b]?(m|maj|min|dim|aug|sus|add)?[0-9]?(\/[A-G][#b]?)?/g;
    const parts = line.split(chordPattern);
    const chords = line.match(chordPattern) || [];
    
    return (
      <div className="flex flex-wrap items-center gap-0.5 leading-relaxed">
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {chords[index] && (
              <span className="inline-block bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-sm font-bold px-2 py-1 rounded-md mx-1 shadow-sm">
                {chords[index]}
              </span>
            )}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <main className="container mx-auto max-w-4xl py-6 px-4">
        {/* Modern Header with Gradient Background */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl"></div>
          <div className="relative p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
            {/* Navigation Bar */}
            <div className="flex items-center justify-between mb-6">
              <Link 
                href="/library" 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-background/80 hover:bg-background transition-all duration-200 text-sm font-medium border border-border/50 hover:border-border"
              >
                <ArrowLeft className="h-4 w-4" />
                Library
              </Link>
              {nextSong && (
                <Link href={`/jam/${nextSong.slug}`}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-background/80 hover:bg-background border-border/50 hover:border-border transition-all duration-200"
                  >
                    <SkipForward className="mr-2 h-4 w-4" />
                    Next: {nextSong.title}
                  </Button>
                </Link>
              )}
            </div>
            
            {/* Song Info */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-2">
                    {song.title}
                  </h1>
                  {song.artist && (
                    <div className="flex items-center gap-2 text-lg text-muted-foreground mb-4">
                      <User className="h-4 w-4" />
                      {song.artist}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
                    <Music className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Ready to Jam</span>
                  </div>
                </div>
              </div>
              
              {/* Tags and Difficulty */}
              <div className="flex items-center gap-3 flex-wrap">
                {song.difficulty && (
                  <Badge 
                    variant="secondary" 
                    className="px-3 py-1 text-sm font-medium bg-gradient-to-r from-green-100 to-green-200 text-green-800 dark:from-green-900 dark:to-green-800 dark:text-green-200 border-0"
                  >
                    <Clock className="mr-1 h-3 w-3" />
                    {song.difficulty}
                  </Badge>
                )}
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
        </div>

        {/* Song Content with Modern Styling */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/5 to-transparent rounded-2xl"></div>
          <div className="relative p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="prose prose-neutral max-w-none dark:prose-invert prose-lg">
              {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mb-6 last:mb-0">
                  {section.content.map((line, lineIndex) => (
                    <div key={lineIndex} className="mb-2 last:mb-0">
                      {renderLineWithChords(line)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


