
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Info, RefreshCw, Send } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

const CompoundInterestCalculator = () => {
  // State for form inputs
  const [principal, setPrincipal] = useState(5000);
  const [additionalContribution, setAdditionalContribution] = useState(100);
  const [contributionFrequency, setContributionFrequency] = useState("monthly");
  const [interestRate, setInterestRate] = useState(7);
  const [years, setYears] = useState(10);
  const [compoundFrequency, setCompoundFrequency] = useState("annually");
  const [inflationRate, setInflationRate] = useState(2.5);
  const [includeInflation, setIncludeInflation] = useState(false);
  
  // State for results
  const [futureValue, setFutureValue] = useState(0);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [interestEarned, setInterestEarned] = useState(0);
  const [inflationAdjustedValue, setInflationAdjustedValue] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  // Calculate compound interest when values change
  useEffect(() => {
    if (showResults) {
      calculateResults();
    }
  }, [
    principal, 
    additionalContribution, 
    contributionFrequency, 
    interestRate, 
    years, 
    compoundFrequency, 
    inflationRate, 
    includeInflation,
    showResults
  ]);
  
  // Calculate results
  const calculateResults = () => {
    try {
      // Convert interest rate to decimal
      const rate = interestRate / 100;
      
      // Determine number of compounds per year
      let compoundsPerYear = 1; // Default to annually
      switch (compoundFrequency) {
        case "annually":
          compoundsPerYear = 1;
          break;
        case "semiannually":
          compoundsPerYear = 2;
          break;
        case "quarterly":
          compoundsPerYear = 4;
          break;
        case "monthly":
          compoundsPerYear = 12;
          break;
        case "daily":
          compoundsPerYear = 365;
          break;
      }
      
      // Determine contributions per year
      let contributionsPerYear = 0;
      switch (contributionFrequency) {
        case "none":
          contributionsPerYear = 0;
          break;
        case "annually":
          contributionsPerYear = 1;
          break;
        case "monthly":
          contributionsPerYear = 12;
          break;
        case "biweekly":
          contributionsPerYear = 26;
          break;
        case "weekly":
          contributionsPerYear = 52;
          break;
      }
      
      // Calculate contribution per compound period
      const contributionPerPeriod = contributionsPerYear > 0 
        ? (additionalContribution * contributionsPerYear) / compoundsPerYear 
        : 0;
      
      // Calculate total number of compound periods
      const totalPeriods = compoundsPerYear * years;
      
      // Initialize variables for calculation
      let balance = principal;
      let totalContributions = principal;
      let yearlyData = [];
      
      // Calculate compound interest for each period
      for (let period = 1; period <= totalPeriods; period++) {
        // Add interest for this period
        balance = balance * (1 + (rate / compoundsPerYear));
        
        // Add contribution for this period
        balance += contributionPerPeriod;
        
        // Add to total contributions (except initial principal)
        if (contributionsPerYear > 0) {
          totalContributions += contributionPerPeriod;
        }
        
        // Store data for each year
        if (period % compoundsPerYear === 0) {
          const year = period / compoundsPerYear;
          
          // Calculate inflation adjustment if needed
          const inflationFactor = includeInflation 
            ? Math.pow(1 + (inflationRate / 100), year) 
            : 1;
          
          const inflationAdjustedBalance = balance / inflationFactor;
          
          yearlyData.push({
            year,
            balance: Math.round(balance),
            contributions: Math.round(totalContributions),
            interest: Math.round(balance - totalContributions),
            inflationAdjusted: Math.round(inflationAdjustedBalance)
          });
        }
      }
      
      // Update state with results
      setFutureValue(Math.round(balance));
      setTotalDeposits(Math.round(totalContributions));
      setInterestEarned(Math.round(balance - totalContributions));
      
      // Calculate inflation-adjusted value
      const inflationFactor = includeInflation 
        ? Math.pow(1 + (inflationRate / 100), years) 
        : 1;
      
      setInflationAdjustedValue(Math.round(balance / inflationFactor));
      
      // Update chart data
      setChartData(yearlyData);
      
    } catch (error) {
      console.error("Error calculating compound interest:", error);
      toast.error("Error in calculation. Please check your inputs.");
    }
  };
  
  // Handle calculation button click
  const handleCalculate = () => {
    if (principal < 0 || additionalContribution < 0 || interestRate < 0 || years <= 0) {
      toast.error("Please enter valid positive values");
      return;
    }
    
    setShowResults(true);
    calculateResults();
    toast.success("Compound interest calculated successfully");
  };
  
  // Reset the calculator
  const handleReset = () => {
    setPrincipal(5000);
    setAdditionalContribution(100);
    setContributionFrequency("monthly");
    setInterestRate(7);
    setYears(10);
    setCompoundFrequency("annually");
    setInflationRate(2.5);
    setIncludeInflation(false);
    setShowResults(false);
    toast.info("Calculator has been reset");
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Download as PDF
  const handleDownloadPDF = () => {
    toast.success("PDF download started");
    // In a real app, this would generate and download a PDF
  };
  
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Compound Interest Calculator</h1>
        <p className="text-muted-foreground">
          See the power of compound interest and calculate how your investments will grow over time.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <Card className="lg:col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle>Investment Details</CardTitle>
            <CardDescription>
              Enter your investment details to calculate compound interest
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Initial Investment */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="principal">Initial Investment</Label>
                <span className="text-sm text-muted-foreground">{formatCurrency(principal)}</span>
              </div>
              <Input
                id="principal"
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)}
                className="input-control"
              />
              <Slider
                value={[principal]}
                min={0}
                max={50000}
                step={1000}
                onValueChange={(value) => setPrincipal(value[0])}
              />
              <span className="text-xs text-muted-foreground flex justify-between">
                <span>$0</span>
                <span>$50,000</span>
              </span>
            </div>
            
            {/* Regular Contributions */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="additionalContribution">Regular Contribution</Label>
                <span className="text-sm text-muted-foreground">{formatCurrency(additionalContribution)}</span>
              </div>
              <Input
                id="additionalContribution"
                type="number"
                value={additionalContribution}
                onChange={(e) => setAdditionalContribution(parseFloat(e.target.value) || 0)}
                className="input-control"
              />
              <Slider
                value={[additionalContribution]}
                min={0}
                max={1000}
                step={50}
                onValueChange={(value) => setAdditionalContribution(value[0])}
              />
              <span className="text-xs text-muted-foreground flex justify-between">
                <span>$0</span>
                <span>$1,000</span>
              </span>
            </div>
            
            {/* Contribution Frequency */}
            <div className="space-y-2">
              <Label htmlFor="contributionFrequency">Contribution Frequency</Label>
              <Select value={contributionFrequency} onValueChange={setContributionFrequency}>
                <SelectTrigger id="contributionFrequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Additional Contributions</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Interest Rate */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="interestRate">Annual Interest Rate</Label>
                <span className="text-sm text-muted-foreground">{interestRate}%</span>
              </div>
              <Input
                id="interestRate"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                step="0.1"
                className="input-control"
              />
              <Slider
                value={[interestRate]}
                min={0}
                max={15}
                step={0.25}
                onValueChange={(value) => setInterestRate(value[0])}
              />
              <span className="text-xs text-muted-foreground flex justify-between">
                <span>0%</span>
                <span>15%</span>
              </span>
            </div>
            
            {/* Time Period */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="years">Time Period (Years)</Label>
                <span className="text-sm text-muted-foreground">{years} years</span>
              </div>
              <Input
                id="years"
                type="number"
                value={years}
                onChange={(e) => setYears(parseFloat(e.target.value) || 0)}
                className="input-control"
              />
              <Slider
                value={[years]}
                min={1}
                max={50}
                step={1}
                onValueChange={(value) => setYears(value[0])}
              />
              <span className="text-xs text-muted-foreground flex justify-between">
                <span>1 year</span>
                <span>50 years</span>
              </span>
            </div>
            
            {/* Compound Frequency */}
            <div className="space-y-2">
              <Label htmlFor="compoundFrequency">Compound Frequency</Label>
              <Select value={compoundFrequency} onValueChange={setCompoundFrequency}>
                <SelectTrigger id="compoundFrequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annually">Annually</SelectItem>
                  <SelectItem value="semiannually">Semi-annually</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Inflation Adjustment */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="includeInflation">Account for Inflation</Label>
                <Switch
                  id="includeInflation"
                  checked={includeInflation}
                  onCheckedChange={setIncludeInflation}
                />
              </div>
              
              {includeInflation && (
                <div className="pt-2">
                  <div className="flex justify-between">
                    <Label htmlFor="inflationRate">Inflation Rate</Label>
                    <span className="text-sm text-muted-foreground">{inflationRate}%</span>
                  </div>
                  <Input
                    id="inflationRate"
                    type="number"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(parseFloat(e.target.value) || 0)}
                    step="0.1"
                    className="input-control mt-1"
                  />
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
            <CardTitle>Investment Growth</CardTitle>
            <CardDescription>
              See how your investment will grow over time with compound interest
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {showResults ? (
              <>
                {/* Future Value Summary */}
                <div className="p-6 bg-secondary rounded-lg">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">Future Value</p>
                      <p className="text-3xl font-bold">{formatCurrency(futureValue)}</p>
                      {includeInflation && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatCurrency(inflationAdjustedValue)} in today's dollars
                        </p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Total Deposits</p>
                        <p className="text-xl font-semibold">{formatCurrency(totalDeposits)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Interest Earned</p>
                        <p className="text-xl font-semibold">{formatCurrency(interestEarned)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Growth Chart */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Growth Over Time</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={chartData}
                        margin={{ top: 5, right: 5, bottom: 20, left: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis 
                          dataKey="year" 
                          label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }} 
                        />
                        <YAxis 
                          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip 
                          formatter={(value) => formatCurrency(value as number)}
                          labelFormatter={(value) => `Year ${value}`}
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="balance" 
                          name="Future Value" 
                          stroke="#8884d8" 
                          fill="#8884d880" 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="contributions" 
                          name="Total Contributions" 
                          stroke="#82ca9d" 
                          fill="#82ca9d80" 
                        />
                        {includeInflation && (
                          <Area 
                            type="monotone" 
                            dataKey="inflationAdjusted" 
                            name="Inflation-Adjusted Value" 
                            stroke="#ff7300" 
                            fill="#ff730080" 
                          />
                        )}
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Detailed Results Table */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Year-by-Year Breakdown</h3>
                  <div className="rounded-md border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted">
                            <th className="px-4 py-2 text-left font-medium">Year</th>
                            <th className="px-4 py-2 text-right font-medium">Balance</th>
                            <th className="px-4 py-2 text-right font-medium">Contributions</th>
                            <th className="px-4 py-2 text-right font-medium">Interest</th>
                            {includeInflation && (
                              <th className="px-4 py-2 text-right font-medium">Real Value</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {chartData.map((data, index) => (
                            <tr key={index} className="border-t border-border">
                              <td className="px-4 py-2">{data.year}</td>
                              <td className="px-4 py-2 text-right">{formatCurrency(data.balance)}</td>
                              <td className="px-4 py-2 text-right">{formatCurrency(data.contributions)}</td>
                              <td className="px-4 py-2 text-right">{formatCurrency(data.interest)}</td>
                              {includeInflation && (
                                <td className="px-4 py-2 text-right">{formatCurrency(data.inflationAdjusted)}</td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                {/* Info Section */}
                <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                  <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm">
                      This calculator estimates future values based on the inputs provided. 
                      Actual results may vary due to changing interest rates, fees, taxes, and other factors.
                    </p>
                    <p className="text-sm mt-2">
                      The power of compound interest works best over long time periods. 
                      Small increases in interest rate or contribution amount can lead to significant differences in the final value.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Enter your investment details and click "Calculate" to see how your money will grow
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

export default CompoundInterestCalculator;
