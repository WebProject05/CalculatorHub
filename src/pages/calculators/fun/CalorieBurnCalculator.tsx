
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { formatNumber } from "@/utils/calculators";
import CalculatorTemplate from "@/utils/CalculatorTemplate";
import { Flame, Plus, Trash2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface Activity {
  id: number;
  name: string;
  duration: number;
  caloriesBurned: number;
  met: number;
}

// MET (Metabolic Equivalent of Task) values for various activities
const activitiesMET: { [key: string]: number } = {
  "Walking (3 mph)": 3.5,
  "Running (6 mph)": 10.0,
  "Cycling (moderate)": 8.0,
  "Swimming (moderate)": 7.0,
  "Weight Training": 3.5,
  "Yoga": 2.5,
  "Dancing": 4.5,
  "Hiking": 6.0,
  "Basketball": 6.5,
  "Tennis": 7.0,
  "Soccer": 7.0,
  "Rowing": 7.0,
  "Elliptical Trainer": 5.0,
  "Aerobics": 7.0,
  "Pilates": 3.0,
  "Skiing": 7.0,
  "Gardening": 3.5,
  "House Cleaning": 3.0,
  "Stair Climbing": 4.0,
  "Jumping Rope": 10.0,
};

const CalorieBurnCalculator = () => {
  // State for form inputs
  const [gender, setGender] = useState<string>("male");
  const [weight, setWeight] = useState<number>(70);
  const [weightUnit, setWeightUnit] = useState<string>("kg");
  const [age, setAge] = useState<number>(30);
  const [height, setHeight] = useState<number>(170);
  const [heightUnit, setHeightUnit] = useState<string>("cm");
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      name: "Walking (3 mph)",
      duration: 30,
      caloriesBurned: 0,
      met: activitiesMET["Walking (3 mph)"]
    }
  ]);
  
  // State for results
  const [showResults, setShowResults] = useState<boolean>(false);
  const [dailyCalories, setDailyCalories] = useState<number | null>(null);
  const [activityCalories, setActivityCalories] = useState<number | null>(null);
  const [totalCalories, setTotalCalories] = useState<number | null>(null);
  
  // Add a new activity
  const addActivity = () => {
    const newActivity = {
      id: Date.now(),
      name: Object.keys(activitiesMET)[0],
      duration: 30,
      caloriesBurned: 0,
      met: activitiesMET[Object.keys(activitiesMET)[0]]
    };
    
    setActivities([...activities, newActivity]);
  };
  
  // Remove an activity
  const removeActivity = (id: number) => {
    if (activities.length <= 1) {
      toast.error("You must have at least one activity");
      return;
    }
    
    setActivities(activities.filter(activity => activity.id !== id));
  };
  
  // Update activity
  const updateActivity = (id: number, field: keyof Activity, value: string | number) => {
    const updatedActivities = activities.map(activity => {
      if (activity.id === id) {
        if (field === 'name') {
          return {
            ...activity,
            [field]: value,
            met: activitiesMET[value as string]
          };
        }
        return { ...activity, [field]: value };
      }
      return activity;
    });
    
    setActivities(updatedActivities);
  };
  
  // Convert weight to kg if needed
  const getWeightInKg = () => {
    return weightUnit === "kg" ? weight : weight * 0.45359237;
  };
  
  // Convert height to cm if needed
  const getHeightInCm = () => {
    return heightUnit === "cm" ? height : height * 2.54;
  };
  
  // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor equation
  const calculateBMR = () => {
    const weightKg = getWeightInKg();
    const heightCm = getHeightInCm();
    
    if (gender === "male") {
      return (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
    } else {
      return (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
    }
  };
  
  // Calculate calories burned for each activity
  const calculateActivityCalories = () => {
    const weightKg = getWeightInKg();
    
    const updatedActivities = activities.map(activity => {
      // Calories burned = MET * weight in kg * duration in hours
      const durationHours = activity.duration / 60;
      const caloriesBurned = activity.met * weightKg * durationHours;
      
      return {
        ...activity,
        caloriesBurned
      };
    });
    
    setActivities(updatedActivities);
    
    // Calculate total calories burned from activities
    return updatedActivities.reduce((total, activity) => total + activity.caloriesBurned, 0);
  };
  
  // Calculate total daily calories
  const calculateDailyCalories = () => {
    // BMR (calories burned at rest)
    const bmr = calculateBMR();
    
    // Activity calories
    const activityCals = calculateActivityCalories();
    
    setDailyCalories(bmr);
    setActivityCalories(activityCals);
    setTotalCalories(bmr + activityCals);
    
    setShowResults(true);
    toast.success("Calorie calculations completed");
  };
  
  // Reset calculator
  const handleReset = () => {
    setGender("male");
    setWeight(70);
    setWeightUnit("kg");
    setAge(30);
    setHeight(170);
    setHeightUnit("cm");
    setActivities([
      {
        id: 1,
        name: "Walking (3 mph)",
        duration: 30,
        caloriesBurned: 0,
        met: activitiesMET["Walking (3 mph)"]
      }
    ]);
    setDailyCalories(null);
    setActivityCalories(null);
    setTotalCalories(null);
    setShowResults(false);
    toast.info("Calculator has been reset");
  };
  
  // Render inputs
  const renderInputs = () => {
    return (
      <>
        {/* Gender Selection */}
        <div className="space-y-3">
          <Label>Gender</Label>
          <RadioGroup
            value={gender}
            onValueChange={setGender}
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
        
        {/* Physical Details */}
        <div className="space-y-4">
          {/* Weight */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="weight">Weight</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{weight} {weightUnit}</span>
                <select
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value)}
                  className="h-7 rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm"
                >
                  <option value="kg">kg</option>
                  <option value="lb">lb</option>
                </select>
              </div>
            </div>
            <Input
              id="weight"
              type="number"
              min="30"
              max={weightUnit === "kg" ? "200" : "440"}
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
              className="w-full"
            />
            <Slider
              id="weight-slider"
              value={[weight]}
              onValueChange={(values) => setWeight(values[0])}
              min={weightUnit === "kg" ? 30 : 66}
              max={weightUnit === "kg" ? 200 : 440}
              step={weightUnit === "kg" ? 1 : 2}
              className="py-2"
            />
          </div>
          
          {/* Height */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="height">Height</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{height} {heightUnit}</span>
                <select
                  value={heightUnit}
                  onChange={(e) => setHeightUnit(e.target.value)}
                  className="h-7 rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm"
                >
                  <option value="cm">cm</option>
                  <option value="in">in</option>
                </select>
              </div>
            </div>
            <Input
              id="height"
              type="number"
              min={heightUnit === "cm" ? "120" : "48"}
              max={heightUnit === "cm" ? "220" : "87"}
              value={height}
              onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
              className="w-full"
            />
            <Slider
              id="height-slider"
              value={[height]}
              onValueChange={(values) => setHeight(values[0])}
              min={heightUnit === "cm" ? 120 : 48}
              max={heightUnit === "cm" ? 220 : 87}
              step={heightUnit === "cm" ? 1 : 0.5}
              className="py-2"
            />
          </div>
          
          {/* Age */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="age">Age</Label>
              <span className="text-sm text-muted-foreground">{age} years</span>
            </div>
            <Input
              id="age"
              type="number"
              min="18"
              max="100"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value) || 0)}
              className="w-full"
            />
            <Slider
              id="age-slider"
              value={[age]}
              onValueChange={(values) => setAge(values[0])}
              min={18}
              max={100}
              step={1}
              className="py-2"
            />
          </div>
        </div>
        
        {/* Activities */}
        <div className="space-y-4">
          <Label>Activities</Label>
          
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div key={activity.id} className="border rounded-md p-3 space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor={`activity-${activity.id}`} className="text-sm font-medium">
                    Activity {index + 1}
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeActivity(activity.id)}
                    className="h-7 w-7 text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor={`activity-name-${activity.id}`} className="text-xs">
                      Activity Type
                    </Label>
                    <select
                      id={`activity-name-${activity.id}`}
                      value={activity.name}
                      onChange={(e) => updateActivity(activity.id, 'name', e.target.value)}
                      className="w-full h-8 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                    >
                      {Object.keys(activitiesMET).map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <Label htmlFor={`duration-${activity.id}`} className="text-xs">
                        Duration (minutes)
                      </Label>
                      <span className="text-xs text-muted-foreground">{activity.duration} min</span>
                    </div>
                    <Slider
                      id={`duration-${activity.id}`}
                      value={[activity.duration]}
                      onValueChange={(values) => updateActivity(activity.id, 'duration', values[0])}
                      min={5}
                      max={180}
                      step={5}
                      className="py-1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addActivity}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Activity
          </Button>
        </div>
      </>
    );
  };
  
  // Render results
  const renderResults = () => {
    // Check if we have results to display
    if (!dailyCalories || !activityCalories || !totalCalories) {
      return (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            Enter your details and calculate to see results
          </p>
        </div>
      );
    }
    
    // Prepare chart data
    const calorieData = [
      { name: "BMR (Resting)", value: dailyCalories },
      { name: "Activities", value: activityCalories }
    ];
    
    // Chart colors
    const COLORS = ["#3b82f6", "#ef4444"];
    
    return (
      <>
        {/* Main Results */}
        <div className="p-6 bg-secondary rounded-lg text-center">
          <Flame className="h-10 w-10 mx-auto mb-2 text-primary" />
          <p className="text-sm text-muted-foreground mb-1">Total Daily Calories Burned</p>
          <p className="text-4xl font-bold mb-2">{Math.round(totalCalories)} calories</p>
          <div className="text-sm text-muted-foreground">
            Based on your BMR and activities
          </div>
        </div>
        
        {/* Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h3 className="font-medium">Calorie Breakdown</h3>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">BMR (Resting)</p>
                <p className="font-bold text-lg">{Math.round(dailyCalories)} cal</p>
                <p className="text-xs text-muted-foreground">
                  {Math.round((dailyCalories / totalCalories) * 100)}% of total
                </p>
              </div>
              
              <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Activities</p>
                <p className="font-bold text-lg">{Math.round(activityCalories)} cal</p>
                <p className="text-xs text-muted-foreground">
                  {Math.round((activityCalories / totalCalories) * 100)}% of total
                </p>
              </div>
            </div>
            
            <div className="space-y-1 text-sm border-t pt-2">
              <p>Weight: {weight} {weightUnit} ({formatNumber(getWeightInKg(), 1)} kg)</p>
              <p>Height: {height} {heightUnit} ({formatNumber(getHeightInCm(), 1)} cm)</p>
              <p>Age: {age} years</p>
              <p>Gender: {gender === "male" ? "Male" : "Female"}</p>
            </div>
          </div>
          
          <div className="h-44 md:h-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={calorieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {calorieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${Math.round(value as number)} calories`, ""]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Activities Breakdown */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-2 text-sm font-medium">
            Activities Breakdown
          </div>
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Activity</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Duration</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Calories</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {activities.map((activity) => (
                <tr key={activity.id}>
                  <td className="px-4 py-2 text-sm">{activity.name}</td>
                  <td className="px-4 py-2 text-sm text-center">{activity.duration} min</td>
                  <td className="px-4 py-2 text-sm text-right">{Math.round(activity.caloriesBurned)} cal</td>
                </tr>
              ))}
              
              {/* Totals row */}
              <tr className="bg-muted/50">
                <td className="px-4 py-2 text-sm font-medium">Total Activities</td>
                <td className="px-4 py-2 text-sm text-center font-medium">
                  {activities.reduce((total, activity) => total + activity.duration, 0)} min
                </td>
                <td className="px-4 py-2 text-sm text-right font-medium">
                  {Math.round(activityCalories)} cal
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Helpful Information */}
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-medium mb-2">What Do These Numbers Mean?</h3>
          
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">BMR (Basal Metabolic Rate):</span> The number of calories your body burns at 
              rest to maintain basic physiological functions like breathing and circulation.
            </p>
            
            <p>
              <span className="font-medium">Activity Calories:</span> The additional calories burned through 
              physical activities beyond your basal metabolism.
            </p>
            
            <p>
              <span className="font-medium">Total Calories:</span> The estimated total energy expenditure for 
              the day, combining your BMR and activity calories.
            </p>
          </div>
          
          <div className="mt-4 text-xs text-muted-foreground">
            Note: These calculations are estimates based on formulas and may vary based on individual factors 
            such as muscle mass, genetics, and specific conditions.
          </div>
        </div>
      </>
    );
  };
  
  return (
    <CalculatorTemplate
      title="Daily Calorie Burn Estimate"
      description="Estimate calories burned during different activities."
      category="fun"
      renderInputs={renderInputs}
      renderResults={renderResults}
      handleCalculate={calculateDailyCalories}
      handleReset={handleReset}
      showResults={showResults}
    />
  );
};

export default CalorieBurnCalculator;
