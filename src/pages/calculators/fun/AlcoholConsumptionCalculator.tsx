
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Wine, Clock, AlertTriangle } from "lucide-react";
import { formatNumber } from "@/utils/calculators";
import CalculatorTemplate from "@/utils/CalculatorTemplate";

// Define drink types with their alcohol content
const drinkTypes = [
  { id: "beer", name: "Beer", avgContent: 5, servingSize: 355, unit: "ml" }, // 12oz at 5%
  { id: "wine", name: "Wine", avgContent: 12, servingSize: 148, unit: "ml" }, // 5oz at 12%
  { id: "liquor", name: "Liquor/Spirits", avgContent: 40, servingSize: 44, unit: "ml" }, // 1.5oz at 40%
  { id: "cocktail", name: "Cocktail", avgContent: 15, servingSize: 207, unit: "ml" }, // 7oz at 15%
  { id: "cider", name: "Hard Cider", avgContent: 6, servingSize: 355, unit: "ml" }, // 12oz at 6%
  { id: "malt", name: "Malt Beverage", avgContent: 7, servingSize: 355, unit: "ml" }, // 12oz at 7%
  { id: "custom", name: "Custom Drink", avgContent: 0, servingSize: 0, unit: "ml" }
];

// Define gender factors for BAC calculation
const genderFactors = {
  male: { bodyWaterPercentage: 0.58, metabolismRate: 0.015 },
  female: { bodyWaterPercentage: 0.49, metabolismRate: 0.017 }
};

