import Link from "next/link";
import { getAllSongs } from "@/lib/songs.server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-static";

export default function Home() {
  const songs = getAllSongs();
  return (
    <main className="container mx-auto py-10">
      <section className="mb-10 flex flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">kidalica.app</h1>
        <p className="max-w-2xl text-muted-foreground">
          A beautifully simple library to browse your guitar songs, filter by difficulty and playlist,
          and start jamming quickly. All songs are Markdown files stored in GitHub.
        </p>
        <div className="flex items-center gap-3">
          <Link href="/jam">
            <Button size="lg">Start Jam</Button>
          </Link>
          <Link href="/library">
            <Button size="lg" variant="secondary">Browse Library</Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {songs.slice(0, 6).map((song) => (
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


