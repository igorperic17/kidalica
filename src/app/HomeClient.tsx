"use client";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, Guitar, Search, ArrowRight, Tag } from "lucide-react";
import Link from "next/link";
import type { Song } from "@/lib/songs.server";

export default function HomeClient({ songs }: { songs: Song[] }) {
  const recentSongs = songs.slice(0, 3);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "hard": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto max-w-6xl py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-in fade-in duration-700">
          <div className="flex justify-center mb-8">
            <div className="animate-in zoom-in duration-1000 delay-200">
              <Logo size="large" className="text-primary mx-auto" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent mb-6 animate-in slide-in-from-bottom duration-700 delay-400">
            Kidalica
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-in slide-in-from-bottom duration-700 delay-600">
            Organize and jam your guitar songs with a modern, beautiful interface
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in slide-in-from-bottom duration-700 delay-800">
            <Link href="/library">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-lg px-8 py-6">
                <Music className="mr-2 h-5 w-5" />
                Browse Library
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/jam">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-2 hover:bg-background/80">
                <Guitar className="mr-2 h-5 w-5" />
                Start Jamming
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-16 animate-in slide-in-from-bottom duration-700 delay-1000">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-full bg-primary/10">
                  <Music className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Song Organization</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Store and organize your guitar songs in Markdown format with tags, difficulty levels, and smart filtering.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-full bg-primary/10">
                  <Guitar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Built-in Tuner</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Tune your guitar directly in the browser using your microphone with real-time frequency detection.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-full bg-primary/10">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Smart Filtering</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Find songs quickly with advanced filtering by difficulty, tags, and search queries.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Recent Songs */}
        {recentSongs.length > 0 && (
          <div className="animate-in slide-in-from-bottom duration-700 delay-1200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recent Songs</h2>
              <Link href="/library">
                <Button variant="outline">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {recentSongs.map((song, index) => (
                <div
                  key={song.slug}
                  className={`animate-in slide-in-from-bottom duration-600 delay-${1400 + index * 100}`}
                >
                  <Link href={`/jam/${song.slug}`} className="block">
                    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-0 shadow-sm bg-gradient-to-br from-background to-muted/20 cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors truncate">
                              {song.title}
                            </CardTitle>
                            <CardDescription className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                              <Music className="h-3 w-3" />
                              {song.artist}
                            </CardDescription>
                          </div>
                          {song.difficulty && (
                            <Badge
                              variant="secondary"
                              className={`text-xs font-medium ${getDifficultyColor(song.difficulty)}`}
                            >
                              {song.difficulty}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="flex gap-1 flex-wrap">
                          {song.tags?.slice(0, 3).map((t) => (
                            <Badge key={t} variant="outline" className="text-xs">
                              <Tag className="mr-1 h-2 w-2" />
                              {t}
                            </Badge>
                          ))}
                          {song.tags && song.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{song.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="text-center mt-16 animate-in slide-in-from-bottom duration-700 delay-1600">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">{songs.length}</div>
              <div className="text-muted-foreground">Songs in Library</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {Array.from(new Set(songs.flatMap(s => s.tags || []))).length}
              </div>
              <div className="text-muted-foreground">Unique Tags</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {Array.from(new Set(songs.map(s => s.artist).filter(Boolean))).length}
              </div>
              <div className="text-muted-foreground">Artists</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
