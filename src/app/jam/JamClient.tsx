"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { filterSongs } from "@/lib/songs";
import type { Song } from "@/lib/songs.server";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Music, List, Tag, Filter, Play, X, Clock } from "lucide-react";

export default function JamClient({ initialSongs }: { initialSongs: Song[] }) {
  const [query, setQuery] = useState("");
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const songs = useMemo(() => filterSongs(initialSongs, { query, difficulty: selectedDifficulties, tags: selectedTags }), [initialSongs, query, selectedDifficulties, selectedTags]);

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
    setSelectedDifficulties([]);
    setSelectedTags([]);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const hasActiveFilters = query || selectedDifficulties.length > 0 || selectedTags.length > 0;

  return (
    <div className="page-container">
      <div className="page-content">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-slate-100 mb-2" style={{ textShadow: '0 0 20px rgba(59, 130, 246, 0.3)' }}>
            Quick Jam
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">Find songs and start playing immediately</p>
        </div>
        
        {/* Enhanced Filters */}
        <Card className="card-modern p-4 sm:p-6 mb-4 sm:mb-8">
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-semibold tracking-tight text-slate-200" style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.1)' }}>Filters</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            {/* Search and Results Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search title or artist..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="input-modern pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <List className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm sm:text-base text-slate-400 leading-relaxed">
                  {songs.length} song{songs.length !== 1 ? 's' : ''} found
                </span>
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="space-y-2 sm:space-y-3">
              <label className="text-sm font-medium text-foreground">Filter by Difficulty</label>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {["easy", "medium", "hard"].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => {
                      setSelectedDifficulties(prev => 
                        prev.includes(diff) 
                          ? prev.filter(d => d !== diff)
                          : [...prev, diff]
                      );
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedDifficulties.includes(diff)
                        ? 'bg-primary/10 border border-primary/20 text-primary'
                        : 'bg-background/50 hover:bg-background/80 border border-border/30 hover:border-border/50 text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tags Filter */}
            {allTags.length > 0 && (
              <div className="space-y-2 sm:space-y-3">
                <label className="text-sm font-medium text-foreground">Filter by Tags</label>
                <div className="flex flex-wrap gap-1 sm:gap-2">
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-100 mb-2" style={{ textShadow: '0 0 15px rgba(59, 130, 246, 0.2)' }}>Ready to Jam</h2>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed">Pick a song and start playing</p>
              </div>
              {songs.length > 0 && (
                <Link href={`/jam/${songs[0].slug}?${createQueueParams()}`}>
                  <Button className="btn-primary w-full sm:w-auto">
                    <Play className="mr-2 h-4 w-4" />
                    Start Jam
                  </Button>
                </Link>
              )}
            </div>
            
            <div className="grid gap-4 sm:gap-6 lg:gap-8 md:grid-cols-2">
              {songs.map((song, index) => (
                <Link key={song.slug} href={`/jam/${song.slug}?${createQueueParams()}`} className="block">
                  <Card className="card-modern p-4 sm:p-6 group">
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


