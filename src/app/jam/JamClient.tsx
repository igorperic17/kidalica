"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { filterSongs, type Song } from "@/lib/songs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Music, List, Tag } from "lucide-react";

export default function JamClient({ initialSongs }: { initialSongs: Song[] }) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<"any" | Song["difficulty"]>("any");

  const songs = useMemo(() => filterSongs(initialSongs, { query, difficulty }), [initialSongs, query, difficulty]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "hard": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <main className="container mx-auto max-w-3xl py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Quick Jam</h2>
        <p className="text-muted-foreground">Find songs and start playing immediately</p>
      </div>
      
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
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
            <option value="any">Any</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        {songs.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <List className="h-4 w-4" />
            {songs.length} song{songs.length !== 1 ? 's' : ''} found
          </div>
        )}
      </div>

      {songs.length === 0 && (
        <div className="text-center py-12">
          <Music className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No songs match your filters yet.</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setQuery("");
              setDifficulty("any");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
      
      {songs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Ready to Jam</h3>
            <Link href="/library">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
          
          <div className="space-y-3">
            {songs.map((song, index) => (
              <Link key={song.slug} href={`/jam/${song.slug}`} className="block">
                <div className="group rounded-lg border bg-gradient-to-r from-background to-muted/20 p-4 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                          #{index + 1}
                        </span>
                        <h4 className="text-lg font-semibold group-hover:text-primary transition-colors truncate">
                          {song.title}
                        </h4>
                        {song.difficulty && (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(song.difficulty)}`}>
                            {song.difficulty}
                          </span>
                        )}
                      </div>
                      <div className="text-muted-foreground mb-3 flex items-center gap-2">
                        <Music className="h-3 w-3" />
                        {song.artist}
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {song.tags?.slice(0, 2).map((t) => (
                          <span key={t} className="inline-flex items-center px-2 py-1 rounded text-xs bg-muted text-muted-foreground">
                            <Tag className="mr-1 h-2 w-2" />
                            {t}
                          </span>
                        ))}
                        {song.playlist?.slice(0, 1).map((p) => (
                          <span key={p} className="inline-flex items-center px-2 py-1 rounded text-xs bg-secondary text-secondary-foreground">
                            {p}
                          </span>
                        ))}
                        {(song.tags?.length || 0) + (song.playlist?.length || 0) > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-muted text-muted-foreground">
                            +{(song.tags?.length || 0) + (song.playlist?.length || 0) - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}


