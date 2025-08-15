import type { Song } from "./songs.server";

export interface FilterOptions {
  query?: string;
  difficulty?: "any" | Song["difficulty"];
  tags?: string[];
}

export function filterSongs(songs: Song[], filters: FilterOptions): Song[] {
  return songs.filter((song) => {
    // Query filter
    if (filters.query) {
      const query = filters.query.toLowerCase();
      const matchesTitle = song.title.toLowerCase().includes(query);
      const matchesArtist = song.artist?.toLowerCase().includes(query) || false;
      if (!matchesTitle && !matchesArtist) {
        return false;
      }
    }

    // Difficulty filter
    if (filters.difficulty && filters.difficulty !== "any") {
      if (song.difficulty !== filters.difficulty) {
        return false;
      }
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const songTags = song.tags || [];
      const hasMatchingTag = filters.tags.some(tag => songTags.includes(tag));
      if (!hasMatchingTag) {
        return false;
      }
    }

    return true;
  });
}


