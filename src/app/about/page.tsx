import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Music, Guitar, Search, Code, Heart } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="page-container">
      <div className="page-content">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Logo size="large" className="text-primary" />
          </div>
          <h1 className="heading-1 mb-4">About kidalica.app</h1>
          <p className="body-large max-w-2xl mx-auto">
            A modern web app for organizing and playing guitar songs, built with passion for music and technology.
          </p>
        </div>

        {/* Developer Info */}
        <Card className="card-modern p-8 mb-8">
          <CardHeader className="text-center pb-6">
            <CardTitle className="heading-2">Developer</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Code className="h-8 w-8 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="heading-3">Igor Peric</h3>
                <p className="body-medium">Full-stack developer & music enthusiast</p>
              </div>
            </div>
            <Link href="https://github.com/igorperic17" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="btn-secondary">
                <Github className="mr-2 h-4 w-4" />
                View GitHub Profile
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* App Features */}
        <div className="grid-modern md:grid-cols-2 mb-8">
          <Card className="card-modern p-6">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Music className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="heading-4">Song Management</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="body-medium">
                Store and organize your guitar songs in Markdown format with tags, difficulty levels, and smart filtering capabilities.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-modern p-6">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Guitar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="heading-4">Built-in Tuner</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="body-medium">
                Tune your guitar directly in the browser using your microphone with real-time frequency detection and visual feedback.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-modern p-6">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="heading-4">Smart Search</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="body-medium">
                Find songs quickly with advanced filtering by difficulty, tags, artist, and search queries with instant results.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-modern p-6">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="heading-4">Modern Design</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="body-medium">
                Beautiful, responsive interface that works seamlessly on desktop and mobile devices with smooth animations.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Tech Stack */}
        <Card className="card-modern p-8 mb-8">
          <CardHeader className="text-center pb-6">
            <CardTitle className="heading-2">Technology Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/10">
                <h4 className="font-semibold text-foreground mb-2">Next.js 14</h4>
                <p className="body-small">React Framework</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/10">
                <h4 className="font-semibold text-foreground mb-2">TypeScript</h4>
                <p className="body-small">Type Safety</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/10">
                <h4 className="font-semibold text-foreground mb-2">Tailwind CSS</h4>
                <p className="body-small">Styling</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/10">
                <h4 className="font-semibold text-foreground mb-2">shadcn/ui</h4>
                <p className="body-small">Components</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/">
            <Button className="btn-primary">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
