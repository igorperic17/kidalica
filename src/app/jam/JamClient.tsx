"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { filterSongs, type Song } from "@/lib/songs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function JamClient({ initialSongs }: { initialSongs: Song[] }) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<"any" | Song["difficulty"]>("easy");

  const songs = useMemo(() => filterSongs(initialSongs, { query, difficulty }), [initialSongs, query, difficulty]);
  const first = songs[0];

  return (
    <main className="container mx-auto max-w-3xl py-8">
      <h2 className="mb-4 text-2xl font-semibold">Quick Jam</h2>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <Input
            placeholder="Search title or artist..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-sm"
          />
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
            <Button size="lg">Start Jam</Button>
          </Link>
        )}
      </div>

      {!first && <p className="text-muted-foreground">No songs match your filters yet.</p>}
      {first && (
        <div className="rounded-lg border p-6">
          <div className="mb-2 text-sm text-muted-foreground">Up next</div>
          <div className="text-xl font-semibold">{first.title}</div>
          <div className="text-muted-foreground">{first.artist}</div>
        </div>
      )}
    </main>
  );
}


