import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/layout";
import Home from "@/pages/home";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import { useQuery } from "@tanstack/react-query";

function Router() {
  const { data: settings } = useQuery({ 
    queryKey: ["/api/settings"],
    onSuccess: (data) => {
      if (data?.theme) {
        document.documentElement.setAttribute('data-theme', data.theme);
      }
    }
  });

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}