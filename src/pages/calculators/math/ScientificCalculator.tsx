
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const ScientificCalculator = () => {
  const [display, setDisplay] = useState("0");
  const [currentValue, setCurrentValue] = useState("0");
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [mode, setMode] = useState("standard");

  // Handle digit button clicks
  const handleDigit = (digit: string) => {
    if (waitingForOperand) {
      setCurrentValue(digit);
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setCurrentValue(currentValue === "0" ? digit : currentValue + digit);
      setDisplay(currentValue === "0" ? digit : currentValue + digit);
    }
  };

  // Handle operator button clicks
  const handleOperator = (op: string) => {
    const inputValue = parseFloat(currentValue);
    
    if (previousValue === null) {
      setPreviousValue(currentValue);
    } else if (operator) {
      const result = performCalculation();
      setPreviousValue(String(result));
      setDisplay(String(result));
      
      // Add to history
      setHistory([...history, `${previousValue} ${operator} ${currentValue} = ${result}`]);
    }
    
    setWaitingForOperand(true);
    setOperator(op);
  };

  // Perform calculation based on operator
  const performCalculation = () => {
    const prevValue = parseFloat(previousValue || "0");
    const currValue = parseFloat(currentValue);
    
    let result: number;
    
    switch (operator) {
      case "+":
        result = prevValue + currValue;
        break;
      case "-":
        result = prevValue - currValue;
        break;
      case "×":
        result = prevValue * currValue;
        break;
      case "÷":
        result = prevValue / currValue;
        break;
      case "^":
        result = Math.pow(prevValue, currValue);
        break;
      default:
        result = currValue;
    }
    
    return parseFloat(result.toFixed(8));
  };

  // Handle equals button
  const handleEquals = () => {
    if (!operator || previousValue === null) return;
    
    const result = performCalculation();
    
    // Add to history
    setHistory([...history, `${previousValue} ${operator} ${currentValue} = ${result}`]);
    
    setCurrentValue(String(result));
    setDisplay(String(result));
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  // Handle clear button
  const handleClear = () => {
    setDisplay("0");
    setCurrentValue("0");
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  // Handle decimal point
  const handleDecimal = () => {
    if (waitingForOperand) {
      setCurrentValue("0.");
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (currentValue.indexOf(".") === -1) {
      setCurrentValue(currentValue + ".");
      setDisplay(currentValue + ".");
    }
  };

  // Handle backspace
  const handleBackspace = () => {
    if (waitingForOperand) return;
    
    if (currentValue.length > 1) {
      setCurrentValue(currentValue.slice(0, -1));
      setDisplay(currentValue.slice(0, -1));
    } else {
      setCurrentValue("0");
      setDisplay("0");
    }
  };

  // Handle scientific functions
  const handleFunction = (func: string) => {
    const value = parseFloat(currentValue);
    let result: number;
    
    switch (func) {
      case "sin":
        result = mode === "degree" ? Math.sin(value * Math.PI / 180) : Math.sin(value);
        break;
      case "cos":
        result = mode === "degree" ? Math.cos(value * Math.PI / 180) : Math.cos(value);
        break;
      case "tan":
        result = mode === "degree" ? Math.tan(value * Math.PI / 180) : Math.tan(value);
        break;
      case "log":
        result = Math.log10(value);
        break;
      case "ln":
        result = Math.log(value);
        break;
      case "sqrt":
        result = Math.sqrt(value);
        break;
      case "square":
        result = value * value;
        break;
      case "inverse":
        result = 1 / value;
        break;
      case "factorial":
        result = factorial(value);
        break;
      case "percent":
        result = value / 100;
        break;
      case "pi":
        result = Math.PI;
        break;
      case "e":
        result = Math.E;
        break;
      default:
        result = value;
    }
    
    const displayResult = parseFloat(result.toFixed(8));
    setCurrentValue(String(displayResult));
    setDisplay(String(displayResult));
    setWaitingForOperand(true);
    
    // Add to history
    setHistory([...history, `${func}(${value}) = ${displayResult}`]);
  };

  // Calculate factorial (simple version)
  const factorial = (n: number): number => {
    if (n === 0 || n === 1) return 1;
    if (!Number.isInteger(n) || n < 0) return NaN;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  // Handle memory functions
  const handleMemory = (action: string) => {
    switch (action) {
      case "MS":
        setMemory(currentValue);
        toast.success("Value stored in memory");
        break;
      case "MR":
        if (memory !== null) {
          setCurrentValue(memory);
          setDisplay(memory);
        }
        break;
      case "MC":
        setMemory(null);
        toast.success("Memory cleared");
        break;
      case "M+":
        if (memory !== null) {
          const result = parseFloat(memory) + parseFloat(currentValue);
          setMemory(String(result));
          toast.success("Value added to memory");
        } else {
          setMemory(currentValue);
          toast.success("Value stored in memory");
        }
        break;
      case "M-":
        if (memory !== null) {
          const result = parseFloat(memory) - parseFloat(currentValue);
          setMemory(String(result));
          toast.success("Value subtracted from memory");
        }
        break;
    }
    setWaitingForOperand(true);
  };

  // Copy result to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(display);
    toast.success("Result copied to clipboard");
  };

  // Clear history
  const clearHistory = () => {
    setHistory([]);
    toast.success("History cleared");
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Scientific Calculator</h1>
        <p className="text-muted-foreground">
          A comprehensive calculator for scientific, engineering, and mathematical calculations.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calculator */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Calculator</CardTitle>
            <CardDescription>
              Perform calculations with advanced mathematical functions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Calculator Display */}
            <div className="relative">
              <Input
                className="text-right text-2xl h-14 font-mono"
                value={display}
                readOnly
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Mode Selector */}
            <div className="grid grid-cols-2 gap-2">
              <Tabs value={mode} onValueChange={setMode} className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="radian">Radian</TabsTrigger>
                  <TabsTrigger value="degree">Degree</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Memory Buttons */}
            <div className="grid grid-cols-5 gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleMemory("MC")}
                disabled={memory === null}
              >
                MC
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleMemory("MR")}
                disabled={memory === null}
              >
                MR
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleMemory("MS")}
              >
                MS
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleMemory("M+")}
              >
                M+
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleMemory("M-")}
                disabled={memory === null}
              >
                M-
              </Button>
            </div>
            
            {/* Scientific Functions */}
            <div className="grid grid-cols-5 gap-2">
              <Button
                variant="outline"
                onClick={() => handleFunction("sin")}
              >
                sin
              </Button>
              <Button
                variant="outline"
                onClick={() => handleFunction("cos")}
              >
                cos
              </Button>
              <Button
                variant="outline"
                onClick={() => handleFunction("tan")}
              >
                tan
              </Button>
              <Button
                variant="outline"
                onClick={() => handleFunction("log")}
              >
                log
              </Button>
              <Button
                variant="outline"
                onClick={() => handleFunction("ln")}
              >
                ln
              </Button>
              <Button
                variant="outline"
                onClick={() => handleFunction("square")}
              >
                x²
              </Button>
              <Button
                variant="outline"
                onClick={() => handleFunction("sqrt")}
              >
                √
              </Button>
              <Button
                variant="outline"
                onClick={() => handleFunction("factorial")}
              >
                x!
              </Button>
              <Button
                variant="outline"
                onClick={() => handleFunction("pi")}
              >
                π
              </Button>
              <Button
                variant="outline"
                onClick={() => handleFunction("e")}
              >
                e
              </Button>
            </div>
            
            {/* Calculator Keypad */}
            <div className="grid grid-cols-4 gap-2">
              <Button
                variant="outline"
                onClick={handleClear}
              >
                C
              </Button>
              <Button
                variant="outline"
                onClick={() => handleFunction("percent")}
              >
                %
              </Button>
              <Button
                variant="outline"
                onClick={handleBackspace}
              >
                ⌫
              </Button>
              <Button
                variant="outline"
                onClick={() => handleOperator("÷")}
              >
                ÷
              </Button>
              
              <Button
                variant="default"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                onClick={() => handleDigit("7")}
              >
                7
              </Button>
              <Button
                variant="default"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                onClick={() => handleDigit("8")}
              >
                8
              </Button>
              <Button
                variant="default"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                onClick={() => handleDigit("9")}
              >
                9
              </Button>
              <Button
                variant="outline"
                onClick={() => handleOperator("×")}
              >
                ×
              </Button>
              
              <Button
                variant="default"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                onClick={() => handleDigit("4")}
              >
                4
              </Button>
              <Button
                variant="default"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                onClick={() => handleDigit("5")}
              >
                5
              </Button>
              <Button
                variant="default"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                onClick={() => handleDigit("6")}
              >
                6
              </Button>
              <Button
                variant="outline"
                onClick={() => handleOperator("-")}
              >
                -
              </Button>
              
              <Button
                variant="default"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                onClick={() => handleDigit("1")}
              >
                1
              </Button>
              <Button
                variant="default"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                onClick={() => handleDigit("2")}
              >
                2
              </Button>
              <Button
                variant="default"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                onClick={() => handleDigit("3")}
              >
                3
              </Button>
              <Button
                variant="outline"
                onClick={() => handleOperator("+")}
              >
                +
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleOperator("^")}
              >
                x^y
              </Button>
              <Button
                variant="default"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                onClick={() => handleDigit("0")}
              >
                0
              </Button>
              <Button
                variant="default"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                onClick={handleDecimal}
              >
                .
              </Button>
              <Button
                variant="default"
                onClick={handleEquals}
                className="bg-primary text-primary-foreground hover:opacity-90"
              >
                =
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* History */}
        <Card className="lg:col-span-1 shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>History</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearHistory}
                disabled={history.length === 0}
              >
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 h-[520px] overflow-y-auto pr-2">
              {history.length > 0 ? (
                [...history].reverse().map((item, index) => (
                  <div 
                    key={index}
                    className="p-2 bg-secondary rounded-md text-right cursor-pointer hover:bg-secondary/80 transition-colors"
                    onClick={() => {
                      const result = item.split(" = ")[1];
                      setCurrentValue(result);
                      setDisplay(result);
                    }}
                  >
                    <div className="text-sm text-muted-foreground">{item.split(" = ")[0]}</div>
                    <div className="font-mono">{item.split(" = ")[1]}</div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No calculations yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScientificCalculator;