const AlcoholConsumptionCalculator = () => {
  // Input states
  const [gender, setGender] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState<number>(70);
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [height, setHeight] = useState<number>(175);
  const [heightUnit, setHeightUnit] = useState<"cm" | "in">("cm");
  const [age, setAge] = useState<number>(30);
  const [foodIntake, setFoodIntake] = useState<"empty" | "light" | "full">("light");
  
  // Drinks tracking
  const [drinks, setDrinks] = useState<Array<{
    type: string,
    alcoholContent: number,
    servingSize: number,
    servingUnit: string,
    quantity: number,
    timePassed: number
  }>>([
    {
      type: "beer",
      alcoholContent: 5,
      servingSize: 355,
      servingUnit: "ml",
      quantity: 1,
      timePassed: 0
    }
  ]);
  
  // Results
  const [bac, setBac] = useState<number | null>(null);
  const [totalAlcohol, setTotalAlcohol] = useState<number | null>(null);
  const [soberTime, setSoberTime] = useState<number | null>(null);
  const [impairmentLevel, setImpairmentLevel] = useState<string | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  // Add a drink to the list
  const addDrink = () => {
    setDrinks([
      ...drinks,
      {
        type: "beer",
        alcoholContent: 5,
        servingSize: 355,
        servingUnit: "ml",
        quantity: 1,
        timePassed: 0
      }
    ]);
  };

  // Remove a drink from the list
  const removeDrink = (index: number) => {
    if (drinks.length <= 1) {
      toast.error("You must have at least one drink entry");
      return;
    }
    
    const newDrinks = [...drinks];
    newDrinks.splice(index, 1);
    setDrinks(newDrinks);
  };

  // Update drink details
  const updateDrink = (index: number, field: string, value: any) => {
    const newDrinks = [...drinks];
    
    if (field === "type") {
      const selectedDrink = drinkTypes.find(drink => drink.id === value);
      if (selectedDrink) {
        newDrinks[index] = {
          ...newDrinks[index],
          type: value,
          alcoholContent: selectedDrink.id === "custom" ? newDrinks[index].alcoholContent : selectedDrink.avgContent,
          servingSize: selectedDrink.id === "custom" ? newDrinks[index].servingSize : selectedDrink.servingSize,
          servingUnit: selectedDrink.id === "custom" ? newDrinks[index].servingUnit : selectedDrink.unit
        };
      }
    } else {
      newDrinks[index] = {
        ...newDrinks[index],
        [field]: value
      };
    }
    
    setDrinks(newDrinks);
  };

  // Calculate BAC
  const calculateBAC = () => {
    try {
      // Validate weight
      if (weight <= 0) {
        toast.error("Weight must be greater than zero");
        return;
      }
      
      // Convert weight to kg if needed
      const weightInKg = weightUnit === "lbs" ? weight * 0.453592 : weight;
      
      // Get gender factor
      const genderFactor = genderFactors[gender];
      
      // Calculate body water (Widmark formula)
      const bodyWater = weightInKg * genderFactor.bodyWaterPercentage;
      
      // Calculate total alcohol consumed in grams
      let totalAlcoholGrams = 0;
      
      for (const drink of drinks) {
        // Calculate pure alcohol in ml
        // formula: serving size (ml) * alcohol percentage * quantity
        const alcoholVolumeML = drink.servingSize * (drink.alcoholContent / 100) * drink.quantity;
        
        // Convert to grams (density of alcohol = 0.789 g/ml)
        const alcoholGrams = alcoholVolumeML * 0.789;
        
        // Calculate alcohol eliminated over time
        const alcoholEliminated = genderFactor.metabolismRate * drink.timePassed * bodyWater;
        
        // Subtract eliminated alcohol
        const alcoholRemaining = Math.max(0, alcoholGrams - alcoholEliminated);
        
        totalAlcoholGrams += alcoholRemaining;
      }
      
      setTotalAlcohol(totalAlcoholGrams);
      
      // Food intake adjustment
      let foodFactor = 1.0;
      if (foodIntake === "full") {
        foodFactor = 1.2; // Full stomach slows absorption
      } else if (foodIntake === "empty") {
        foodFactor = 0.85; // Empty stomach speeds absorption
      }
      
      // Calculate BAC using Widmark formula
      // BAC = (alcohol in grams / (body weight in kg * body water percentage)) * 100
      const calculatedBAC = (totalAlcoholGrams / (bodyWater * foodFactor)) / 10;
      
      // Round to 3 decimal places
      const roundedBAC = Math.round(calculatedBAC * 1000) / 1000;
      setBac(roundedBAC);
      
      // Calculate time to sober (BAC returns to 0)
      // Time = BAC / metabolism rate
      const hoursToSober = roundedBAC / genderFactor.metabolismRate;
      setSoberTime(hoursToSober);
      
      // Determine impairment level
      setImpairmentLevel(getImpairmentLevel(roundedBAC));
      
      setShowResults(true);
      toast.success("BAC calculated successfully");
    } catch (error) {
      console.error("Error calculating BAC:", error);
      toast.error("Error in calculation. Please check your inputs.");
    }
  };

  // Determine impairment level based on BAC
  const getImpairmentLevel = (bac: number): string => {
    if (bac < 0.02) return "No impairment";
    if (bac < 0.04) return "Subtle effects";
    if (bac < 0.08) return "Mild impairment";
    if (bac < 0.15) return "Significant impairment";
    if (bac < 0.30) return "Severe impairment";
    return "Life-threatening";
  };

  // Reset calculator
  const handleReset = () => {
    setGender("male");
    setWeight(70);
    setWeightUnit("kg");
    setHeight(175);
    setHeightUnit("cm");
    setAge(30);
    setFoodIntake("light");
    setDrinks([
      {
        type: "beer",
        alcoholContent: 5,
        servingSize: 355,
        servingUnit: "ml",
        quantity: 1,
        timePassed: 0
      }
    ]);
    setBac(null);
    setTotalAlcohol(null);
    setSoberTime(null);
    setImpairmentLevel(null);
    setShowResults(false);
    toast.info("Calculator has been reset");
  };

  // Get BAC color based on level
  const getBacColor = (bac: number | null): string => {
    if (bac === null) return "text-muted-foreground";
    if (bac < 0.02) return "text-green-500";
    if (bac < 0.04) return "text-blue-500";
    if (bac < 0.08) return "text-yellow-500";
    if (bac < 0.15) return "text-orange-500";
    if (bac < 0.30) return "text-red-500";
    return "text-purple-500";
  };

  // Render input form
  const renderInputs = () => {
    return (
      <div className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Personal Information</h3>
          
          {/* Gender Selection */}
          <div className="space-y-2">
            <Label>Gender</Label>
            <RadioGroup 
              value={gender} 
              onValueChange={(value) => setGender(value as "male" | "female")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Weight Input */}
          <div className="grid grid-cols-3 gap-2 items-end">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                min={1}
              />
            </div>
            <Select value={weightUnit} onValueChange={(value) => setWeightUnit(value as "kg" | "lbs")}>
              <SelectTrigger>
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">kg</SelectItem>
                <SelectItem value="lbs">lbs</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Age Input */}
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value) || 0)}
              min={18}
              max={100}
            />
          </div>
          
          {/* Food Intake */}
          <div className="space-y-2">
            <Label htmlFor="foodIntake">Food Intake</Label>
            <Select value={foodIntake} onValueChange={(value) => setFoodIntake(value as "empty" | "light" | "full")}>
              <SelectTrigger id="foodIntake">
                <SelectValue placeholder="Select food intake" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="empty">Empty Stomach</SelectItem>
                <SelectItem value="light">Light Meal</SelectItem>
                <SelectItem value="full">Full Meal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Drinks */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Alcoholic Drinks</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addDrink}
            >
              Add Drink
            </Button>
          </div>
          
          {drinks.map((drink, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Drink {index + 1}</h4>
                {drinks.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDrink(index)}
                    className="h-8 px-2 text-destructive"
                  >
                    Remove
                  </Button>
                )}
              </div>
              
              {/* Drink Type */}
              <div className="space-y-2">
                <Label htmlFor={`drink-type-${index}`}>Drink Type</Label>
                <Select 
                  value={drink.type} 
                  onValueChange={(value) => updateDrink(index, "type", value)}
                >
                  <SelectTrigger id={`drink-type-${index}`}>
                    <SelectValue placeholder="Select drink type" />
                  </SelectTrigger>
                  <SelectContent>
                    {drinkTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Custom Drink Settings (only if custom) */}
              {drink.type === "custom" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor={`alcohol-content-${index}`}>
                      Alcohol Content (%)
                    </Label>
                    <Input
                      id={`alcohol-content-${index}`}
                      type="number"
                      value={drink.alcoholContent}
                      onChange={(e) => updateDrink(index, "alcoholContent", parseFloat(e.target.value) || 0)}
                      min={0}
                      max={100}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor={`serving-size-${index}`}>
                        Serving Size
                      </Label>
                      <Input
                        id={`serving-size-${index}`}
                        type="number"
                        value={drink.servingSize}
                        onChange={(e) => updateDrink(index, "servingSize", parseFloat(e.target.value) || 0)}
                        min={0}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`serving-unit-${index}`}>Unit</Label>
                      <Select 
                        value={drink.servingUnit} 
                        onValueChange={(value) => updateDrink(index, "servingUnit", value)}
                      >
                        <SelectTrigger id={`serving-unit-${index}`}>
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ml">ml</SelectItem>
                          <SelectItem value="oz">oz</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}
              
              {/* Quantity and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`quantity-${index}`}>
                    Number of Drinks
                  </Label>
                  <Input
                    id={`quantity-${index}`}
                    type="number"
                    value={drink.quantity}
                    onChange={(e) => updateDrink(index, "quantity", parseInt(e.target.value) || 0)}
                    min={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`time-${index}`}>
                    Time Since First Drink (hours)
                  </Label>
                  <Input
                    id={`time-${index}`}
                    type="number"
                    value={drink.timePassed}
                    onChange={(e) => updateDrink(index, "timePassed", parseFloat(e.target.value) || 0)}
                    min={0}
                    step={0.5}
                  />
                </div>
              </div>
              
              {/* Standard Drink Equivalent */}
              <div className="text-xs text-muted-foreground pt-2">
                {drink.type !== "custom" ? (
                  <>
                    {(() => {
                      // Calculate standard drinks (1 standard drink = 14g of pure alcohol)
                      const type = drinkTypes.find(t => t.id === drink.type);
                      if (!type) return null;
                      
                      const alcoholVolumeML = type.servingSize * (type.avgContent / 100);
                      const alcoholGrams = alcoholVolumeML * 0.789;
                      const standardDrinks = alcoholGrams / 14;
                      
                      return (
                        <p>One {type.name} ({type.servingSize}{type.unit}, {type.avgContent}% alcohol) ≈ {standardDrinks.toFixed(1)} standard drinks</p>
                      );
                    })()}
                  </>
                ) : (
                  <>
                    {(() => {
                      // Calculate standard drinks for custom drink
                      const alcoholVolumeML = drink.servingSize * (drink.alcoholContent / 100);
                      const alcoholGrams = alcoholVolumeML * 0.789;
                      const standardDrinks = alcoholGrams / 14;
                      
                      return (
                        <p>Your custom drink ≈ {standardDrinks.toFixed(1)} standard drinks</p>
                      );
                    })()}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Warning */}
        <div className="p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-900 rounded-lg flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800 dark:text-yellow-200">
            <p className="font-medium">Disclaimer</p>
            <p className="mt-1">
              This calculator provides estimates only and should not be used to determine whether you are fit to drive, operate machinery, or engage in any activity requiring coordination. Always drink responsibly and never drink and drive.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Render results
  const renderResults = () => {
    return (
      <div className="space-y-6">
        {/* BAC Results */}
        <div className="p-6 bg-secondary rounded-lg text-center">
          <p className="text-sm text-muted-foreground mb-1">Estimated Blood Alcohol Concentration (BAC)</p>
          <p className={`text-4xl font-bold ${getBacColor(bac)}`}>
            {bac !== null ? `${bac.toFixed(3)}%` : "N/A"}
          </p>
          
          <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-background">
            <p className="text-sm">
              <span className="mr-1">Impairment Level:</span>
              <span className={`font-medium ${getBacColor(bac)}`}>
                {impairmentLevel}
              </span>
            </p>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-background rounded-lg p-3">
              <p className="text-sm text-muted-foreground mb-1">Estimated Time Until Sober</p>
              {soberTime !== null ? (
                <p className="text-xl font-medium">
                  {soberTime <= 0 ? "Already Sober" : (
                    `${Math.floor(soberTime)} hrs, ${Math.round((soberTime % 1) * 60)} mins`
                  )}
                </p>
              ) : (
                <p className="text-xl font-medium">N/A</p>
              )}
            </div>
            
            <div className="bg-background rounded-lg p-3">
              <p className="text-sm text-muted-foreground mb-1">Total Alcohol Consumed</p>
              <p className="text-xl font-medium">
                {totalAlcohol !== null ? `${formatNumber(totalAlcohol, 1)} grams` : "N/A"}
              </p>
            </div>
          </div>
        </div>
        
        {/* BAC Level Scale */}
        <div className="space-y-2">
          <h3 className="font-medium">BAC Level Reference</h3>
          <div className="overflow-hidden border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3">BAC Level</th>
                  <th className="text-left p-3">Effects & Impairment</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-muted">
                  <td className="p-3">
                    <span className="text-green-500 font-medium">0.00 - 0.019%</span>
                  </td>
                  <td className="p-3">
                    <p>No significant impairment</p>
                    <p className="text-xs text-muted-foreground">Little to no effect observed</p>
                  </td>
                </tr>
                
                <tr className="border-b border-muted">
                  <td className="p-3">
                    <span className="text-blue-500 font-medium">0.02 - 0.039%</span>
                  </td>
                  <td className="p-3">
                    <p>Subtle effects</p>
                    <p className="text-xs text-muted-foreground">Mild relaxation, slight euphoria, minor judgment impairment</p>
                  </td>
                </tr>
                
                <tr className="border-b border-muted">
                  <td className="p-3">
                    <span className="text-yellow-500 font-medium">0.04 - 0.079%</span>
                  </td>
                  <td className="p-3">
                    <p>Mild impairment</p>
                    <p className="text-xs text-muted-foreground">Relaxation, euphoria, reduced inhibition, impaired reasoning</p>
                  </td>
                </tr>
                
                <tr className="border-b border-muted">
                  <td className="p-3">
                    <span className="text-orange-500 font-medium">0.08 - 0.149%</span>
                  </td>
                  <td className="p-3">
                    <p>Significant impairment</p>
                    <p className="text-xs text-muted-foreground">Legally intoxicated, poor muscle coordination, slurred speech</p>
                  </td>
                </tr>
                
                <tr className="border-b border-muted">
                  <td className="p-3">
                    <span className="text-red-500 font-medium">0.15 - 0.299%</span>
                  </td>
                  <td className="p-3">
                    <p>Severe impairment</p>
                    <p className="text-xs text-muted-foreground">Major loss of coordination, blurred vision, potential blackout</p>
                  </td>
                </tr>
                
                <tr>
                  <td className="p-3">
                    <span className="text-purple-500 font-medium">0.30%+</span>
                  </td>
                  <td className="p-3">
                    <p>Life-threatening</p>
                    <p className="text-xs text-muted-foreground">Unconsciousness, risk of coma, respiratory depression</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Your BAC over time */}
        {bac !== null && bac > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">BAC Elimination Timeline</h3>
            <div className="bg-secondary p-4 rounded-lg">
              <p className="text-sm mb-4">
                At your current BAC of {bac.toFixed(3)}%, here's how your BAC will decrease over time:
              </p>
              
              <div className="space-y-3">
                {(() => {
                  const timePoints = [];
                  const metabolismRate = genderFactors[gender].metabolismRate;
                  let currentBac = bac;
                  let hoursPassed = 0;
                  
                  while (currentBac > 0.001 && timePoints.length < 8) {
                    timePoints.push({
                      hours: hoursPassed,
                      bac: currentBac
                    });
                    
                    hoursPassed += 1;
                    currentBac -= metabolismRate;
                    currentBac = Math.max(0, currentBac);
                  }
                  
                  // Add final point (sober)
                  if (currentBac <= 0.001) {
                    timePoints.push({
                      hours: soberTime,
                      bac: 0
                    });
                  }
                  
                  return timePoints.map((point, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="bg-muted rounded-lg px-3 py-1 w-24 text-center">
                        <p className="text-xs text-muted-foreground">
                          {point.hours === 0 ? "Now" : (
                            `+${point.hours === Math.floor(point.hours) 
                              ? point.hours 
                              : point.hours.toFixed(1)} ${point.hours === 1 ? "hour" : "hours"}`
                          )}
                        </p>
                      </div>
                      <div className="flex-1 bg-secondary border rounded-full h-2.5">
                        <div 
                          className={`rounded-full h-2.5 ${getBacColor(point.bac)}`} 
                          style={{ width: `${(point.bac / bac) * 100}%` }}
                        ></div>
                      </div>
                      <div className="w-20 text-right">
                        <span className={`text-sm font-medium ${getBacColor(point.bac)}`}>
                          {point.bac.toFixed(3)}%
                        </span>
                      </div>
                    </div>
                  ));
                })()}
              </div>
              
              <p className="text-xs text-muted-foreground mt-4">
                Note: The body metabolizes alcohol at a relatively constant rate of approximately {genderFactors[gender].metabolismRate * 100}% BAC per hour for your gender.
              </p>
            </div>
          </div>
        )}
        
        {/* Drink Standardization */}
        <div className="space-y-2">
          <h3 className="font-medium">Standard Drink Reference</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="p-3 border rounded-lg flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <span className="text-xl">🍺</span>
              </div>
              <div>
                <p className="text-sm font-medium">Beer (5% alc.)</p>
                <p className="text-xs text-muted-foreground">12 oz (355 ml) = 1 standard drink</p>
              </div>
            </div>
            
            <div className="p-3 border rounded-lg flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 text-red-600">
                <span className="text-xl">🍷</span>
              </div>
              <div>
                <p className="text-sm font-medium">Wine (12% alc.)</p>
                <p className="text-xs text-muted-foreground">5 oz (148 ml) = 1 standard drink</p>
              </div>
            </div>
            
            <div className="p-3 border rounded-lg flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <span className="text-xl">🥃</span>
              </div>
              <div>
                <p className="text-sm font-medium">Spirits (40% alc.)</p>
                <p className="text-xs text-muted-foreground">1.5 oz (44 ml) = 1 standard drink</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            A standard drink in the US contains approximately 14 grams of pure alcohol.
          </p>
        </div>
        
        {/* Safety tips */}
        <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-900 rounded-lg">
          <h3 className="font-medium text-red-800 dark:text-red-200 mb-2">Important Safety Information</h3>
          <ul className="text-sm text-red-700 dark:text-red-300 space-y-2">
            <li>• Never drive or operate machinery after consuming alcohol, regardless of your BAC.</li>
            <li>• This calculator provides estimates only and should not be used to determine if you're fit to drive.</li>
            <li>• Individual factors such as medications, health conditions, and tolerance can affect impairment.</li>
            <li>• When in doubt, use designated drivers, taxis, or ridesharing services.</li>
            <li>• Drink water between alcoholic beverages to stay hydrated and pace yourself.</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <CalculatorTemplate
      title="Alcohol Consumption Calculator"
      description="Estimate blood alcohol content (BAC) and understand impairment levels based on drinks consumed."
      category="fun"
      renderInputs={renderInputs}
      renderResults={renderResults}
      handleCalculate={calculateBAC}
      handleReset={handleReset}
      showResults={showResults}
      calculateButtonIcon={<Wine className="h-4 w-4" />}
    />
  );
};

export default AlcoholConsumptionCalculator;
