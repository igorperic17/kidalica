"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { filterSongs, type Song } from "@/lib/songs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Music, List } from "lucide-react";

export default function JamClient({ initialSongs }: { initialSongs: Song[] }) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<"any" | Song["difficulty"]>("any");

  const songs = useMemo(() => filterSongs(initialSongs, { query, difficulty }), [initialSongs, query, difficulty]);

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
          
          <div className="grid gap-4">
            {songs.map((song, index) => (
              <div key={song.slug} className="rounded-lg border bg-card p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                      <span className="text-lg font-semibold">{song.title}</span>
                      {song.difficulty && (
                        <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                          {song.difficulty}
                        </span>
                      )}
                    </div>
                    <div className="text-muted-foreground">{song.artist}</div>
                  </div>
                  <Link href={`/jam/${song.slug}`}>
                    <Button size="sm">
                      <Music className="mr-2 h-4 w-4" />
                      Jam
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}


