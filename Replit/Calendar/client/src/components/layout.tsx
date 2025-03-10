import { Link } from "wouter";
import ThemeSelector from "./theme-selector";
import Weather from "./weather";
import { Settings, Calendar } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/">
              <a className="font-semibold text-lg">Takvim</a>
            </Link>
            <Weather />
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeSelector />
            <Link href="/settings">
              <a className="p-2 hover:bg-accent rounded-md">
                <Settings className="h-5 w-5" />
              </a>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
