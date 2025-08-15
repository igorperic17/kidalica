export type Song = {
  slug: string;
  title: string;
  artist?: string;
  difficulty?: "easy" | "medium" | "hard";
  tags?: string[];
  playlist?: string[];
  content: string;
};

export function filterSongs(list: Song[], {
  query,
  difficulty,
  tags,
  playlist,
}: {
  query?: string;
  difficulty?: Song["difficulty"] | "any";
  tags?: string[];
  playlist?: string;
}): Song[] {
  const needle = query?.toLowerCase().trim() ?? "";
  return list.filter((song) => {
    const matchesQuery = needle
      ? song.title.toLowerCase().includes(needle) || song.artist?.toLowerCase().includes(needle)
      : true;
    const matchesDifficulty = difficulty && difficulty !== "any" ? song.difficulty === difficulty : true;
    const matchesTags = tags && tags.length ? tags.every((t) => song.tags?.includes(t)) : true;
    const matchesPlaylist = playlist ? song.playlist?.includes(playlist) : true;
    return matchesQuery && matchesDifficulty && matchesTags && matchesPlaylist;
  });
}


