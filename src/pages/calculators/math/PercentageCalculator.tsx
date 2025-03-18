
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Send } from "lucide-react";
import { toast } from "sonner";

const PercentageCalculator = () => {
  // State for calculator mode
  const [calculatorMode, setCalculatorMode] = useState("findPercentage");
  
  // State for percentage of value
  const [percentageValue, setPercentageValue] = useState(10);
  const [baseValue, setBaseValue] = useState(100);
  const [percentageResult, setPercentageResult] = useState<number | null>(null);
  
  // State for percentage change
  const [originalValue, setOriginalValue] = useState(100);
  const [newValue, setNewValue] = useState(120);
  const [changeResult, setChangeResult] = useState<{ percentChange: number; isIncrease: boolean } | null>(null);
  
  // State for finding value from percentage
  const [targetPercentage, setTargetPercentage] = useState(25);
  const [knownValue, setKnownValue] = useState(75);
  const [valueResult, setValueResult] = useState<number | null>(null);
  
  // State for reverse percentage calculation
  const [finalValue, setFinalValue] = useState(120);
  const [appliedPercentage, setAppliedPercentage] = useState(20);
  const [reverseResult, setReverseResult] = useState<number | null>(null);
  
  // Calculate percentage of a value
  const calculatePercentage = () => {
    const result = (percentageValue / 100) * baseValue;
    setPercentageResult(result);
    toast.success("Percentage calculated!");
  };
  
  // Calculate percentage change between two values
  const calculateChange = () => {
    if (originalValue === 0) {
      toast.error("Original value cannot be zero");
      return;
    }
    
    const absoluteChange = newValue - originalValue;
    const percentChange = Math.abs((absoluteChange / originalValue) * 100);
    
    setChangeResult({
      percentChange,
      isIncrease: newValue > originalValue
    });
    
    toast.success("Percentage change calculated!");
  };
  
  // Calculate the value given a percentage
  const calculateValue = () => {
    // X is Y% of what?
    const result = (knownValue * 100) / targetPercentage;
    setValueResult(result);
    toast.success("Value calculated!");
  };
  
  // Calculate reverse percentage (original value before percentage was applied)
  const calculateReverse = () => {
    // If X is Y% more than the original value
    const multiplier = 1 + (appliedPercentage / 100);
    const result = finalValue / multiplier;
    setReverseResult(result);
    toast.success("Original value calculated!");
  };
  
  // Reset all inputs
  const handleReset = () => {
    // Reset all state based on current mode
    if (calculatorMode === "findPercentage") {
      setPercentageValue(10);
      setBaseValue(100);
      setPercentageResult(null);
    } else if (calculatorMode === "findChange") {
      setOriginalValue(100);
      setNewValue(120);
      setChangeResult(null);
    } else if (calculatorMode === "findValue") {
      setTargetPercentage(25);
      setKnownValue(75);
      setValueResult(null);
    } else if (calculatorMode === "findReverse") {
      setFinalValue(120);
      setAppliedPercentage(20);
      setReverseResult(null);
    }
    
    toast.info("Calculator has been reset");
  };
  
  // Format number to 2 decimal places
  const formatNumber = (num: number) => {
    return num % 1 === 0 ? num.toString() : num.toFixed(2);
  };
  
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Percentage Calculator</h1>
        <p className="text-muted-foreground">
          Calculate percentages, increases, decreases, and solve various percentage problems.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <Card className="lg:col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle>Percentage Calculator</CardTitle>
            <CardDescription>
              Select a calculation type and enter your values
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Calculator Mode */}
            <div className="space-y-2">
              <Label htmlFor="calculatorMode">Calculation Type</Label>
              <Tabs value={calculatorMode} onValueChange={setCalculatorMode} className="w-full">
                <TabsList className="grid grid-cols-2 w-full mb-2">
                  <TabsTrigger value="findPercentage">Find Percentage</TabsTrigger>
                  <TabsTrigger value="findChange">Percentage Change</TabsTrigger>
                </TabsList>
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="findValue">Find Value</TabsTrigger>
                  <TabsTrigger value="findReverse">Reverse Percentage</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Find Percentage of Value */}
            {calculatorMode === "findPercentage" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="percentageValue">What is</Label>
                  <div className="flex items-center">
                    <Input
                      id="percentageValue"
                      type="number"
                      value={percentageValue}
                      onChange={(e) => setPercentageValue(parseFloat(e.target.value) || 0)}
                      className="w-full"
                    />
                    <span className="ml-2 text-sm">%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="baseValue">of</Label>
                  <Input
                    id="baseValue"
                    type="number"
                    value={baseValue}
                    onChange={(e) => setBaseValue(parseFloat(e.target.value) || 0)}
                    className="w-full"
                  />
                </div>
                
                <Button onClick={calculatePercentage} className="w-full flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Calculate
                </Button>
                
                {percentageResult !== null && (
                  <div className="mt-4 p-4 bg-secondary rounded-lg text-center">
                    <p className="text-lg">
                      <span className="font-bold">{formatNumber(percentageResult)}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {percentageValue}% of {baseValue} is {formatNumber(percentageResult)}
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Find Percentage Change */}
            {calculatorMode === "findChange" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="originalValue">Original Value</Label>
                  <Input
                    id="originalValue"
                    type="number"
                    value={originalValue}
                    onChange={(e) => setOriginalValue(parseFloat(e.target.value) || 0)}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newValue">New Value</Label>
                  <Input
                    id="newValue"
                    type="number"
                    value={newValue}
                    onChange={(e) => setNewValue(parseFloat(e.target.value) || 0)}
                    className="w-full"
                  />
                </div>
                
                <Button onClick={calculateChange} className="w-full flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Calculate
                </Button>
                
                {changeResult !== null && (
                  <div className="mt-4 p-4 bg-secondary rounded-lg text-center">
                    <p className="text-lg">
                      <span className="font-bold">{formatNumber(changeResult.percentChange)}%</span>
                      {" "}{changeResult.isIncrease ? "increase" : "decrease"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      From {originalValue} to {newValue}
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Find Value from Percentage */}
            {calculatorMode === "findValue" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="knownValue">Value</Label>
                  <Input
                    id="knownValue"
                    type="number"
                    value={knownValue}
                    onChange={(e) => setKnownValue(parseFloat(e.target.value) || 0)}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="targetPercentage">is what percentage of</Label>
                  <div className="flex items-center">
                    <Input
                      id="targetPercentage"
                      type="number"
                      value={targetPercentage}
                      onChange={(e) => setTargetPercentage(parseFloat(e.target.value) || 0)}
                      className="w-full"
                    />
                    <span className="ml-2 text-sm">%</span>
                  </div>
                </div>
                
                <Button onClick={calculateValue} className="w-full flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Calculate
                </Button>
                
                {valueResult !== null && (
                  <div className="mt-4 p-4 bg-secondary rounded-lg text-center">
                    <p className="text-lg">
                      <span className="font-bold">{formatNumber(valueResult)}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {knownValue} is {targetPercentage}% of {formatNumber(valueResult)}
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Reverse Percentage */}
            {calculatorMode === "findReverse" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="finalValue">Final Value</Label>
                  <Input
                    id="finalValue"
                    type="number"
                    value={finalValue}
                    onChange={(e) => setFinalValue(parseFloat(e.target.value) || 0)}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="appliedPercentage">After increase of</Label>
                  <div className="flex items-center">
                    <Input
                      id="appliedPercentage"
                      type="number"
                      value={appliedPercentage}
                      onChange={(e) => setAppliedPercentage(parseFloat(e.target.value) || 0)}
                      className="w-full"
                    />
                    <span className="ml-2 text-sm">%</span>
                  </div>
                </div>
                
                <Button onClick={calculateReverse} className="w-full flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Calculate
                </Button>
                
                {reverseResult !== null && (
                  <div className="mt-4 p-4 bg-secondary rounded-lg text-center">
                    <p className="text-lg">
                      <span className="font-bold">{formatNumber(reverseResult)}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Original value before {appliedPercentage}% increase
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              onClick={handleReset} 
              className="w-full flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
          </CardFooter>
        </Card>
        
        {/* Explanations and Examples */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Understanding Percentage Calculations</CardTitle>
            <CardDescription>
              Learn how to use percentages in various scenarios
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Common Percentage Formulas */}
            <div>
              <h3 className="text-lg font-medium mb-3">Common Percentage Formulas</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium">Finding a Percentage of a Value</h4>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p className="mb-1">Formula: (Percentage / 100) × Value</p>
                    <p>Example: 15% of 200 = (15 / 100) × 200 = 30</p>
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium">Percentage Change</h4>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p className="mb-1">Formula: ((New - Original) / Original) × 100</p>
                    <p>Example: From 50 to 60 = ((60 - 50) / 50) × 100 = 20% increase</p>
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium">Finding What Percentage A is of B</h4>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p className="mb-1">Formula: (A / B) × 100</p>
                    <p>Example: 30 is what % of 150? (30 / 150) × 100 = 20%</p>
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium">Finding Original Value Before Percentage</h4>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p className="mb-1">Formula: Final Value / (1 + (Percentage / 100))</p>
                    <p>Example: 120 after 20% increase = 120 / 1.2 = 100</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Practical Examples */}
            <div>
              <h3 className="text-lg font-medium mb-3">Practical Examples</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium">Discount Calculation</h4>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p>Original price: $80</p>
                    <p>Discount: 25%</p>
                    <p>Discount amount: $80 × 0.25 = $20</p>
                    <p>Sale price: $80 - $20 = $60</p>
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium">Tax Calculation</h4>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p>Base price: $200</p>
                    <p>Tax rate: 7.5%</p>
                    <p>Tax amount: $200 × 0.075 = $15</p>
                    <p>Total price: $200 + $15 = $215</p>
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium">Tip Calculation</h4>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p>Bill amount: $65</p>
                    <p>Tip percentage: 18%</p>
                    <p>Tip amount: $65 × 0.18 = $11.70</p>
                    <p>Total with tip: $65 + $11.70 = $76.70</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tips for Percentage Calculations */}
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="text-lg font-medium mb-3">Percentage Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• To find 10% of a number, simply move the decimal point one place to the left.</li>
                <li>• To find 5%, find 10% and then divide by 2.</li>
                <li>• To find 20%, find 10% and then multiply by 2.</li>
                <li>• If something increases by X% and then decreases by X%, you don't end up with the original value.</li>
                <li>• When calculating compound percentage changes, multiply the factors rather than adding percentages.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PercentageCalculator;
