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
import { Search, Filter, Music, Clock, Tag } from "lucide-react";

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "hard": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
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
          <Link key={song.slug} href={`/jam/${song.slug}`} className="block">
            <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-0 shadow-sm bg-gradient-to-br from-background to-muted/20 cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors truncate">
                      {song.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                      <Music className="h-3 w-3" />
                      {song.artist}
                    </CardDescription>
                  </div>
                  {song.difficulty && (
                    <Badge 
                      variant="secondary" 
                      className={`text-xs font-medium ${getDifficultyColor(song.difficulty)}`}
                    >
                      {song.difficulty}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex gap-1 flex-wrap">
                  {song.tags?.slice(0, 2).map((t) => (
                    <Badge key={t} variant="outline" className="text-xs">
                      <Tag className="mr-1 h-2 w-2" />
                      {t}
                    </Badge>
                  ))}
                  {song.playlist?.slice(0, 1).map((p) => (
                    <Badge key={p} variant="secondary" className="text-xs">
                      {p}
                    </Badge>
                  ))}
                  {(song.tags?.length || 0) + (song.playlist?.length || 0) > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{(song.tags?.length || 0) + (song.playlist?.length || 0) - 3}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      {songs.length === 0 && (
        <div className="text-center py-12">
          <Music className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No songs match your filters.</p>
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


