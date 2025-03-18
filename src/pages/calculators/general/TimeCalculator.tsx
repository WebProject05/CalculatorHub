
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, RefreshCw, Send } from "lucide-react";
import { toast } from "sonner";
import { downloadAsPDF } from "@/utils/pdfUtils";

// Custom time calculation functions
const addTimes = (time1: string, time2: string): string => {
  const [h1, m1, s1] = time1.split(':').map(Number);
  const [h2, m2, s2] = time2.split(':').map(Number);
  
  let totalSeconds = s1 + s2;
  let totalMinutes = m1 + m2;
  let totalHours = h1 + h2;
  
  if (totalSeconds >= 60) {
    totalSeconds -= 60;
    totalMinutes += 1;
  }
  
  if (totalMinutes >= 60) {
    totalMinutes -= 60;
    totalHours += 1;
  }
  
  return `${String(totalHours).padStart(2, '0')}:${String(totalMinutes).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}`;
};

const subtractTimes = (time1: string, time2: string): string => {
  const [h1, m1, s1] = time1.split(':').map(Number);
  const [h2, m2, s2] = time2.split(':').map(Number);
  
  // Convert both times to seconds
  const totalSeconds1 = h1 * 3600 + m1 * 60 + s1;
  const totalSeconds2 = h2 * 3600 + m2 * 60 + s2;
  
  // Calculate the difference
  let diff = totalSeconds1 - totalSeconds2;
  
  // Handle negative time (optional, depending on requirements)
  const isNegative = diff < 0;
  if (isNegative) {
    diff = Math.abs(diff);
  }
  
  // Convert back to hours, minutes, seconds
  const hours = Math.floor(diff / 3600);
  diff %= 3600;
  const minutes = Math.floor(diff / 60);
  const seconds = diff % 60;
  
  return `${isNegative ? '-' : ''}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const TimeCalculator = () => {
  // State for form inputs
  const [operation, setOperation] = useState("add");
  const [hours1, setHours1] = useState(0);
  const [minutes1, setMinutes1] = useState(0);
  const [seconds1, setSeconds1] = useState(0);
  const [hours2, setHours2] = useState(0);
  const [minutes2, setMinutes2] = useState(0);
  const [seconds2, setSeconds2] = useState(0);
  
  // State for results
  const [result, setResult] = useState("");
  const [showResults, setShowResults] = useState(false);
  
  // Handle calculation
  const handleCalculate = () => {
    const time1 = `${String(hours1).padStart(2, '0')}:${String(minutes1).padStart(2, '0')}:${String(seconds1).padStart(2, '0')}`;
    const time2 = `${String(hours2).padStart(2, '0')}:${String(minutes2).padStart(2, '0')}:${String(seconds2).padStart(2, '0')}`;
    
    let calculatedResult = "";
    
    if (operation === "add") {
      calculatedResult = addTimes(time1, time2);
    } else {
      calculatedResult = subtractTimes(time1, time2);
    }
    
    setResult(calculatedResult);
    setShowResults(true);
    toast.success("Time calculated successfully");
  };
  
  // Reset the calculator
  const handleReset = () => {
    setHours1(0);
    setMinutes1(0);
    setSeconds1(0);
    setHours2(0);
    setMinutes2(0);
    setSeconds2(0);
    setOperation("add");
    setResult("");
    setShowResults(false);
    toast.info("Calculator has been reset");
  };
  
  // Format time for display
  const formatTime = (timeString: string): string => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    let formattedString = "";
    
    if (hours > 0) {
      formattedString += `${hours} hour${hours !== 1 ? 's' : ''} `;
    }
    
    if (minutes > 0 || hours > 0) {
      formattedString += `${minutes} minute${minutes !== 1 ? 's' : ''} `;
    }
    
    formattedString += `${seconds} second${seconds !== 1 ? 's' : ''}`;
    
    return formattedString;
  };
  
  // Download as PDF
  const handleDownloadPDF = () => {
    downloadAsPDF('calculator-results', 'time-calculator-results.pdf');
  };
  
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Time Calculator</h1>
        <p className="text-muted-foreground">
          Add or subtract hours, minutes, and seconds with precision.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <Card className="lg:col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle>Enter Time Values</CardTitle>
            <CardDescription>
              Enter two time values to add or subtract
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Operation Selection */}
            <div className="space-y-2">
              <Label>Operation</Label>
              <Tabs value={operation} onValueChange={setOperation} className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="add">Add</TabsTrigger>
                  <TabsTrigger value="subtract">Subtract</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* First Time Input */}
            <div className="space-y-2">
              <Label>First Time</Label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="hours1" className="text-xs">Hours</Label>
                  <Input
                    id="hours1"
                    type="number"
                    min="0"
                    value={hours1}
                    onChange={(e) => setHours1(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="minutes1" className="text-xs">Minutes</Label>
                  <Input
                    id="minutes1"
                    type="number"
                    min="0"
                    max="59"
                    value={minutes1}
                    onChange={(e) => setMinutes1(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="seconds1" className="text-xs">Seconds</Label>
                  <Input
                    id="seconds1"
                    type="number"
                    min="0"
                    max="59"
                    value={seconds1}
                    onChange={(e) => setSeconds1(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
            
            {/* Second Time Input */}
            <div className="space-y-2">
              <Label>Second Time</Label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="hours2" className="text-xs">Hours</Label>
                  <Input
                    id="hours2"
                    type="number"
                    min="0"
                    value={hours2}
                    onChange={(e) => setHours2(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="minutes2" className="text-xs">Minutes</Label>
                  <Input
                    id="minutes2"
                    type="number"
                    min="0"
                    max="59"
                    value={minutes2}
                    onChange={(e) => setMinutes2(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="seconds2" className="text-xs">Seconds</Label>
                  <Input
                    id="seconds2"
                    type="number"
                    min="0"
                    max="59"
                    value={seconds2}
                    onChange={(e) => setSeconds2(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
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
        <Card id="calculator-results" className={`lg:col-span-2 shadow-sm transition-opacity duration-500 ${showResults ? 'opacity-100' : 'opacity-50'}`}>
          <CardHeader>
            <CardTitle>Time Calculation Results</CardTitle>
            <CardDescription>
              The result of your time calculation
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {showResults ? (
              <>
                {/* Primary Result */}
                <div className="p-6 bg-secondary rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">
                    {operation === "add" ? "Sum of Times" : "Difference Between Times"}
                  </p>
                  <p className="text-4xl font-bold mb-2 font-mono">
                    {result}
                  </p>
                  <p className="text-muted-foreground">
                    {formatTime(result)}
                  </p>
                </div>
                
                {/* Calculation Details */}
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-3">Calculation Details</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-muted-foreground">First Time:</span>
                      <span className="text-sm font-mono">
                        {String(hours1).padStart(2, '0')}:{String(minutes1).padStart(2, '0')}:{String(seconds1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-muted-foreground">Second Time:</span>
                      <span className="text-sm font-mono">
                        {String(hours2).padStart(2, '0')}:{String(minutes2).padStart(2, '0')}:{String(seconds2).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-muted-foreground">Operation:</span>
                      <span className="text-sm">{operation === "add" ? "Addition" : "Subtraction"}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-muted-foreground">Result:</span>
                      <span className="text-sm font-mono font-medium">{result}</span>
                    </div>
                  </div>
                </div>
                
                {/* Use Cases */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-medium mb-2">Common Applications</h3>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      <li>Calculate total work hours</li>
                      <li>Plan event durations</li>
                      <li>Determine time differences</li>
                      <li>Add up video or audio durations</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-medium mb-2">Time in Seconds</h3>
                    <p className="text-sm text-muted-foreground">
                      Total seconds: {
                        result.split(':').reduce((acc, val, i) => {
                          if (i === 0) return acc + parseInt(val) * 3600;
                          if (i === 1) return acc + parseInt(val) * 60;
                          return acc + parseInt(val);
                        }, 0)
                      }
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Enter time values and click "Calculate" to see the results
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

export default TimeCalculator;
