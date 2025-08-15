"use client";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, Guitar, Search, ArrowRight, Tag, Star, Users, Clock } from "lucide-react";
import Link from "next/link";
import type { Song } from "@/lib/songs.server";

export default function HomeClient({ songs }: { songs: Song[] }) {
  const recentSongs = songs.slice(0, 3);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "badge-success";
      case "medium": return "badge-warning";
      case "hard": return "badge-danger";
      default: return "badge-primary";
    }
  };

  return (
    <div className="page-container">
      <div className="page-content">
        {/* Hero Section */}
        <section className="section-modern">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="scale-in">
                <Logo size="large" className="text-primary" />
              </div>
            </div>
            
            <h1 className="heading-1 mb-6 slide-up">
              kidalica.app
            </h1>
            
            <p className="body-large mb-10 slide-up">
              Organize and jam your guitar songs with a modern, beautiful interface designed for musicians.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center slide-up">
              <Link href="/jam">
                <Button className="btn-primary text-lg px-8 py-4">
                  <Music className="mr-3 h-5 w-5" />
                  Browse Songs
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/jam">
                <Button variant="outline" className="btn-secondary text-lg px-8 py-4">
                  <Guitar className="mr-3 h-5 w-5" />
                  Start Jamming
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section-modern">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">Everything you need to organize your music</h2>
            <p className="body-large">Powerful features designed specifically for guitarists</p>
          </div>
          
          <div className="grid-modern md:grid-cols-3">
            <Card className="card-modern p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Music className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="heading-4 mb-4">Song Organization</CardTitle>
              <CardDescription className="body-medium">
                Store and organize your guitar songs in Markdown format with tags, difficulty levels, and smart filtering.
              </CardDescription>
            </Card>

            <Card className="card-modern p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Guitar className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="heading-4 mb-4">Built-in Tuner</CardTitle>
              <CardDescription className="body-medium">
                Tune your guitar directly in the browser using your microphone with real-time frequency detection.
              </CardDescription>
            </Card>

            <Card className="card-modern p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="heading-4 mb-4">Smart Filtering</CardTitle>
              <CardDescription className="body-medium">
                Find songs quickly with advanced filtering by difficulty, tags, and search queries.
              </CardDescription>
            </Card>
          </div>
        </section>

        {/* Recent Songs */}
        {recentSongs.length > 0 && (
          <section className="section-modern">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="heading-2 mb-2">Recent Songs</h2>
                <p className="body-medium">Start jamming with your latest additions</p>
              </div>
              <Link href="/jam">
                <Button variant="outline" className="btn-ghost">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid-modern md:grid-cols-3">
              {recentSongs.map((song) => (
                <Link key={song.slug} href={`/jam/${song.slug}`} className="block">
                  <Card className="card-modern p-6 group">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="heading-4 group-hover:text-primary transition-colors truncate mb-2">
                            {song.title}
                          </CardTitle>
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
          </section>
        )}

        {/* Stats Section */}
        <section className="section-modern">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Your Music Library</h2>
            <p className="body-large">Track your progress and organize your collection</p>
          </div>
          
          <div className="grid-modern md:grid-cols-3">
            <Card className="card-elevated p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Music className="h-8 w-8 text-primary" />
              </div>
              <div className="heading-1 text-primary mb-2">{songs.length}</div>
              <div className="body-medium">Songs in Library</div>
            </Card>
            
            <Card className="card-elevated p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Tag className="h-8 w-8 text-primary" />
              </div>
              <div className="heading-1 text-primary mb-2">
                {Array.from(new Set(songs.flatMap(s => s.tags || []))).length}
              </div>
              <div className="body-medium">Unique Tags</div>
            </Card>
            
            <Card className="card-elevated p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="heading-1 text-primary mb-2">
                {Array.from(new Set(songs.map(s => s.artist).filter(Boolean))).length}
              </div>
              <div className="body-medium">Artists</div>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-modern">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="heading-2 mb-6">Ready to start organizing your music?</h2>
            <p className="body-large mb-8">
              Join thousands of guitarists who use kidalica.app to organize their song collections and improve their practice sessions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/jam">
                <Button className="btn-primary text-lg px-8 py-4">
                  <Music className="mr-3 h-5 w-5" />
                  Get Started
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" className="btn-ghost text-lg px-8 py-4">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
