import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Music } from "lucide-react";

export default function NotFound() {
  return (
    <div className="page-container flex items-center justify-center">
      <div className="page-content">
        <Card className="card-elevated p-12 text-center max-w-md mx-auto">
          <CardHeader className="pb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Music className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="heading-2">Page Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="body-medium mb-8">
              The page you're looking for doesn't exist. It might have been moved or deleted.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button className="btn-primary">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              </Link>
              <Link href="/jam">
                <Button variant="outline" className="btn-secondary">
                  Browse Songs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
