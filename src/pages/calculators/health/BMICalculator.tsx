
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Info, RefreshCw, Send } from "lucide-react";
import { calculateBMI, getBMICategory, getBMIColor } from "@/utils/calculators";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const BMICalculator = () => {
  // State for units (metric or imperial)
  const [units, setUnits] = useState("metric");
  
  // Metric inputs
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(70);
  
  // Imperial inputs
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(10);
  const [weightLbs, setWeightLbs] = useState(154);
  
  // Result state
  const [bmi, setBmi] = useState(0);
  const [category, setCategory] = useState("");
  const [categoryColor, setCategoryColor] = useState("bg-gray-400");
  const [showResults, setShowResults] = useState(false);
  
  // Calculate BMI when units or values change
  useEffect(() => {
    if (showResults) {
      calculateResults();
    }
  }, [units, heightCm, weightKg, heightFt, heightIn, weightLbs, showResults]);
  
  const calculateResults = () => {
    try {
      let calculatedBMI = 0;
      
      if (units === "metric") {
        // Validate inputs
        if (heightCm <= 0 || weightKg <= 0) {
          toast.error("Height and weight must be greater than zero");
          return;
        }
        
        calculatedBMI = calculateBMI(weightKg, heightCm / 100);
      } else {
        // Convert feet and inches to inches
        const totalInches = (heightFt * 12) + heightIn;
        
        // Validate inputs
        if (totalInches <= 0 || weightLbs <= 0) {
          toast.error("Height and weight must be greater than zero");
          return;
        }
        
        // BMI formula for imperial: (weight in pounds) / (height in inches)² × 703
        calculatedBMI = (weightLbs / (totalInches * totalInches)) * 703;
      }
      
      // Round to 1 decimal place
      calculatedBMI = Math.round(calculatedBMI * 10) / 10;
      
      setBmi(calculatedBMI);
      
      // Determine BMI category
      const bmiCategory = getBMICategory(calculatedBMI);
      setCategory(bmiCategory);
      
      // Set category color
      setCategoryColor(getBMIColor(calculatedBMI));
      
    } catch (error) {
      console.error("Error calculating BMI:", error);
      toast.error("Error calculating BMI. Please check your inputs.");
    }
  };
  
  const handleCalculate = () => {
    if (units === "metric" && (heightCm <= 0 || weightKg <= 0)) {
      toast.error("Please enter valid height and weight values");
      return;
    }
    
    if (units === "imperial" && (heightFt <= 0 || weightLbs <= 0)) {
      toast.error("Please enter valid height and weight values");
      return;
    }
    
    setShowResults(true);
    calculateResults();
    toast.success("BMI calculated successfully");
  };
  
  const handleReset = () => {
    setHeightCm(170);
    setWeightKg(70);
    setHeightFt(5);
    setHeightIn(10);
    setWeightLbs(154);
    setShowResults(false);
    toast.info("Calculator has been reset");
  };
  
  const handleDownloadPDF = () => {
    toast.success("PDF download started");
    // In a real app, this would generate and download a PDF
  };
  
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">BMI Calculator</h1>
        <p className="text-muted-foreground">
          Calculate your Body Mass Index (BMI) to assess if your weight is healthy for your height.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <Card className="lg:col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle>Enter Your Details</CardTitle>
            <CardDescription>
              Adjust the values to calculate your BMI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Units Selection */}
            <div className="space-y-2">
              <Label htmlFor="units">Units</Label>
              <Tabs value={units} onValueChange={setUnits} className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="metric">Metric</TabsTrigger>
                  <TabsTrigger value="imperial">Imperial</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Height */}
            <div className="space-y-2">
              <Label htmlFor="height">Height</Label>
              {units === "metric" ? (
                <div className="flex items-center">
                  <Input
                    id="heightCm"
                    type="number"
                    value={heightCm}
                    min={1}
                    onChange={(e) => setHeightCm(parseInt(e.target.value) || 0)}
                    className="input-control"
                  />
                  <span className="ml-2 text-sm whitespace-nowrap text-muted-foreground">cm</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <Input
                      id="heightFt"
                      type="number"
                      value={heightFt}
                      min={0}
                      onChange={(e) => setHeightFt(parseInt(e.target.value) || 0)}
                      className="input-control"
                    />
                    <span className="ml-2 text-sm whitespace-nowrap text-muted-foreground">ft</span>
                  </div>
                  <div className="flex items-center">
                    <Input
                      id="heightIn"
                      type="number"
                      value={heightIn}
                      min={0}
                      max={11}
                      onChange={(e) => setHeightIn(parseInt(e.target.value) || 0)}
                      className="input-control"
                    />
                    <span className="ml-2 text-sm whitespace-nowrap text-muted-foreground">in</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Weight */}
            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              {units === "metric" ? (
                <div className="flex items-center">
                  <Input
                    id="weightKg"
                    type="number"
                    value={weightKg}
                    min={1}
                    onChange={(e) => setWeightKg(parseInt(e.target.value) || 0)}
                    className="input-control"
                  />
                  <span className="ml-2 text-sm whitespace-nowrap text-muted-foreground">kg</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <Input
                    id="weightLbs"
                    type="number"
                    value={weightLbs}
                    min={1}
                    onChange={(e) => setWeightLbs(parseInt(e.target.value) || 0)}
                    className="input-control"
                  />
                  <span className="ml-2 text-sm whitespace-nowrap text-muted-foreground">lbs</span>
                </div>
              )}
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
        <Card className={`lg:col-span-2 shadow-sm transition-opacity duration-500 ${showResults ? 'opacity-100' : 'opacity-50'}`}>
          <CardHeader>
            <CardTitle>BMI Results</CardTitle>
            <CardDescription>
              Your Body Mass Index and what it means
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* BMI Result */}
            <div className="p-6 bg-secondary rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">Your BMI</p>
              <p className="text-5xl font-bold mb-2">{bmi.toFixed(1)}</p>
              {showResults && (
                <p className={`inline-flex px-3 py-1 rounded-full text-white font-medium ${categoryColor}`}>
                  {category}
                </p>
              )}
            </div>
            
            {/* BMI Scale */}
            {showResults && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">BMI Scale</h3>
                  
                  <div className="h-8 flex rounded-full overflow-hidden">
                    <div className="bg-blue-500 w-1/6 flex items-center justify-center">
                      <span className="text-xs text-white font-medium">Underweight</span>
                    </div>
                    <div className="bg-green-500 w-1/6 flex items-center justify-center">
                      <span className="text-xs text-white font-medium">Normal</span>
                    </div>
                    <div className="bg-yellow-500 w-1/6 flex items-center justify-center">
                      <span className="text-xs text-white font-medium">Overweight</span>
                    </div>
                    <div className="bg-orange-500 w-1/6 flex items-center justify-center">
                      <span className="text-xs text-white font-medium">Obese I</span>
                    </div>
                    <div className="bg-red-500 w-1/6 flex items-center justify-center">
                      <span className="text-xs text-white font-medium">Obese II</span>
                    </div>
                    <div className="bg-purple-500 w-1/6 flex items-center justify-center">
                      <span className="text-xs text-white font-medium">Obese III</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>16.5</span>
                    <span>18.5</span>
                    <span>25</span>
                    <span>30</span>
                    <span>35</span>
                    <span>40</span>
                  </div>
                  
                  {/* BMI Indicator */}
                  <div className="relative h-4 mt-2">
                    <div 
                      className="absolute h-4 w-4 bg-primary rounded-full transform -translate-x-1/2" 
                      style={{ 
                        left: `${Math.min(Math.max(((bmi - 16.5) / (40 - 16.5)) * 100, 0), 100)}%`,
                        transition: 'left 0.5s ease-out'
                      }}
                    />
                  </div>
                </div>
                
                {/* BMI Categories */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div className="p-4 rounded-lg bg-muted">
                    <h4 className="font-medium">Underweight</h4>
                    <p className="text-sm text-muted-foreground">BMI less than 18.5</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <h4 className="font-medium">Normal weight</h4>
                    <p className="text-sm text-muted-foreground">BMI between 18.5 and 24.9</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <h4 className="font-medium">Overweight</h4>
                    <p className="text-sm text-muted-foreground">BMI between 25 and 29.9</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <h4 className="font-medium">Obesity</h4>
                    <p className="text-sm text-muted-foreground">BMI 30 or higher</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Info Section */}
            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
              <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm">
                  BMI is a useful measurement for most people over 18 years old. But it has some limitations:
                </p>
                <ul className="text-sm list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>It may overestimate body fat in athletes with high muscle mass</li>
                  <li>It may underestimate body fat in older persons who have lost muscle</li>
                  <li>It doesn't account for sex and racial differences in body fat distribution</li>
                </ul>
              </div>
            </div>
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

export default BMICalculator;
