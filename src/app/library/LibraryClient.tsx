"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { filterSongs, type Song } from "@/lib/songs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Chip } from "@/components/ui/chip";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Filter } from "lucide-react";

export default function LibraryClient({ initialSongs }: { initialSongs: Song[] }) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<"any" | Song["difficulty"]>("any");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);

  // Extract all unique tags and playlists
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    initialSongs.forEach(song => song.tags?.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [initialSongs]);

  const allPlaylists = useMemo(() => {
    const playlists = new Set<string>();
    initialSongs.forEach(song => song.playlist?.forEach(playlist => playlists.add(playlist)));
    return Array.from(playlists).sort();
  }, [initialSongs]);

  const songs = useMemo(() => 
    filterSongs(initialSongs, { 
      query, 
      difficulty,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      playlist: selectedPlaylists.length > 0 ? selectedPlaylists[0] : undefined
    }), 
    [initialSongs, query, difficulty, selectedTags, selectedPlaylists]
  );

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const togglePlaylist = (playlist: string) => {
    setSelectedPlaylists(prev => 
      prev.includes(playlist) 
        ? prev.filter(p => p !== playlist)
        : [...prev, playlist]
    );
  };

  return (
    <main className="container mx-auto py-8">
      {/* Sticky Filters */}
      <div className="sticky top-14 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b pb-4 mb-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Library</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              {songs.length} songs
            </div>
          </div>
          
          {/* Search and Difficulty */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search title or artist..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
            >
              <option value="any">Any difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Tags</span>
              <ScrollArea className="w-full">
                <div className="flex gap-2 pb-2">
                  {allTags.map((tag) => (
                    <Chip
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Chip>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Playlists */}
          {allPlaylists.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Playlists</span>
              <ScrollArea className="w-full">
                <div className="flex gap-2 pb-2">
                  {allPlaylists.map((playlist) => (
                    <Chip
                      key={playlist}
                      variant={selectedPlaylists.includes(playlist) ? "default" : "outline"}
                      onClick={() => togglePlaylist(playlist)}
                    >
                      {playlist}
                    </Chip>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>

      {/* Song Grid */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {songs.map((song) => (
          <Card key={song.slug} className="group hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="group-hover:text-primary transition-colors">{song.title}</span>
                {song.difficulty && <Badge variant="secondary">{song.difficulty}</Badge>}
              </CardTitle>
              <CardDescription>{song.artist}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {song.tags?.slice(0, 3).map((t) => (
                  <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                ))}
                {song.playlist?.slice(0, 2).map((p) => (
                  <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                ))}
              </div>
              <Link href={`/jam/${song.slug}`}>
                <Button size="sm">Jam</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </section>

      {songs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No songs match your filters.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setQuery("");
              setDifficulty("any");
              setSelectedTags([]);
              setSelectedPlaylists([]);
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </main>
  );
}


