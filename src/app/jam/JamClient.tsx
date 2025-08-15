"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { filterSongs, type Song } from "@/lib/songs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Music } from "lucide-react";

export default function JamClient({ initialSongs }: { initialSongs: Song[] }) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<"any" | Song["difficulty"]>("easy");

  const songs = useMemo(() => filterSongs(initialSongs, { query, difficulty }), [initialSongs, query, difficulty]);
  const first = songs[0];

  return (
    <main className="container mx-auto max-w-3xl py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Quick Jam</h2>
        <p className="text-muted-foreground">Find a song and start playing immediately</p>
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
        {first && (
          <Link href={`/jam/${first.slug}`}>
            <Button size="lg" className="w-full md:w-auto">
              <Music className="mr-2 h-4 w-4" />
              Start Jam
            </Button>
          </Link>
        )}
      </div>

      {!first && (
        <div className="text-center py-12">
          <Music className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No songs match your filters yet.</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setQuery("");
              setDifficulty("easy");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
      
      {first && (
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 text-sm text-muted-foreground">Up next</div>
              <div className="text-xl font-semibold">{first.title}</div>
              <div className="text-muted-foreground">{first.artist}</div>
              {first.difficulty && (
                <div className="mt-2">
                  <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                    {first.difficulty}
                  </span>
                </div>
              )}
            </div>
            <Link href={`/jam/${first.slug}`}>
              <Button size="sm">
                <Music className="mr-2 h-4 w-4" />
                Jam
              </Button>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}


