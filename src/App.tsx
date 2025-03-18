
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { lazy, Suspense } from "react";

// Import pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";

// Lazy loaded calculator pages - Financial
const MortgageCalculator = lazy(() => import("./pages/calculators/financial/MortgageCalculator"));
const CompoundInterestCalculator = lazy(() => import("./pages/calculators/financial/CompoundInterestCalculator"));
const LoanCalculator = lazy(() => import("./pages/calculators/financial/LoanCalculator"));
const AutoLoanCalculator = lazy(() => import("./pages/calculators/financial/AutoLoanCalculator"));
const InterestCalculator = lazy(() => import("./pages/calculators/financial/InterestCalculator"));
const CreditCardPayoffCalculator = lazy(() => import("./pages/calculators/financial/CreditCardPayoffCalculator"));
const RetirementCalculator = lazy(() => import("./pages/calculators/financial/RetirementCalculator"));
const InvestmentCalculator = lazy(() => import("./pages/calculators/financial/InvestmentCalculator"));

// Lazy loaded calculator pages - Health
const BMICalculator = lazy(() => import("./pages/calculators/health/BMICalculator"));
const CalorieCalculator = lazy(() => import("./pages/calculators/health/CalorieCalculator"));
const BodyFatCalculator = lazy(() => import("./pages/calculators/health/BodyFatCalculator"));
const PregnancyCalculator = lazy(() => import("./pages/calculators/health/PregnancyCalculator"));
const WaterIntakeCalculator = lazy(() => import("./pages/calculators/health/WaterIntakeCalculator"));
const MacroNutrientCalculator = lazy(() => import("./pages/calculators/health/MacroNutrientCalculator"));
const HeartRateZoneCalculator = lazy(() => import("./pages/calculators/health/HeartRateZoneCalculator"));
const OneRepMaxCalculator = lazy(() => import("./pages/calculators/health/OneRepMaxCalculator"));

// Lazy loaded calculator pages - Math
const ScientificCalculator = lazy(() => import("./pages/calculators/math/ScientificCalculator"));
const FractionCalculator = lazy(() => import("./pages/calculators/math/FractionCalculator"));
const PercentageCalculator = lazy(() => import("./pages/calculators/math/PercentageCalculator"));
const RandomNumberGenerator = lazy(() => import("./pages/calculators/math/RandomNumberGenerator"));
const TriangleCalculator = lazy(() => import("./pages/calculators/math/TriangleCalculator"));
const StandardDeviationCalculator = lazy(() => import("./pages/calculators/math/StandardDeviationCalculator"));
const QuadraticEquationSolver = lazy(() => import("./pages/calculators/math/QuadraticEquationSolver"));
const PermutationCombinationCalculator = lazy(() => import("./pages/calculators/math/PermutationCombinationCalculator"));

// Lazy loaded calculator pages - General
const AgeCalculator = lazy(() => import("./pages/calculators/general/AgeCalculator"));
const DateCalculator = lazy(() => import("./pages/calculators/general/DateCalculator"));
const TimeCalculator = lazy(() => import("./pages/calculators/general/TimeCalculator"));
const HoursCalculator = lazy(() => import("./pages/calculators/general/HoursCalculator"));
const GpaCalculator = lazy(() => import("./pages/calculators/general/GpaCalculator"));
const PasswordGenerator = lazy(() => import("./pages/calculators/general/PasswordGenerator"));
const UnitConverter = lazy(() => import("./pages/calculators/general/UnitConverter"));
const CurrencyConverter = lazy(() => import("./pages/calculators/general/CurrencyConverter"));

// Lazy loaded calculator pages - Fun
const LoveCalculator = lazy(() => import("./pages/calculators/fun/LoveCalculator"));
const LuckyNumberCalculator = lazy(() => import("./pages/calculators/fun/LuckyNumberCalculator"));
const PetAgeCalculator = lazy(() => import("./pages/calculators/fun/PetAgeCalculator"));
const CalorieBurnCalculator = lazy(() => import("./pages/calculators/fun/CalorieBurnCalculator"));
const AlcoholConsumptionCalculator = lazy(() => import("./pages/calculators/fun/AlcoholConsumptionCalculator"));
const BingeWatchCalculator = lazy(() => import("./pages/calculators/fun/BingeWatchCalculator"));
const SocialMediaEngagementCalculator = lazy(() => import("./pages/calculators/fun/SocialMediaEngagementCalculator"));
const NameNumerologyCalculator = lazy(() => import("./pages/calculators/fun/NameNumerologyCalculator"));

