import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Music, Code, Heart, Guitar } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <div className="text-center mb-12 animate-in fade-in duration-700">
          <div className="flex justify-center mb-6">
            <Logo size="large" className="text-primary" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-4">
            About Kidalica
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A modern web app for organizing and playing guitar songs, built with passion for music and technology.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-12">
          {/* Developer Info */}
          <div className="animate-in slide-in-from-left duration-700 delay-200">
            <Card className="h-full border-0 shadow-lg bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Code className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Developer</CardTitle>
                    <CardDescription>Built with modern web technologies</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="font-medium">Igor Peric</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Full-stack developer passionate about creating beautiful, functional web applications. 
                    This project combines my love for music and coding.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    <Code className="mr-1 h-3 w-3" />
                    Full-Stack
                  </Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    <Music className="mr-1 h-3 w-3" />
                    Music
                  </Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    <Guitar className="mr-1 h-3 w-3" />
                    Guitar
                  </Badge>
                </div>

                <Link href="https://github.com/igorperic17" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200">
                    <Github className="mr-2 h-4 w-4" />
                    View GitHub Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* App Features */}
          <div className="animate-in slide-in-from-right duration-700 delay-400">
            <Card className="h-full border-0 shadow-lg bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Music className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Features</CardTitle>
                    <CardDescription>What makes Kidalica special</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium">Song Organization</h4>
                      <p className="text-muted-foreground text-sm">Store and organize your guitar songs in Markdown format</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium">Smart Filtering</h4>
                      <p className="text-muted-foreground text-sm">Filter by difficulty, tags, and playlists</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium">Guitar Tuner</h4>
                      <p className="text-muted-foreground text-sm">Built-in microphone-based guitar tuner</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium">Modern UI</h4>
                      <p className="text-muted-foreground text-sm">Beautiful, responsive design with dark/light themes</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="animate-in slide-in-from-bottom duration-700 delay-600">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Built With</CardTitle>
              <CardDescription className="text-center">Modern web technologies for the best experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "Next.js 14", color: "bg-black text-white" },
                  { name: "TypeScript", color: "bg-blue-600 text-white" },
                  { name: "Tailwind CSS", color: "bg-cyan-500 text-white" },
                  { name: "shadcn/ui", color: "bg-slate-800 text-white" },
                  { name: "Vercel", color: "bg-black text-white" },
                  { name: "GitHub", color: "bg-gray-800 text-white" },
                  { name: "Markdown", color: "bg-gray-600 text-white" },
                  { name: "Web Audio API", color: "bg-purple-600 text-white" }
                ].map((tech, index) => (
                  <div
                    key={tech.name}
                    className={`${tech.color} px-4 py-2 rounded-lg text-center text-sm font-medium animate-in fade-in duration-500 delay-${800 + index * 100}`}
                  >
                    {tech.name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Back to App */}
        <div className="text-center mt-12 animate-in fade-in duration-700 delay-1200">
          <Link href="/">
            <Button variant="outline" size="lg" className="bg-background/80 hover:bg-background border-border/50 hover:border-border">
              <Heart className="mr-2 h-4 w-4" />
              Back to App
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
