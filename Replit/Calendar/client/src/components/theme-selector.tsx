import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const themes = [
  { name: "Sıcak", value: "warm", icon: "🌞" },
  { name: "Soğuk", value: "cold", icon: "❄️" },
  { name: "Doğal", value: "natural", icon: "🌿" }
];

export default function ThemeSelector() {
  const queryClient = useQueryClient();
  const { data: settings } = useQuery({ 
    queryKey: ["/api/settings"] 
  });

  const mutation = useMutation({
    mutationFn: async (theme: string) => {
      await apiRequest("PATCH", "/api/settings", { theme });
      // Tema değişikliğini hemen uygula
      document.documentElement.setAttribute('data-theme', theme);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    }
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Tema seç</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            onClick={() => mutation.mutate(theme.value)}
            className={settings?.theme === theme.value ? "bg-accent" : ""}
          >
            <span className="mr-2">{theme.icon}</span>
            {theme.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}