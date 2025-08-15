import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllSongSlugs, getSongBySlug } from "@/lib/songs.server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Music, Tag } from "lucide-react";

export function generateStaticParams() {
  return getAllSongSlugs().map((slug) => ({ slug }));
}

type SectionType = "chords" | "lyrics" | "info";

export default function JamSongPage({ params }: { params: { slug: string } }) {
  const song = getSongBySlug(params.slug);
  if (!song) return notFound();

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
    const chordPattern = /[A-G][#b]?(m|maj|min|dim|aug|sus|add)?[0-9]?(\/[A-G][#b]?)?/g;
    const parts = line.split(chordPattern);
    const chords = line.match(chordPattern) || [];
    
    return (
      <div className="flex flex-wrap items-center gap-1">
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {chords[index] && (
              <span className="inline-block bg-foreground text-background text-xs font-mono px-1 py-0.5 rounded mx-1">
                {chords[index]}
              </span>
            )}
          </span>
        ))}
      </div>
    );
  };

  return (
    <main className="container mx-auto max-w-5xl py-4">
      {/* Compact Header */}
      <div className="mb-4">
        <Link href="/library" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
          <ArrowLeft className="mr-1 h-3 w-3" />
          Back
        </Link>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">{song.title}</h1>
            {song.artist && (
              <p className="text-lg text-muted-foreground mb-2">{song.artist}</p>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              {song.difficulty && (
                <Badge variant="secondary" className="text-xs">
                  {song.difficulty}
                </Badge>
              )}
              {song.tags?.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  <Tag className="mr-1 h-2 w-2" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Music className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Ready</span>
          </div>
        </div>
      </div>

      {/* Compact Song Content */}
      <article className="prose prose-neutral max-w-none dark:prose-invert prose-sm">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-2">
            {section.content.map((line, lineIndex) => (
              <div key={lineIndex} className="mb-1">
                {renderLineWithChords(line)}
              </div>
            ))}
          </div>
        ))}
      </article>
    </main>
  );
}


