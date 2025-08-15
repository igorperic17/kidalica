"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { filterSongs, type Song } from "@/lib/songs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LibraryClient({ initialSongs }: { initialSongs: Song[] }) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<"any" | Song["difficulty"]>("any");

  const songs = useMemo(() => filterSongs(initialSongs, { query, difficulty }), [initialSongs, query, difficulty]);

  return (
    <main className="container mx-auto py-8">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-semibold">Library</h2>
        <div className="flex flex-1 items-center gap-3 md:justify-end">
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
            <option value="any">Any difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {songs.map((song) => (
          <Card key={song.slug}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{song.title}</span>
                {song.difficulty && <Badge variant="secondary">{song.difficulty}</Badge>}
              </CardTitle>
              <CardDescription>{song.artist}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="flex gap-2">
                {song.tags?.slice(0, 3).map((t) => (
                  <Badge key={t} variant="outline">{t}</Badge>
                ))}
              </div>
              <Link href={`/jam/${song.slug}`}>
                <Button size="sm">Jam</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}


