import { notFound } from "next/navigation";
import { getAllSongSlugs, getSongBySlug, getAllSongs } from "@/lib/songs.server";
import { JamSongClient } from "./JamSongClient";

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

  return (
    <JamSongClient
      song={song}
      filteredSongs={filteredSongs}
      currentIndex={currentIndex}
      searchParams={searchParams}
      sections={sections}
    />
  );
}


