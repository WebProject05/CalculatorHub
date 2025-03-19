
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { 
  calculatePermutation, 
  calculateCombination,
  factorial,
  formatNumber
} from "@/utils/calculators";
import CalculatorTemplate from "@/utils/CalculatorTemplate";

const PermutationCombinationCalculator = () => {
  // State for calculation mode
  const [mode, setMode] = useState<"permutation" | "combination">("permutation");
  
  // Input values
  const [n, setN] = useState<number>(5);
  const [r, setR] = useState<number>(3);
  
  // Results
  const [result, setResult] = useState<number | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  // Calculate result
  const calculate = () => {
    try {
      // Validate inputs
      if (n < 0 || r < 0) {
        toast.error("Values must be non-negative");
        return;
      }
      
      if (n < r) {
        toast.error("n must be greater than or equal to r");
        return;
      }
      
      // Maximum value to prevent overflow
      if (n > 170) {
        toast.error("n is too large, please use a smaller value");
        return;
      }
      
      // Calculate based on mode
      let calculatedResult: number;
      
      if (mode === "permutation") {
        calculatedResult = calculatePermutation(n, r);
      } else {
        calculatedResult = calculateCombination(n, r);
      }
      
      setResult(calculatedResult);
      setShowResults(true);
      toast.success(`${mode === "permutation" ? "Permutation" : "Combination"} calculated successfully`);
    } catch (error) {
      console.error("Error calculating:", error);
      toast.error("Error in calculation. Please check your inputs.");
    }
  };

  // Reset calculator
  const handleReset = () => {
    setN(5);
    setR(3);
    setResult(null);
    setShowResults(false);
    toast.info("Calculator has been reset");
  };

  // Render input form
  const renderInputs = () => {
    return (
      <div className="space-y-6">
        {/* Calculation Mode */}
        <div>
          <Label className="mb-2 block">Calculation Type</Label>
          <Tabs 
            value={mode} 
            onValueChange={(value) => setMode(value as "permutation" | "combination")}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="permutation">Permutation (nPr)</TabsTrigger>
              <TabsTrigger value="combination">Combination (nCr)</TabsTrigger>
            </TabsList>
            
            <TabsContent value="permutation" className="mt-2">
              <p className="text-sm text-muted-foreground">
                Permutation is the number of ways to arrange r items from a set of n distinct items, 
                where order matters.
              </p>
            </TabsContent>
            
            <TabsContent value="combination" className="mt-2">
              <p className="text-sm text-muted-foreground">
                Combination is the number of ways to select r items from a set of n distinct items, 
                where order doesn't matter.
              </p>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* n input (total items) */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="n">Total Items (n)</Label>
            <span className="text-sm text-muted-foreground">{n}</span>
          </div>
          <Slider
            id="n-slider"
            value={[n]}
            onValueChange={(values) => setN(values[0])}
            min={1}
            max={20}
            step={1}
            className="py-2"
          />
          <Input
            id="n"
            type="number"
            value={n}
            onChange={(e) => setN(parseInt(e.target.value) || 0)}
            min={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>20</span>
          </div>
        </div>
        
        {/* r input (selected items) */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="r">Selected Items (r)</Label>
            <span className="text-sm text-muted-foreground">{r}</span>
          </div>
          <Slider
            id="r-slider"
            value={[r]}
            onValueChange={(values) => setR(values[0])}
            min={0}
            max={n}
            step={1}
            className="py-2"
          />
          <Input
            id="r"
            type="number"
            value={r}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0;
              setR(Math.min(value, n));
            }}
            min={0}
            max={n}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>{n}</span>
          </div>
        </div>
      </div>
    );
  };

  // Render results
  const renderResults = () => {
    return (
      <div className="space-y-6">
        {/* Results Display */}
        <div className="p-6 bg-secondary rounded-lg text-center">
          <p className="text-sm text-muted-foreground mb-1">
            {mode === "permutation" ? "Permutation (nPr)" : "Combination (nCr)"}
          </p>
          <div className="flex items-center justify-center gap-x-2 mb-3">
            <div className="text-3xl font-mono">{n}</div>
            <div className="text-3xl font-mono">{mode === "permutation" ? "P" : "C"}</div>
            <div className="text-3xl font-mono">{r}</div>
            <div className="text-3xl font-mono">=</div>
          </div>
          <p className="text-4xl font-bold mb-2">{result !== null ? formatNumber(result, 0) : "N/A"}</p>
          <p className="text-sm text-muted-foreground">
            {mode === "permutation" 
              ? `The number of ways to arrange ${r} items from ${n} distinct items, where order matters.`
              : `The number of ways to select ${r} items from ${n} distinct items, where order doesn't matter.`
            }
          </p>
        </div>
        
        {/* Explanation */}
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-medium mb-2">How It's Calculated</h3>
          <div className="space-y-2 text-sm">
            {mode === "permutation" ? (
              <>
                <p>
                  <strong>Permutation Formula:</strong> nPr = n! / (n-r)!
                </p>
                <p className="my-2">
                  In this case: {n}P{r} = {n}! / ({n}-{r})!
                </p>
                <p>
                  {n}! = {formatNumber(factorial(n), 0)}
                </p>
                <p>
                  ({n}-{r})! = {n-r}! = {formatNumber(factorial(n-r), 0)}
                </p>
                <p className="mt-2">
                  Therefore: {n}P{r} = {formatNumber(factorial(n), 0)} / {formatNumber(factorial(n-r), 0)} = {formatNumber(result || 0, 0)}
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>Combination Formula:</strong> nCr = n! / (r! × (n-r)!)
                </p>
                <p className="my-2">
                  In this case: {n}C{r} = {n}! / ({r}! × ({n}-{r})!)
                </p>
                <p>
                  {n}! = {formatNumber(factorial(n), 0)}
                </p>
                <p>
                  {r}! = {formatNumber(factorial(r), 0)}
                </p>
                <p>
                  ({n}-{r})! = {n-r}! = {formatNumber(factorial(n-r), 0)}
                </p>
                <p className="mt-2">
                  Therefore: {n}C{r} = {formatNumber(factorial(n), 0)} / ({formatNumber(factorial(r), 0)} × {formatNumber(factorial(n-r), 0)}) = {formatNumber(result || 0, 0)}
                </p>
              </>
            )}
          </div>
        </div>
        
        {/* Examples */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Examples and Applications</h3>
          {mode === "permutation" ? (
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium">Example 1: Arranging People in a Line</h4>
                <p>
                  If you have {n} people and need to arrange {r} of them in a line, there are {formatNumber(result || 0, 0)} possible arrangements.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Example 2: Creating PIN Codes</h4>
                <p>
                  The number of possible {r}-digit PIN codes using digits 0-9 (allowing repetition) would be 10<sup>{r}</sup> = {Math.pow(10, r)}.
                </p>
                <p>
                  Without allowing repetition (if {r} ≤ 10), it would be 10P{r} = {r <= 10 ? formatNumber(calculatePermutation(10, r), 0) : "N/A"}.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Key Differences from Combinations:</h4>
                <ul className="list-disc list-inside mt-1">
                  <li>In permutations, order matters (ABC is different from CBA).</li>
                  <li>Permutations are used when arranging items in specific positions.</li>
                  <li>The formula nPr will always give a result greater than or equal to nCr.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium">Example 1: Selecting a Committee</h4>
                <p>
                  If you need to select {r} people from a group of {n} people to form a committee, there are {formatNumber(result || 0, 0)} possible combinations.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Example 2: Lottery Draws</h4>
                <p>
                  In a lottery where you select 6 numbers from 49, the number of possible combinations is 49C6 = {formatNumber(calculateCombination(49, 6), 0)}.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Key Differences from Permutations:</h4>
                <ul className="list-disc list-inside mt-1">
                  <li>In combinations, order doesn't matter (ABC is the same as CBA).</li>
                  <li>Combinations are used when selecting items without regard to order.</li>
                  <li>The formula nCr will always give a result less than or equal to nPr.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <CalculatorTemplate
      title={`${mode === "permutation" ? "Permutation" : "Combination"} Calculator`}
      description="Calculate permutations and combinations with step-by-step solutions."
      category="math"
      renderInputs={renderInputs}
      renderResults={renderResults}
      handleCalculate={calculate}
      handleReset={handleReset}
      showResults={showResults}
    />
  );
};

export default PermutationCombinationCalculator;
