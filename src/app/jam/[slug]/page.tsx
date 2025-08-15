import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllSongSlugs, getSongBySlug } from "@/lib/songs.server";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
  return getAllSongSlugs().map((slug) => ({ slug }));
}

export default function JamSongPage({ params }: { params: { slug: string } }) {
  const song = getSongBySlug(params.slug);
  if (!song) return notFound();
  return (
    <main className="container mx-auto max-w-3xl py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{song.title}</h1>
          {song.artist && <p className="text-muted-foreground">{song.artist}</p>}
        </div>
        <Link href="/library">
          <Button variant="secondary">Back to Library</Button>
        </Link>
      </div>

      <article className="prose prose-neutral max-w-none dark:prose-invert">
        {song.content.split("\n").map((line, idx) => (
          <p key={idx} className="whitespace-pre-wrap">
            {line}
          </p>
        ))}
      </article>
    </main>
  );
}


