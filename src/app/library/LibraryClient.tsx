"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { filterSongs } from "@/lib/songs";
import type { Song } from "@/lib/songs.server";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Filter, Music, Tag } from "lucide-react";

export default function LibraryClient({ initialSongs }: { initialSongs: Song[] }) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<"any" | Song["difficulty"]>("any");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const songs = useMemo(() => filterSongs(initialSongs, { query, difficulty, tags: selectedTags }), [initialSongs, query, difficulty, selectedTags]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    initialSongs.forEach(song => {
      song.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [initialSongs]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
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

  // Create queue parameter for filtered songs
  const createQueueParams = () => {
    const queueSlugs = songs.map(s => s.slug);
    return `queue=${encodeURIComponent(JSON.stringify(queueSlugs))}`;
  };

  return (
    <main className="container mx-auto max-w-6xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Song Library</h1>
        <p className="text-muted-foreground">Browse and organize your guitar songs</p>
      </div>

      {/* Sticky Filters */}
      <div className="sticky top-20 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b pb-6 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search and Difficulty */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-3">
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
                <option value="any">Any Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            {songs.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                {songs.length} song{songs.length !== 1 ? 's' : ''} found
              </div>
            )}
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Tags</h3>
              <ScrollArea className="w-full">
                <div className="flex gap-2 pb-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                        selectedTags.includes(tag)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      <Tag className="inline mr-1 h-3 w-3" />
                      {tag}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>

      {/* Clear filters button */}
      {(query || difficulty !== "any" || selectedTags.length > 0) && (
        <div className="mb-6">
          <button
            onClick={() => {
              setQuery("");
              setDifficulty("any");
              setSelectedTags([]);
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Songs Grid */}
      {songs.length === 0 ? (
        <div className="text-center py-12">
          <Music className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No songs match your filters yet.</p>
          <button
            onClick={() => {
              setQuery("");
              setDifficulty("any");
              setSelectedTags([]);
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {songs.map((song) => (
            <Link key={song.slug} href={`/jam/${song.slug}?${createQueueParams()}`} className="block">
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
                    {song.tags?.slice(0, 3).map((t) => (
                      <Badge key={t} variant="outline" className="text-xs">
                        <Tag className="mr-1 h-2 w-2" />
                        {t}
                      </Badge>
                    ))}
                    {song.tags && song.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{song.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}


