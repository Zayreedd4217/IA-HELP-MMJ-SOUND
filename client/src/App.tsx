import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import TrackPage from "./pages/TrackPage";
import { Track } from "@/hooks/useTrackAPI";

function Router() {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [location] = useLocation();

  // Check if there's a track ID in query params
  const trackIdFromQuery = new URLSearchParams(window.location.search).get("track");

  if (selectedTrack) {
    return (
      <TrackPage
        track={selectedTrack}
        onBack={() => setSelectedTrack(null)}
      />
    );
  }

  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/gallery"}>
        <Gallery onSelectTrack={setSelectedTrack} />
      </Route>
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
