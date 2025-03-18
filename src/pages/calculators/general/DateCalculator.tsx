
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import CalculatorTemplate from "@/utils/CalculatorTemplate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, addMonths, addYears, differenceInDays, differenceInMonths, differenceInYears, isValid } from "date-fns";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type TimeUnit = "days" | "weeks" | "months" | "years";

const DateCalculator = () => {
  // State for Date Difference tab
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [diffResult, setDiffResult] = useState<{
    days: number;
    months: number;
    years: number;
    totalDays: number;
    totalWeeks: number;
    totalMonths: number;
  } | null>(null);

  // State for Add/Subtract tab
  const [baseDate, setBaseDate] = useState<Date | undefined>(new Date());
  const [timeValue, setTimeValue] = useState<string>("1");
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("days");
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [addResult, setAddResult] = useState<Date | null>(null);

  // State for both tabs
  const [activeTab, setActiveTab] = useState<string>("difference");
  const [showResults, setShowResults] = useState(false);

  // Calculate the difference between two dates
  const calculateDateDifference = () => {
    if (!startDate || !endDate) {
      toast.error("Please select both dates");
      return;
    }

    if (!isValid(startDate) || !isValid(endDate)) {
      toast.error("Invalid date selection");
      return;
    }

    // Ensure end date is not before start date
    const start = new Date(startDate);
    const end = new Date(endDate);

    try {
      const totalDays = differenceInDays(end, start);
      const totalMonths = differenceInMonths(end, start);
      const years = differenceInYears(end, start);
      const months = differenceInMonths(end, start) % 12;
      const days = totalDays - (Math.floor(totalDays / 30) * 30);

      setDiffResult({
        days,
        months,
        years,
        totalDays,
        totalWeeks: Math.floor(totalDays / 7),
        totalMonths,
      });

      setShowResults(true);
      toast.success("Date difference calculated successfully");
    } catch (error) {
      console.error("Error calculating date difference:", error);
      toast.error("Error calculating date difference. Please check your inputs.");
    }
  };

  // Add or subtract time from a date
  const calculateDateAddSubtract = () => {
    if (!baseDate) {
      toast.error("Please select a date");
      return;
    }

    if (!timeValue || isNaN(Number(timeValue))) {
      toast.error("Please enter a valid number");
      return;
    }

    try {
      const date = new Date(baseDate);
      const value = parseInt(timeValue);
      
      let result: Date;
      
      if (operation === "add") {
        if (timeUnit === "days") {
          result = addDays(date, value);
        } else if (timeUnit === "weeks") {
          result = addDays(date, value * 7);
        } else if (timeUnit === "months") {
          result = addMonths(date, value);
        } else {
          result = addYears(date, value);
        }
      } else {
        if (timeUnit === "days") {
          result = addDays(date, -value);
        } else if (timeUnit === "weeks") {
          result = addDays(date, -value * 7);
        } else if (timeUnit === "months") {
          result = addMonths(date, -value);
        } else {
          result = addYears(date, -value);
        }
      }

      setAddResult(result);
      setShowResults(true);
      toast.success(`Date ${operation === "add" ? "addition" : "subtraction"} calculated successfully`);
    } catch (error) {
      console.error("Error calculating date:", error);
      toast.error("Error calculating date. Please check your inputs.");
    }
  };

  // Calculate based on active tab
  const handleCalculate = () => {
    if (activeTab === "difference") {
      calculateDateDifference();
    } else {
      calculateDateAddSubtract();
    }
  };

  // Reset calculator
  const handleReset = () => {
    if (activeTab === "difference") {
      setStartDate(new Date());
      setEndDate(new Date());
      setDiffResult(null);
    } else {
      setBaseDate(new Date());
      setTimeValue("1");
      setTimeUnit("days");
      setOperation("add");
      setAddResult(null);
    }
    
    setShowResults(false);
    toast.info("Calculator has been reset");
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setShowResults(false);
  };

  // Render inputs based on active tab
  const renderInputs = () => {
    return (
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="difference">Date Difference</TabsTrigger>
          <TabsTrigger value="addsubtract">Add/Subtract</TabsTrigger>
        </TabsList>
        
        <TabsContent value="difference" className="space-y-6 pt-3">
          {/* Start Date */}
          <div className="space-y-2">
            <Label>Start Date</Label>
            <div className="border rounded-md p-1">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                disabled={(date) => false}
                className="mx-auto"
              />
            </div>
          </div>
          
          {/* End Date */}
          <div className="space-y-2">
            <Label>End Date</Label>
            <div className="border rounded-md p-1">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                disabled={(date) => false}
                className="mx-auto"
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="addsubtract" className="space-y-6 pt-3">
          {/* Base Date */}
          <div className="space-y-2">
            <Label>Base Date</Label>
            <div className="border rounded-md p-1">
              <Calendar
                mode="single"
                selected={baseDate}
                onSelect={setBaseDate}
                disabled={(date) => false}
                className="mx-auto"
              />
            </div>
          </div>
          
          {/* Operation */}
          <div className="space-y-2">
            <Label htmlFor="operation">Operation</Label>
            <Select 
              value={operation} 
              onValueChange={(value: "add" | "subtract") => setOperation(value)}
            >
              <SelectTrigger id="operation">
                <SelectValue placeholder="Select operation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">Add</SelectItem>
                <SelectItem value="subtract">Subtract</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Time Value and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timeValue">Value</Label>
              <Input
                id="timeValue"
                type="number"
                min="1"
                value={timeValue}
                onChange={(e) => setTimeValue(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeUnit">Unit</Label>
              <Select 
                value={timeUnit} 
                onValueChange={(value: TimeUnit) => setTimeUnit(value)}
              >
                <SelectTrigger id="timeUnit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                  <SelectItem value="years">Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    );
  };

  // Render results based on active tab
  const renderResults = () => {
    return (
      <div className="space-y-6">
        {activeTab === "difference" ? (
          <>
            {diffResult ? (
              <>
                {/* Main Result */}
                <div className="p-6 bg-secondary rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Time Between Dates</p>
                  <p className="text-3xl font-bold mb-2">
                    {diffResult.years} years, {diffResult.months} months, {diffResult.days} days
                  </p>
                  <div className="flex justify-center gap-2 text-sm text-muted-foreground">
                    <p>{format(startDate!, "MMM dd, yyyy")}</p>
                    <p>to</p>
                    <p>{format(endDate!, "MMM dd, yyyy")}</p>
                  </div>
                </div>
                
                {/* Additional Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">Total Days</p>
                    <p className="text-2xl font-semibold">{diffResult.totalDays}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">Total Weeks</p>
                    <p className="text-2xl font-semibold">{diffResult.totalWeeks}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">Total Months</p>
                    <p className="text-2xl font-semibold">{diffResult.totalMonths}</p>
                  </div>
                </div>
                
                {/* Date Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-medium mb-2">Start Date</h3>
                    <p className="text-muted-foreground">
                      {startDate ? format(startDate, "EEEE, MMMM dd, yyyy") : "N/A"}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-medium mb-2">End Date</h3>
                    <p className="text-muted-foreground">
                      {endDate ? format(endDate, "EEEE, MMMM dd, yyyy") : "N/A"}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Select two dates and click "Calculate" to find the difference
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {addResult ? (
              <>
                {/* Main Result */}
                <div className="p-6 bg-secondary rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Result Date</p>
                  <p className="text-3xl font-bold mb-2">
                    {format(addResult, "MMMM dd, yyyy")}
                  </p>
                  <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
                    <p>
                      After {operation === "add" ? "adding" : "subtracting"} {timeValue} {timeUnit}
                      {parseInt(timeValue) !== 1 ? "" : timeUnit === "days" ? "" : "s"}
                    </p>
                  </div>
                </div>
                
                {/* Date Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-medium mb-2">Starting Date</h3>
                    <p className="text-muted-foreground">
                      {baseDate ? format(baseDate, "EEEE, MMMM dd, yyyy") : "N/A"}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-medium mb-2">Operation</h3>
                    <p className="text-muted-foreground">
                      {operation === "add" ? "Added" : "Subtracted"} {timeValue} {timeUnit}
                      {parseInt(timeValue) !== 1 ? "s" : timeUnit === "days" ? "" : "s"}
                    </p>
                  </div>
                </div>
                
                {/* Result Day Info */}
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Result Day Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Day of Week:</p>
                      <p className="font-medium">{format(addResult, "EEEE")}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Day of Year:</p>
                      <p className="font-medium">{format(addResult, "D")}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Week of Year:</p>
                      <p className="font-medium">{format(addResult, "w")}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Quarter:</p>
                      <p className="font-medium">Q{Math.floor((addResult.getMonth() + 3) / 3)}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Select a date, enter a value, and choose an operation to calculate
                </p>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <CalculatorTemplate
      title="Date Calculator"
      description="Calculate the difference between dates or add/subtract days, weeks, months or years."
      category="general"
      renderInputs={renderInputs}
      renderResults={renderResults}
      handleCalculate={handleCalculate}
      handleReset={handleReset}
      showResults={showResults}
    />
  );
};

export default DateCalculator;
