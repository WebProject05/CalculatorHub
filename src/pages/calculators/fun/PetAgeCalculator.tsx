
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { formatNumber } from "@/utils/calculators";
import CalculatorTemplate from "@/utils/CalculatorTemplate";
import { Dog, Cat } from "lucide-react";

const PetAgeCalculator = () => {
  // State
  const [petType, setPetType] = useState<"dog" | "cat">("dog");
  const [petAge, setPetAge] = useState<number>(1);
  const [petWeight, setPetWeight] = useState<number>(20);
  const [humanAge, setHumanAge] = useState<number | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  // Calculate pet age in human years
  const calculateHumanAge = () => {
    if (petAge <= 0) {
      toast.error("Pet age must be greater than 0");
      return;
    }

    let calculatedAge = 0;

    if (petType === "dog") {
      // Dog age calculation based on weight and age
      // First year counts as 15 human years
      if (petAge <= 1) {
        calculatedAge = petAge * 15;
      } 
      // Second year adds 9 more years
      else if (petAge <= 2) {
        calculatedAge = 15 + (petAge - 1) * 9;
      } 
      // After that, it depends on size
      else {
        const baseAge = 24; // 15 + 9 for first two years
        
        // Each additional year
        if (petWeight < 10) { // Small dog (under 10 pounds)
          calculatedAge = baseAge + (petAge - 2) * 4;
        } else if (petWeight < 50) { // Medium dog (10-50 pounds)
          calculatedAge = baseAge + (petAge - 2) * 5;
        } else { // Large dog (over 50 pounds)
          calculatedAge = baseAge + (petAge - 2) * 6;
        }
      }
    } else {
      // Cat age calculation
      // First year is 15 human years
      if (petAge <= 1) {
        calculatedAge = petAge * 15;
      } 
      // Second year adds 9 more
      else if (petAge <= 2) {
        calculatedAge = 15 + (petAge - 1) * 9;
      } 
      // After that, each year is about 4 human years
      else {
        calculatedAge = 24 + (petAge - 2) * 4;
      }
    }

    setHumanAge(calculatedAge);
    setShowResults(true);
    toast.success(`Your ${petType}'s age has been calculated!`);
  };

  // Reset the calculator
  const handleReset = () => {
    setPetType("dog");
    setPetAge(1);
    setPetWeight(20);
    setHumanAge(null);
    setShowResults(false);
    toast.info("Calculator has been reset");
  };

  // Render input form
  const renderInputs = () => {
    return (
      <>
        {/* Pet Type Selection */}
        <div className="space-y-3">
          <Label>Pet Type</Label>
          <RadioGroup
            value={petType}
            onValueChange={(value) => setPetType(value as "dog" | "cat")}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dog" id="dog" />
              <Label htmlFor="dog" className="flex items-center gap-1 cursor-pointer">
                <Dog className="h-4 w-4" /> Dog
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cat" id="cat" />
              <Label htmlFor="cat" className="flex items-center gap-1 cursor-pointer">
                <Cat className="h-4 w-4" /> Cat
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Pet Age */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="petAge">Pet Age (years)</Label>
            <span className="text-sm text-muted-foreground">{petAge} years</span>
          </div>
          <Slider
            id="petAge-slider"
            value={[petAge]}
            onValueChange={(values) => setPetAge(values[0])}
            min={0.1}
            max={20}
            step={0.1}
            className="py-2"
          />
          <Input
            id="petAge"
            type="number"
            value={petAge}
            onChange={(e) => setPetAge(parseFloat(e.target.value) || 0)}
            min={0.1}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0.1 years</span>
            <span>20 years</span>
          </div>
        </div>

        {/* Pet Weight (only for dogs) */}
        {petType === "dog" && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="petWeight">Dog Weight (pounds)</Label>
              <span className="text-sm text-muted-foreground">{petWeight} lbs</span>
            </div>
            <Slider
              id="petWeight-slider"
              value={[petWeight]}
              onValueChange={(values) => setPetWeight(values[0])}
              min={1}
              max={150}
              step={1}
              className="py-2"
            />
            <Input
              id="petWeight"
              type="number"
              value={petWeight}
              onChange={(e) => setPetWeight(parseInt(e.target.value) || 0)}
              min={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 lb</span>
              <span>150 lbs</span>
            </div>
          </div>
        )}
      </>
    );
  };

  // Render results
  const renderResults = () => {
    return (
      <>
        {/* Main Result */}
        <div className="p-6 bg-secondary rounded-lg text-center">
          <div className="mb-4">
            {petType === "dog" ? (
              <Dog className="h-16 w-16 mx-auto text-primary" />
            ) : (
              <Cat className="h-16 w-16 mx-auto text-primary" />
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-1">Your {petType} is approximately</p>
          <p className="text-4xl font-bold mb-2">
            {humanAge !== null ? Math.round(humanAge) : 0} human years
          </p>
          <div className="text-sm text-muted-foreground">
            Based on {formatNumber(petAge, 1)} {petType} years
            {petType === "dog" ? ` and ${petWeight} pounds` : ""}
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-medium mb-2">How Pet Age is Calculated</h3>
          <p className="text-sm text-muted-foreground mb-3">
            {petType === "dog"
              ? "Dogs age at different rates depending on their size. Smaller dogs tend to live longer and age more slowly than larger breeds."
              : "Cats age quickly during their first two years and then the aging process slows down."}
          </p>

          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">First year:</span> Equivalent to 15 human years
            </p>
            <p>
              <span className="font-medium">Second year:</span> Adds 9 more human years (total of 24)
            </p>
            {petType === "dog" ? (
              <p>
                <span className="font-medium">Additional years:</span>{" "}
                {petWeight < 10
                  ? "Small dogs (under 10 lbs): 4 human years each"
                  : petWeight < 50
                  ? "Medium dogs (10-50 lbs): 5 human years each"
                  : "Large dogs (over 50 lbs): 6 human years each"}
              </p>
            ) : (
              <p>
                <span className="font-medium">Additional years:</span> About 4 human years each
              </p>
            )}
          </div>
        </div>

        {/* Fun Facts */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Fun Facts</h3>
          <ul className="text-sm space-y-2 list-disc list-inside">
            {petType === "dog" ? (
              <>
                <li>The oldest dog ever recorded lived to be 29 years old (about 130 in human years).</li>
                <li>Small dogs generally live longer than large dogs.</li>
                <li>Dogs reach adulthood faster than humans, that's why the first year equals 15 human years.</li>
              </>
            ) : (
              <>
                <li>The oldest cat ever recorded lived to be 38 years old (about 168 in human years).</li>
                <li>Indoor cats typically live 12-18 years, while outdoor cats live on average 4-5 years.</li>
                <li>A one-year-old cat is developmentally similar to a 15-year-old human.</li>
              </>
            )}
          </ul>
        </div>
      </>
    );
  };

  return (
    <CalculatorTemplate
      title="Pet Age Calculator"
      description="Convert your pet's age to human years for dogs and cats."
      category="fun"
      renderInputs={renderInputs}
      renderResults={renderResults}
      handleCalculate={calculateHumanAge}
      handleReset={handleReset}
      showResults={showResults}
    />
  );
};

export default PetAgeCalculator;
