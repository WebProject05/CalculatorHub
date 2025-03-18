
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { lazy, Suspense } from "react";

// Lazy loaded calculator pages
const MortgageCalculator = lazy(() => import("./pages/calculators/financial/MortgageCalculator"));
const BMICalculator = lazy(() => import("./pages/calculators/health/BMICalculator"));
const ScientificCalculator = lazy(() => import("./pages/calculators/math/ScientificCalculator"));
const AgeCalculator = lazy(() => import("./pages/calculators/general/AgeCalculator"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="calculator-hub-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/calculators">
                <Route path="financial">
                  <Route path="mortgage" element={
                    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading calculator...</div>}>
                      <MortgageCalculator />
                    </Suspense>
                  } />
                </Route>
                <Route path="health">
                  <Route path="bmi" element={
                    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading calculator...</div>}>
                      <BMICalculator />
                    </Suspense>
                  } />
                </Route>
                <Route path="math">
                  <Route path="scientific" element={
                    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading calculator...</div>}>
                      <ScientificCalculator />
                    </Suspense>
                  } />
                </Route>
                <Route path="general">
                  <Route path="age" element={
                    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading calculator...</div>}>
                      <AgeCalculator />
                    </Suspense>
                  } />
                </Route>
              </Route>
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
