import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllSongSlugs, getSongBySlug } from "@/lib/songs.server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Music, Tag } from "lucide-react";

export function generateStaticParams() {
  return getAllSongSlugs().map((slug) => ({ slug }));
}

type SectionType = "chords" | "lyrics" | "info";

export default function JamSongPage({ params }: { params: { slug: string } }) {
  const song = getSongBySlug(params.slug);
  if (!song) return notFound();

  // Parse content into sections
  const lines = song.content.split("\n");
  const sections: { type: SectionType; content: string[] }[] = [];
  let currentSection: { type: SectionType; content: string[] } = { type: "lyrics", content: [] };

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) {
      if (currentSection.content.length > 0) {
        sections.push({ ...currentSection, content: [...currentSection.content] });
        currentSection.content = [];
      }
    } else if (trimmed.match(/^[A-G][#b]?(m|maj|min|dim|aug)?[0-9]?(\/[A-G][#b]?)?\s*$/)) {
      // This looks like a chord line
      if (currentSection.type !== "chords") {
        if (currentSection.content.length > 0) {
          sections.push({ ...currentSection, content: [...currentSection.content] });
        }
        currentSection = { type: "chords", content: [] };
      }
      currentSection.content.push(line);
    } else {
      if (currentSection.type !== "lyrics") {
        if (currentSection.content.length > 0) {
          sections.push({ ...currentSection, content: [...currentSection.content] });
        }
        currentSection = { type: "lyrics", content: [] };
      }
      currentSection.content.push(line);
    }
  });

  if (currentSection.content.length > 0) {
    sections.push({ ...currentSection, content: [...currentSection.content] });
  }

  return (
    <main className="container mx-auto max-w-4xl py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/library" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Library
        </Link>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{song.title}</h1>
            {song.artist && (
              <p className="text-xl text-muted-foreground mb-4">{song.artist}</p>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              {song.difficulty && (
                <Badge variant="secondary">
                  {song.difficulty}
                </Badge>
              )}
              {song.tags?.map((tag) => (
                <Badge key={tag} variant="outline">
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Music className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Ready to jam</span>
          </div>
        </div>
      </div>

      {/* Song Content */}
      <article className="prose prose-neutral max-w-none dark:prose-invert">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            {section.type === "chords" && (
              <div className="bg-muted/50 rounded-lg p-4 mb-4">
                <div className="text-sm font-medium text-muted-foreground mb-2">Chords</div>
                <div className="font-mono text-lg leading-relaxed">
                  {section.content.map((line, lineIndex) => (
                    <div key={lineIndex} className="whitespace-pre-wrap">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {section.type === "lyrics" && (
              <div className="text-lg leading-relaxed">
                {section.content.map((line, lineIndex) => (
                  <div key={lineIndex} className="whitespace-pre-wrap">
                    {line}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </article>
    </main>
  );
}


