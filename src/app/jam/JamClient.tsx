"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { filterSongs } from "@/lib/songs";
import type { Song } from "@/lib/songs.server";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Music, List, Tag, Filter, Play, X } from "lucide-react";

export default function JamClient({ initialSongs }: { initialSongs: Song[] }) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<"any" | Song["difficulty"]>("any");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const songs = useMemo(() => filterSongs(initialSongs, { query, difficulty, tags: selectedTags }), [initialSongs, query, difficulty, selectedTags]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "badge-success";
      case "medium": return "badge-warning";
      case "hard": return "badge-danger";
      default: return "badge-primary";
    }
  };

  // Get all available tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    initialSongs.forEach(song => {
      song.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [initialSongs]);

  // Create queue parameter for filtered songs
  const createQueueParams = () => {
    const queueSlugs = songs.map(s => s.slug);
    return `queue=${encodeURIComponent(JSON.stringify(queueSlugs))}`;
  };

  const clearFilters = () => {
    setQuery("");
    setDifficulty("any");
    setSelectedTags([]);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const hasActiveFilters = query || difficulty !== "any" || selectedTags.length > 0;

  return (
    <div className="page-container">
      <div className="page-content">
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-1 mb-2">Quick Jam</h1>
          <p className="body-large">Find songs and start playing immediately</p>
        </div>
        
        {/* Enhanced Filters */}
        <Card className="card-modern p-6 mb-8">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <h2 className="heading-3">Filters</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search and Basic Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search title or artist..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="input-modern pl-10"
                />
              </div>
              <select
                className="input-modern"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
              >
                <option value="any">Any Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <div className="flex items-center gap-2">
                <List className="h-5 w-5 text-muted-foreground" />
                <span className="body-medium">
                  {songs.length} song{songs.length !== 1 ? 's' : ''} found
                </span>
              </div>
            </div>

            {/* Tags Filter */}
            {allTags.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Filter by Tags</label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedTags.includes(tag)
                          ? 'bg-primary/10 border border-primary/20 text-primary'
                          : 'bg-background/50 hover:bg-background/80 border border-border/30 hover:border-border/50 text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Tag className="h-3 w-3" />
                        {tag}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2">
                <Button onClick={clearFilters} variant="outline" className="btn-ghost text-sm">
                  <X className="mr-2 h-4 w-4" />
                  Clear all filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {songs.length === 0 ? (
          <Card className="card-elevated p-12 text-center">
            <div className="max-w-md mx-auto">
              <Music className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
              <h3 className="heading-3 mb-4">No songs found</h3>
              <p className="body-medium mb-6">
                No songs match your current filters. Try adjusting your search criteria.
              </p>
              <Button onClick={clearFilters} className="btn-primary">
                Clear filters
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="heading-2 mb-2">Ready to Jam</h2>
                <p className="body-medium">Pick a song and start playing</p>
              </div>
              {songs.length > 0 && (
                <Link href={`/jam/${songs[0].slug}?${createQueueParams()}`}>
                  <Button className="btn-primary">
                    <Play className="mr-2 h-4 w-4" />
                    Start Jam
                  </Button>
                </Link>
              )}
            </div>
            
            <div className="grid-modern md:grid-cols-2">
              {songs.map((song, index) => (
                <Link key={song.slug} href={`/jam/${song.slug}?${createQueueParams()}`} className="block">
                  <Card className="card-modern p-6 group">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-medium px-2 py-1 rounded bg-primary/10 text-primary">
                              #{index + 1}
                            </span>
                            <CardTitle className="heading-4 group-hover:text-primary transition-colors truncate">
                              {song.title}
                            </CardTitle>
                          </div>
                          <CardDescription className="body-small flex items-center gap-2">
                            <Music className="h-4 w-4" />
                            {song.artist}
                          </CardDescription>
                        </div>
                        {song.difficulty && (
                          <Badge className={`badge-modern ${getDifficultyColor(song.difficulty)}`}>
                            {song.difficulty}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="flex gap-2 flex-wrap">
                        {song.tags?.slice(0, 3).map((t) => (
                          <Badge key={t} variant="outline" className="badge-modern badge-outline">
                            <Tag className="mr-1 h-3 w-3" />
                            {t}
                          </Badge>
                        ))}
                        {song.tags && song.tags.length > 3 && (
                          <Badge variant="outline" className="badge-modern badge-outline">
                            +{song.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