// Create query client
const queryClient = new QueryClient();

// Loading component
const LoadingCalculator = () => (
  <div className="h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
      <p>Loading calculator...</p>
    </div>
  </div>
);

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
                {/* Financial Calculators */}
                <Route path="financial">
                  <Route path="mortgage" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <MortgageCalculator />
                    </Suspense>
                  } />
                  <Route path="compound-interest" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <CompoundInterestCalculator />
                    </Suspense>
                  } />
                  <Route path="loan" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <LoanCalculator />
                    </Suspense>
                  } />
                  <Route path="auto-loan" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <AutoLoanCalculator />
                    </Suspense>
                  } />
                  <Route path="interest" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <InterestCalculator />
                    </Suspense>
                  } />
                  <Route path="credit-card-payoff" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <CreditCardPayoffCalculator />
                    </Suspense>
                  } />
                  <Route path="retirement" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <RetirementCalculator />
                    </Suspense>
                  } />
                  <Route path="investment" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <InvestmentCalculator />
                    </Suspense>
                  } />
                </Route>
                
                {/* Health Calculators */}
                <Route path="health">
                  <Route path="bmi" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <BMICalculator />
                    </Suspense>
                  } />
                  <Route path="calorie" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <CalorieCalculator />
                    </Suspense>
                  } />
                  <Route path="body-fat" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <BodyFatCalculator />
                    </Suspense>
                  } />
                  <Route path="pregnancy" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <PregnancyCalculator />
                    </Suspense>
                  } />
                  <Route path="water-intake" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <WaterIntakeCalculator />
                    </Suspense>
                  } />
                  <Route path="macro-nutrient" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <MacroNutrientCalculator />
                    </Suspense>
                  } />
                  <Route path="heart-rate-zone" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <HeartRateZoneCalculator />
                    </Suspense>
                  } />
                  <Route path="one-rep-max" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <OneRepMaxCalculator />
                    </Suspense>
                  } />
                </Route>
                
                {/* Math Calculators */}
                <Route path="math">
                  <Route path="scientific" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <ScientificCalculator />
                    </Suspense>
                  } />
                  <Route path="fraction" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <FractionCalculator />
                    </Suspense>
                  } />
                  <Route path="percentage" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <PercentageCalculator />
                    </Suspense>
                  } />
                  <Route path="random-number" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <RandomNumberGenerator />
                    </Suspense>
                  } />
                  <Route path="triangle" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <TriangleCalculator />
                    </Suspense>
                  } />
                  <Route path="standard-deviation" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <StandardDeviationCalculator />
                    </Suspense>
                  } />
                  <Route path="quadratic-equation" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <QuadraticEquationSolver />
                    </Suspense>
                  } />
                  <Route path="permutation-combination" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <PermutationCombinationCalculator />
                    </Suspense>
                  } />
                </Route>
                
                {/* General Calculators */}
                <Route path="general">
                  <Route path="age" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <AgeCalculator />
                    </Suspense>
                  } />
                  <Route path="date" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <DateCalculator />
                    </Suspense>
                  } />
                  <Route path="time" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <TimeCalculator />
                    </Suspense>
                  } />
                  <Route path="hours" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <HoursCalculator />
                    </Suspense>
                  } />
                  <Route path="gpa" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <GpaCalculator />
                    </Suspense>
                  } />
                  <Route path="password-generator" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <PasswordGenerator />
                    </Suspense>
                  } />
                  <Route path="unit-converter" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <UnitConverter />
                    </Suspense>
                  } />
                  <Route path="currency-converter" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <CurrencyConverter />
                    </Suspense>
                  } />
                </Route>
                
                {/* Fun Calculators */}
                <Route path="fun">
                  <Route path="love" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <LoveCalculator />
                    </Suspense>
                  } />
                  <Route path="lucky-number" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <LuckyNumberCalculator />
                    </Suspense>
                  } />
                  <Route path="pet-age" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <PetAgeCalculator />
                    </Suspense>
                  } />
                  <Route path="calorie-burn" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <CalorieBurnCalculator />
                    </Suspense>
                  } />
                  <Route path="alcohol-consumption" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <AlcoholConsumptionCalculator />
                    </Suspense>
                  } />
                  <Route path="binge-watch" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <BingeWatchCalculator />
                    </Suspense>
                  } />
                  <Route path="social-media-engagement" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <SocialMediaEngagementCalculator />
                    </Suspense>
                  } />
                  <Route path="name-numerology" element={
                    <Suspense fallback={<LoadingCalculator />}>
                      <NameNumerologyCalculator />
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
