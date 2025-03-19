
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Info, RefreshCw, Send } from "lucide-react";
import { calculateMortgage, formatCurrency } from "@/utils/calculators";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from 'recharts';
import { downloadAsPDF } from "@/utils/pdfUtils";

interface AmortizationData {
  year: number;
  balance: number;
  paid: number;
}

const MortgageCalculator = () => {
  // State for form inputs
  const [homePrice, setHomePrice] = useState(300000);
  const [downPayment, setDownPayment] = useState(60000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanTerm, setLoanTerm] = useState(30);
  const [interestRate, setInterestRate] = useState(4.5);
  const [propertyTax, setPropertyTax] = useState(1.2);
  const [homeInsurance, setHomeInsurance] = useState(1200);
  
  // State for results
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [principalAndInterest, setPrincipalAndInterest] = useState(0);
  const [monthlyPropertyTax, setMonthlyPropertyTax] = useState(0);
  const [monthlyHomeInsurance, setMonthlyHomeInsurance] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [amortizationData, setAmortizationData] = useState<AmortizationData[]>([]);
  
  // Sync down payment amount and percentage
  useEffect(() => {
    if (homePrice > 0) {
      const newDownPaymentPercent = (downPayment / homePrice) * 100;
      setDownPaymentPercent(parseFloat(newDownPaymentPercent.toFixed(2)));
    }
  }, [downPayment, homePrice]);
  
  // Update down payment amount when percentage changes
  useEffect(() => {
    const newDownPayment = (homePrice * downPaymentPercent) / 100;
    setDownPayment(parseFloat(newDownPayment.toFixed(2)));
  }, [downPaymentPercent, homePrice]);
  
  // Calculate mortgage when form values change
  useEffect(() => {
    if (showResults) {
      calculateResults();
    }
  }, [homePrice, downPayment, loanTerm, interestRate, propertyTax, homeInsurance, showResults]);
  
  const calculateResults = () => {
    try {
      const loanAmount = homePrice - downPayment;
      
      if (loanAmount <= 0) {
        toast.error("Loan amount must be greater than zero");
        return;
      }
      
      // Calculate monthly principal and interest
      const monthlyRate = interestRate / 100 / 12;
      const numberOfPayments = loanTerm * 12;
      
      const piPayment = calculateMortgage(loanAmount, monthlyRate, numberOfPayments);
      setPrincipalAndInterest(piPayment);
      
      // Calculate monthly property tax
      const annualPropertyTax = (homePrice * propertyTax) / 100;
      const monthlyTax = annualPropertyTax / 12;
      setMonthlyPropertyTax(monthlyTax);
      
      // Calculate monthly home insurance
      const monthlyInsurance = homeInsurance / 12;
      setMonthlyHomeInsurance(monthlyInsurance);
      
      // Calculate total monthly payment
      const totalMonthlyPayment = piPayment + monthlyTax + monthlyInsurance;
      setMonthlyPayment(totalMonthlyPayment);
      
      // Generate amortization data for the chart
      generateAmortizationData(loanAmount, monthlyRate, numberOfPayments, piPayment);
      
    } catch (error) {
      console.error("Error calculating mortgage:", error);
      toast.error("Error calculating mortgage. Please check your inputs.");
    }
  };
  
  const generateAmortizationData = (
    loanAmount: number,
    monthlyRate: number,
    numberOfPayments: number,
    monthlyPIPayment: number
  ) => {
    let balance = loanAmount;
    let yearlyData: AmortizationData[] = [];
    
    // Get yearly data points to avoid overcrowding the chart
    for (let year = 0; year <= loanTerm; year++) {
      // Calculate remaining balance after this many years
      let currentBalance = balance;
      
      if (year > 0) {
        const monthsElapsed = year * 12;
        currentBalance = 
          loanAmount * 
          (Math.pow(1 + monthlyRate, numberOfPayments) - Math.pow(1 + monthlyRate, monthsElapsed)) / 
          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        
        // Ensure we don't get negative balance at the end
        if (currentBalance < 0) currentBalance = 0;
      }
      
      yearlyData.push({
        year,
        balance: currentBalance,
        paid: loanAmount - currentBalance
      });
    }
    
    setAmortizationData(yearlyData);
  };
  
  const handleCalculate = () => {
    if (homePrice <= 0 || downPayment < 0 || interestRate <= 0) {
      toast.error("Please enter valid values for all fields");
      return;
    }
    
    setShowResults(true);
    calculateResults();
    toast.success("Mortgage calculated successfully");
  };
  
  const handleReset = () => {
    setHomePrice(300000);
    setDownPayment(60000);
    setDownPaymentPercent(20);
    setLoanTerm(30);
    setInterestRate(4.5);
    setPropertyTax(1.2);
    setHomeInsurance(1200);
    setShowResults(false);
    toast.info("Calculator has been reset");
  };
  
  const handleDownloadPDF = () => {
    downloadAsPDF('calculator-results', `mortgage-calculator-results.pdf`);
    toast.success("PDF download started");
  };
  
  // Custom formatter for chart tooltip
  const CustomTooltipFormatter = (value: number) => {
    return formatCurrency(value);
  };
  
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mortgage Calculator</h1>
        <p className="text-muted-foreground">
          Calculate your monthly mortgage payment including principal, interest, taxes, and insurance.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <Card className="lg:col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle>Enter Mortgage Details</CardTitle>
            <CardDescription>
              Adjust the values to calculate your mortgage payment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Home Price */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="homePrice">Home Price</Label>
                <span className="text-sm text-muted-foreground">{formatCurrency(homePrice)}</span>
              </div>
              <Input
                id="homePrice"
                type="number"
                value={homePrice}
                onChange={(e) => setHomePrice(parseFloat(e.target.value) || 0)}
                className="input-control"
              />
              <Slider
                value={[homePrice]}
                min={50000}
                max={1000000}
                step={5000}
                onValueChange={(value) => setHomePrice(value[0])}
              />
              <span className="text-xs text-muted-foreground flex justify-between">
                <span>$50,000</span>
                <span>$1,000,000</span>
              </span>
            </div>
            
            {/* Down Payment */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="downPayment">Down Payment</Label>
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(downPayment)} ({downPaymentPercent.toFixed(1)}%)
                </span>
              </div>
              <Input
                id="downPayment"
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(parseFloat(e.target.value) || 0)}
                className="input-control"
              />
              <Slider
                value={[downPaymentPercent]}
                min={0}
                max={50}
                step={0.5}
                onValueChange={(value) => setDownPaymentPercent(value[0])}
              />
              <span className="text-xs text-muted-foreground flex justify-between">
                <span>0%</span>
                <span>50%</span>
              </span>
            </div>
            
            {/* Loan Term */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="loanTerm">Loan Term</Label>
                <span className="text-sm text-muted-foreground">{loanTerm} years</span>
              </div>
              <Tabs defaultValue={loanTerm.toString()} className="w-full" onValueChange={(value) => setLoanTerm(parseInt(value))}>
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="15">15 Years</TabsTrigger>
                  <TabsTrigger value="20">20 Years</TabsTrigger>
                  <TabsTrigger value="30">30 Years</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Interest Rate */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="interestRate">Interest Rate</Label>
                <span className="text-sm text-muted-foreground">{interestRate.toFixed(2)}%</span>
              </div>
              <Input
                id="interestRate"
                type="number"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                className="input-control"
              />
              <Slider
                value={[interestRate]}
                min={1}
                max={10}
                step={0.125}
                onValueChange={(value) => setInterestRate(value[0])}
              />
              <span className="text-xs text-muted-foreground flex justify-between">
                <span>1%</span>
                <span>10%</span>
              </span>
            </div>
            
            {/* Property Tax */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="propertyTax">Property Tax Rate</Label>
                <span className="text-sm text-muted-foreground">{propertyTax}% / year</span>
              </div>
              <Input
                id="propertyTax"
                type="number"
                step="0.01"
                value={propertyTax}
                onChange={(e) => setPropertyTax(parseFloat(e.target.value) || 0)}
                className="input-control"
              />
            </div>
            
            {/* Home Insurance */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="homeInsurance">Home Insurance</Label>
                <span className="text-sm text-muted-foreground">{formatCurrency(homeInsurance)} / year</span>
              </div>
              <Input
                id="homeInsurance"
                type="number"
                value={homeInsurance}
                onChange={(e) => setHomeInsurance(parseFloat(e.target.value) || 0)}
                className="input-control"
              />
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
            <CardTitle>Mortgage Results</CardTitle>
            <CardDescription>
              Based on your inputs, here's your estimated monthly payment
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Monthly Payment Summary */}
            <div className="p-4 bg-secondary rounded-lg">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Estimated Monthly Payment</p>
                <p className="text-4xl font-bold">{formatCurrency(monthlyPayment)}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Principal & Interest</p>
                  <p className="text-sm font-medium">{formatCurrency(principalAndInterest)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Property Tax</p>
                  <p className="text-sm font-medium">{formatCurrency(monthlyPropertyTax)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Home Insurance</p>
                  <p className="text-sm font-medium">{formatCurrency(monthlyHomeInsurance)}</p>
                </div>
              </div>
            </div>
            
            {/* Loan Summary */}
            <div>
              <h3 className="text-lg font-medium mb-2">Loan Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Loan Amount</p>
                  <p className="text-base font-medium">{formatCurrency(homePrice - downPayment)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Down Payment</p>
                  <p className="text-base font-medium">{formatCurrency(downPayment)} ({downPaymentPercent.toFixed(1)}%)</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Loan Term</p>
                  <p className="text-base font-medium">{loanTerm} years</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Interest Rate</p>
                  <p className="text-base font-medium">{interestRate.toFixed(2)}%</p>
                </div>
              </div>
            </div>
            
            {/* Amortization Chart */}
            {showResults && amortizationData.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Amortization Schedule</h3>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={amortizationData}
                      margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
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
                        formatter={(value) => [formatCurrency(value as number), ""]}
                        labelFormatter={(value) => `Year ${value}`}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="balance" 
                        name="Remaining Balance" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="paid" 
                        name="Principal Paid" 
                        stroke="#82ca9d" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  This chart shows your remaining balance and principal paid over time
                </p>
              </div>
            )}
            
            {/* Info Tile */}
            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
              <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm">
                  This calculator provides estimates for planning purposes only. Actual loan terms and payments may vary based on credit score, lender fees, and other factors.
                </p>
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

export default MortgageCalculator;
