
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { 
  calculateMean, 
  calculateMedian, 
  calculateVariance, 
  calculateStandardDeviation,
  formatNumber
} from "@/utils/calculators";
import CalculatorTemplate from "@/utils/CalculatorTemplate";
import { BarChart, AreaChart, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StandardDeviationCalculator = () => {
  // State for data input
  const [dataString, setDataString] = useState<string>("5, 10, 15, 20, 25");
  const [values, setValues] = useState<number[]>([5, 10, 15, 20, 25]);
  const [mode, setMode] = useState<"sample" | "population">("sample");
  
  // Results
  const [mean, setMean] = useState<number | null>(null);
  const [median, setMedian] = useState<number | null>(null);
  const [variance, setVariance] = useState<number | null>(null);
  const [standardDeviation, setStandardDeviation] = useState<number | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  
  // Chart data
  const [chartData, setChartData] = useState<any[]>([]);
  const [normalDistData, setNormalDistData] = useState<any[]>([]);

  // Parse input data
  const parseData = (input: string): number[] => {
    // Split the input string by commas, spaces, tabs, or newlines
    const items = input.split(/[,\s\t\n]+/).filter(item => item.trim() !== "");
    
    // Convert to numbers and filter out invalid values
    return items.map(item => parseFloat(item)).filter(num => !isNaN(num));
  };

  // Calculate statistics
  const calculateStatistics = () => {
    try {
      // Parse the data
      const parsedValues = parseData(dataString);
      
      if (parsedValues.length < 2) {
        toast.error("Please enter at least two valid numbers");
        return;
      }
      
      setValues(parsedValues);
      
      // Calculate statistics
      const calculatedMean = calculateMean(parsedValues);
      const calculatedMedian = calculateMedian(parsedValues);
      
      // Calculate variance based on mode (sample or population)
      let calculatedVariance: number;
      if (mode === "sample") {
        calculatedVariance = calculateVariance(parsedValues); // Uses (n-1) for sample
      } else {
        // For population variance, we need to adjust the denominator
        const sum = parsedValues.reduce((acc, val) => acc + Math.pow(val - calculatedMean, 2), 0);
        calculatedVariance = sum / parsedValues.length;
      }
      
      const calculatedStdDev = Math.sqrt(calculatedVariance);
      
      // Set results
      setMean(calculatedMean);
      setMedian(calculatedMedian);
      setVariance(calculatedVariance);
      setStandardDeviation(calculatedStdDev);
      
      // Prepare chart data
      prepareChartData(parsedValues);
      prepareNormalDistData(calculatedMean, calculatedStdDev, parsedValues);
      
      setShowResults(true);
      toast.success("Statistics calculated successfully");
    } catch (error) {
      console.error("Error calculating statistics:", error);
      toast.error("Error in calculation. Please check your input data.");
    }
  };

  // Prepare bar chart data
  const prepareChartData = (data: number[]) => {
    // Count frequency of each value
    const frequencyMap = new Map<number, number>();
    data.forEach(value => {
      frequencyMap.set(value, (frequencyMap.get(value) || 0) + 1);
    });
    
    // Convert to chart data format
    const chartDataArray = Array.from(frequencyMap.entries())
      .map(([value, frequency]) => ({
        value: value,
        frequency: frequency
      }))
      .sort((a, b) => a.value - b.value);
    
    setChartData(chartDataArray);
  };

  // Prepare normal distribution data
  const prepareNormalDistData = (mean: number, stdDev: number, data: number[]) => {
    if (data.length < 2 || stdDev === 0) return;
    
    // Find min and max values for the range
    const min = Math.min(...data);
    const max = Math.max(...data);
    
    // Create points for the normal distribution curve
    const range = max - min;
    const extendedMin = min - range * 0.2;
    const extendedMax = max + range * 0.2;
    const step = range / 20;
    
    const normalDistPoints = [];
    
    for (let x = extendedMin; x <= extendedMax; x += step) {
      // Normal distribution formula
      const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
      const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
      
      normalDistPoints.push({
        x: x,
        y: y
      });
    }
    
    setNormalDistData(normalDistPoints);
  };

  // Reset calculator
  const handleReset = () => {
    setDataString("5, 10, 15, 20, 25");
    setValues([5, 10, 15, 20, 25]);
    setMode("sample");
    setMean(null);
    setMedian(null);
    setVariance(null);
    setStandardDeviation(null);
    setChartData([]);
    setNormalDistData([]);
    setShowResults(false);
    toast.info("Calculator has been reset");
  };

  // Render input form
  const renderInputs = () => {
    return (
      <div className="space-y-6">
        {/* Data Input */}
        <div className="space-y-2">
          <Label htmlFor="data">Enter Numbers (comma or space separated)</Label>
          <Textarea
            id="data"
            value={dataString}
            onChange={(e) => setDataString(e.target.value)}
            placeholder="e.g. 5, 10, 15, 20, 25"
            className="min-h-[100px]"
          />
        </div>
        
        {/* Mode Selection */}
        <div className="space-y-2">
          <Label className="block">Calculation Type</Label>
          <RadioGroup
            value={mode}
            onValueChange={(value) => setMode(value as "sample" | "population")}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sample" id="sample" />
              <Label htmlFor="sample" className="cursor-pointer">
                Sample (n-1)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="population" id="population" />
              <Label htmlFor="population" className="cursor-pointer">
                Population (n)
              </Label>
            </div>
          </RadioGroup>
          <p className="text-xs text-muted-foreground mt-1">
            Use "Sample" when your data is a subset of a larger population. Use "Population" when your data represents the entire population.
          </p>
        </div>
        
        {/* Quick Examples */}
        <div className="space-y-2">
          <Label className="block">Quick Examples</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              onClick={() => setDataString("5, 10, 15, 20, 25")}
              className="h-auto py-2 text-left"
            >
              <div>
                <div className="font-medium">Uniform Data</div>
                <div className="text-xs text-muted-foreground">5, 10, 15, 20, 25</div>
              </div>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setDataString("2, 4, 4, 4, 5, 5, 7, 9")}
              className="h-auto py-2 text-left"
            >
              <div>
                <div className="font-medium">Skewed Data</div>
                <div className="text-xs text-muted-foreground">2, 4, 4, 4, 5, 5, 7, 9</div>
              </div>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setDataString("10, 20, 30, 40, 50, 60, 70, 80, 90, 100")}
              className="h-auto py-2 text-left"
            >
              <div>
                <div className="font-medium">Linear Data</div>
                <div className="text-xs text-muted-foreground">10, 20, 30, ..., 100</div>
              </div>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setDataString("70, 72, 68, 65, 71, 73, 69, 70, 74, 67")}
              className="h-auto py-2 text-left"
            >
              <div>
                <div className="font-medium">Normal Distribution</div>
                <div className="text-xs text-muted-foreground">70, 72, 68, 65, ...</div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Render results
  const renderResults = () => {
    // Calculate z-scores
    const calculateZScores = () => {
      if (!standardDeviation || standardDeviation === 0) return [];
      
      return values.map(value => ({
        value,
        zScore: (value - (mean || 0)) / standardDeviation
      }));
    };

    return (
      <div className="space-y-6">
        {/* Main Statistics */}
        <div className="p-6 bg-secondary rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Mean (Average)</p>
              <p className="text-3xl font-bold">{mean !== null ? formatNumber(mean, 4) : "N/A"}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Median</p>
              <p className="text-3xl font-bold">{median !== null ? formatNumber(median, 4) : "N/A"}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Variance</p>
              <p className="text-3xl font-bold">{variance !== null ? formatNumber(variance, 4) : "N/A"}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Standard Deviation</p>
              <p className="text-3xl font-bold">{standardDeviation !== null ? formatNumber(standardDeviation, 4) : "N/A"}</p>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Based on {values.length} values, calculated as {mode === "sample" ? "sample" : "population"} statistics
            </p>
          </div>
        </div>
        
        {/* Data Visualization */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Data Visualization</h3>
          
          {/* Bar Chart for Frequency */}
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-medium mb-3">Frequency Distribution</h4>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="value" />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={(value) => [`${value}`, 'Frequency']} />
                  <Bar dataKey="frequency" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Normal Distribution Curve */}
          {normalDistData.length > 0 && (
            <div className="border rounded-lg p-4">
              <h4 className="text-sm font-medium mb-3">Normal Distribution</h4>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={normalDistData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="x" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${formatNumber(value as number, 6)}`, 'Probability Density']} />
                    <Area type="monotone" dataKey="y" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
        
        {/* Z-scores */}
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-medium mb-2">Z-Scores</h3>
          <p className="text-sm mb-3">
            A z-score tells you how many standard deviations away a value is from the mean.
          </p>
          <div className="max-h-40 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Value</th>
                  <th className="text-left p-2">Z-Score</th>
                  <th className="text-left p-2">Interpretation</th>
                </tr>
              </thead>
              <tbody>
                {calculateZScores().map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{item.value}</td>
                    <td className="p-2">{formatNumber(item.zScore, 2)}</td>
                    <td className="p-2">
                      {Math.abs(item.zScore) < 1 ? "Within 1 std dev (common)" : 
                       Math.abs(item.zScore) < 2 ? "Within 2 std dev (typical)" :
                       Math.abs(item.zScore) < 3 ? "Within 3 std dev (uncommon)" :
                       "Beyond 3 std dev (rare)"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Explanation */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Understanding the Results</h3>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Mean:</strong> The average of all values (sum of values divided by count).
            </p>
            <p>
              <strong>Median:</strong> The middle value when data is sorted.
            </p>
            <p>
              <strong>Variance:</strong> The average of squared deviations from the mean. It tells you how spread out the data is.
            </p>
            <p>
              <strong>Standard Deviation:</strong> The square root of variance. Approximately 68% of values fall within 1 standard deviation of the mean.
            </p>
            <p className="mt-4">
              <strong>Note:</strong> For sample calculations (n-1), we divide by (n-1) instead of n to get an unbiased estimate of population variance.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <CalculatorTemplate
      title="Standard Deviation Calculator"
      description="Calculate mean, median, variance, and standard deviation with visualizations."
      category="math"
      renderInputs={renderInputs}
      renderResults={renderResults}
      handleCalculate={calculateStatistics}
      handleReset={handleReset}
      showResults={showResults}
    />
  );
};

export default StandardDeviationCalculator;
