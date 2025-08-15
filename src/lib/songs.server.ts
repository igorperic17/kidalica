import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Song } from "./songs";

const songsDirectory = path.join(process.cwd(), "content", "songs");

export function getAllSongSlugs(): string[] {
  if (!fs.existsSync(songsDirectory)) return [];
  return fs
    .readdirSync(songsDirectory)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => f.replace(/\.(md|mdx)$/i, ""));
}

export function getSongBySlug(slug: string): Song | null {
  const fullPathMd = path.join(songsDirectory, `${slug}.md`);
  const fullPathMdx = path.join(songsDirectory, `${slug}.mdx`);
  const fullPath = fs.existsSync(fullPathMd) ? fullPathMd : fs.existsSync(fullPathMdx) ? fullPathMdx : null;
  if (!fullPath) return null;
  const file = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(file);
  const front = data as Partial<Omit<Song, "slug" | "content">>;
  return {
    slug,
    title: front.title ?? slug,
    artist: front.artist,
    difficulty: front.difficulty as Song["difficulty"],
    tags: (front.tags as string[]) ?? [],
    playlist: (front.playlist as string[]) ?? [],
    content,
  };
}

export function getAllSongs(): Song[] {
  return getAllSongSlugs()
    .map((slug) => getSongBySlug(slug))
    .filter((s): s is Song => Boolean(s));
}


