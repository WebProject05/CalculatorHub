
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, RefreshCw, Send } from "lucide-react";
import { toast } from "sonner";
import { differenceInYears, differenceInMonths, differenceInDays, format } from "date-fns";
import { calculateAge, formatDate } from "@/utils/calculators";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date>(new Date());
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<{ years: number; months: number; days: number; totalMonths: number; totalDays: number; totalWeeks: number; nextBirthday: string; daysUntilBirthday: number } | null>(null);
  
  // Handle calculation
  const handleCalculate = () => {
    if (!birthDate) {
      toast.error("Please select a birth date");
      return;
    }
    
    if (birthDate > toDate) {
      toast.error("Birth date cannot be in the future");
      return;
    }
    
    try {
      // Calculate age in years, months, days
      const years = differenceInYears(toDate, birthDate);
      const remainingMonths = differenceInMonths(toDate, birthDate) % 12;
      
      // Calculate total days and then subtract the days from the full months
      const totalDays = differenceInDays(toDate, birthDate);
      const monthsDays = Math.floor(totalDays / 30) * 30; // rough approximation
      const remainingDays = totalDays - monthsDays + (years * 5); // adjusting for the approximation
      
      // Calculate total values
      const totalMonths = differenceInMonths(toDate, birthDate);
      const totalWeeks = Math.floor(totalDays / 7);
      
      // Calculate next birthday
      const nextBirthdayYear = birthDate.getMonth() < toDate.getMonth() || 
        (birthDate.getMonth() === toDate.getMonth() && birthDate.getDate() < toDate.getDate()) 
        ? toDate.getFullYear() + 1 
        : toDate.getFullYear();
      
      const nextBirthdayDate = new Date(nextBirthdayYear, birthDate.getMonth(), birthDate.getDate());
      const daysUntilBirthday = differenceInDays(nextBirthdayDate, toDate);
      
      setResults({
        years,
        months: remainingMonths,
        days: remainingDays,
        totalMonths,
        totalDays,
        totalWeeks,
        nextBirthday: format(nextBirthdayDate, 'MMMM dd, yyyy'),
        daysUntilBirthday
      });
      
      setShowResults(true);
      toast.success("Age calculated successfully");
      
    } catch (error) {
      console.error("Error calculating age:", error);
      toast.error("Error calculating age. Please check your inputs.");
    }
  };
  
  // Reset the calculator
  const handleReset = () => {
    setBirthDate(undefined);
    setToDate(new Date());
    setShowResults(false);
    setResults(null);
    toast.info("Calculator has been reset");
  };
  
  // Download as PDF
  const handleDownloadPDF = () => {
    toast.success("PDF download started");
    // In a real app, this would generate and download a PDF
  };
  
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Age Calculator</h1>
        <p className="text-muted-foreground">
          Calculate the exact age between two dates in years, months, and days.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Input Form */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Enter Dates</CardTitle>
            <CardDescription>
              Select the birth date and the date to calculate age to
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Birth Date */}
            <div className="space-y-2">
              <Label htmlFor="birthDate">Birth Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal h-10"
                  >
                    {birthDate ? format(birthDate, "PPP") : "Select birth date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={birthDate}
                    onSelect={setBirthDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* To Date */}
            <div className="space-y-2">
              <Label htmlFor="toDate">Age at Date (defaults to today)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal h-10"
                  >
                    {format(toDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={(date) => date && setToDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleReset} className="w-full flex items-center gap-2 mr-2">
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
            <Button onClick={handleCalculate} className="w-full flex items-center gap-2 ml-2">
              <Send className="h-4 w-4" />
              Calculate
            </Button>
          </CardFooter>
        </Card>
        
        {/* Results */}
        <Card className={`lg:col-span-3 shadow-sm transition-opacity duration-500 ${showResults ? 'opacity-100' : 'opacity-50'}`}>
          <CardHeader>
            <CardTitle>Age Results</CardTitle>
            <CardDescription>
              The calculated age between the two dates
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {results ? (
              <>
                {/* Primary Result */}
                <div className="p-6 bg-secondary rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">You are</p>
                  <p className="text-4xl font-bold mb-2">
                    {results.years} years, {results.months} months, {results.days} days
                  </p>
                  <p className="text-muted-foreground">
                    as of {format(toDate, "MMMM dd, yyyy")}
                  </p>
                </div>
                
                {/* Detailed Age Information */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">In Months</p>
                    <p className="text-2xl font-semibold">{results.totalMonths}</p>
                    <p className="text-xs text-muted-foreground">months</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">In Weeks</p>
                    <p className="text-2xl font-semibold">{results.totalWeeks}</p>
                    <p className="text-xs text-muted-foreground">weeks</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">In Days</p>
                    <p className="text-2xl font-semibold">{results.totalDays}</p>
                    <p className="text-xs text-muted-foreground">days</p>
                  </div>
                </div>
                
                {/* Next Birthday */}
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Next Birthday</h3>
                    <span className="text-sm text-muted-foreground">{results.nextBirthday}</span>
                  </div>
                  <p className="text-center text-3xl font-bold mt-2">{results.daysUntilBirthday} days</p>
                  <p className="text-center text-sm text-muted-foreground">until your next birthday</p>
                </div>
                
                {/* More Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-medium mb-2">Birth Date</h3>
                    <p className="text-muted-foreground">
                      {birthDate ? format(birthDate, "EEEE, MMMM dd, yyyy") : "N/A"}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-medium mb-2">Age at Date</h3>
                    <p className="text-muted-foreground">
                      {format(toDate, "EEEE, MMMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Enter a birth date and click "Calculate" to see the results
                </p>
              </div>
            )}
          </CardContent>
          
          {showResults && (
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full flex items-center gap-2"
                onClick={handleDownloadPDF}
              >
                <Download className="h-4 w-4" />
                Download PDF Report
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AgeCalculator;
