
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import CalculatorTemplate from "@/utils/CalculatorTemplate";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateMortgage, formatCurrency, formatNumber } from "@/utils/calculators";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// Colors for chart
const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f97316"];

const LoanCalculator = () => {
  // State for loan inputs
  const [loanAmount, setLoanAmount] = useState<number>(250000);
  const [interestRate, setInterestRate] = useState<number>(5.5);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [downPayment, setDownPayment] = useState<number>(50000);
  const [additionalPayment, setAdditionalPayment] = useState<number>(0);

  // State for results
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [loanSummary, setLoanSummary] = useState<any[] | null>(null);
  const [paymentSchedule, setPaymentSchedule] = useState<any[] | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("summary");

  // Handle loan amount input
  const handleLoanAmountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value.replace(/[^0-9.]/g, ""));
    setLoanAmount(isNaN(value) ? 0 : value);
  };

  // Handle down payment input
  const handleDownPaymentInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value.replace(/[^0-9.]/g, ""));
    setDownPayment(isNaN(value) ? 0 : value);
  };

  // Handle additional payment input
  const handleAdditionalPaymentInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value.replace(/[^0-9.]/g, ""));
    setAdditionalPayment(isNaN(value) ? 0 : value);
  };

  // Calculate loan details
  const handleCalculate = () => {
    try {
      if (loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) {
        toast.error("Please enter valid positive values for all fields");
        return;
      }

      // Calculate loan details
      const principalLoanAmount = loanAmount - downPayment;
      
      if (principalLoanAmount <= 0) {
        toast.error("Loan amount must be greater than down payment");
        return;
      }
      
      const monthlyRate = interestRate / 100 / 12;
      const numberOfPayments = loanTerm * 12;
      
      // Calculate monthly payment
      const calculatedMonthlyPayment = calculateMortgage(
        principalLoanAmount,
        monthlyRate,
        numberOfPayments
      );
      
      // Calculate total payment and interest
      const totalPaymentWithoutExtra = calculatedMonthlyPayment * numberOfPayments;
      const totalInterestWithoutExtra = totalPaymentWithoutExtra - principalLoanAmount;
      
      // Generate amortization schedule
      const schedule = generateAmortizationSchedule(
        principalLoanAmount,
        monthlyRate,
        numberOfPayments,
        calculatedMonthlyPayment,
        additionalPayment
      );
      
      // Update state with calculated results
      setMonthlyPayment(calculatedMonthlyPayment);
      setTotalPayment(schedule.totalPayment);
      setTotalInterest(schedule.totalInterest);
      setPaymentSchedule(schedule.payments);
      
      // Create loan summary data for chart
      const summaryData = [
        { name: "Principal", value: principalLoanAmount },
        { name: "Interest", value: schedule.totalInterest },
        { name: "Down Payment", value: downPayment },
      ];
      
      if (additionalPayment > 0) {
        summaryData.push({
          name: "Interest Saved",
          value: totalInterestWithoutExtra - schedule.totalInterest
        });
      }
      
      setLoanSummary(summaryData);
      setShowResults(true);
      toast.success("Loan calculation completed");
      
    } catch (error) {
      console.error("Error calculating loan:", error);
      toast.error("Error calculating loan. Please check your inputs.");
    }
  };
  
  // Generate amortization schedule with additional payments
  const generateAmortizationSchedule = (
    principal: number,
    monthlyRate: number,
    totalPayments: number,
    monthlyPayment: number,
    additionalPayment: number
  ) => {
    let balance = principal;
    let totalInterest = 0;
    let totalPaid = 0;
    let payments = [];
    let periodicPayment = monthlyPayment + additionalPayment;
    let paymentNumber = 1;
    
    let yearlyData: { [key: number]: any } = {};
    
    while (balance > 0 && paymentNumber <= totalPayments) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = Math.min(periodicPayment - interestPayment, balance);
      
      balance -= principalPayment;
      totalInterest += interestPayment;
      totalPaid += principalPayment + interestPayment;
      
      // Calculate annual totals
      const year = Math.ceil(paymentNumber / 12);
      if (!yearlyData[year]) {
        yearlyData[year] = {
          year,
          interestPaid: 0,
          principalPaid: 0,
          balance: balance,
        };
      }
      
      yearlyData[year].interestPaid += interestPayment;
      yearlyData[year].principalPaid += principalPayment;
      yearlyData[year].balance = balance;
      
      // Only add annual data to the payments array
      if (paymentNumber % 12 === 0 || balance <= 0) {
        payments.push({
          paymentNumber: year,
          principalPayment: yearlyData[year].principalPaid,
          interestPayment: yearlyData[year].interestPaid,
          totalPayment: yearlyData[year].principalPaid + yearlyData[year].interestPaid,
          remainingBalance: balance,
        });
      }
      
      if (balance <= 0) {
        break;
      }
      
      paymentNumber++;
    }
    
    const actualPayments = paymentNumber;
    const yearsSaved = (totalPayments - actualPayments) / 12;
    
    return {
      payments,
      totalPayment: totalPaid,
      totalInterest,
      yearsSaved: yearsSaved > 0 ? yearsSaved : 0
    };
  };

  // Reset calculator
  const handleReset = () => {
    setLoanAmount(250000);
    setInterestRate(5.5);
    setLoanTerm(30);
    setDownPayment(50000);
    setAdditionalPayment(0);
    setMonthlyPayment(null);
    setTotalPayment(null);
    setTotalInterest(null);
    setLoanSummary(null);
    setPaymentSchedule(null);
    setShowResults(false);
    toast.info("Calculator has been reset");
  };

  // Format tooltip values for charts
  const formatTooltipValue = (value: number) => {
    return `${formatCurrency(value)}`;
  };

  // Render inputs form
  const renderInputs = () => {
    return (
      <>
        {/* Loan Amount */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="loanAmount">Loan Amount</Label>
            <span className="text-sm text-muted-foreground">{formatCurrency(loanAmount)}</span>
          </div>
          <Input
            id="loanAmount"
            type="text"
            value={formatCurrency(loanAmount)}
            onChange={handleLoanAmountInput}
            className="w-full"
          />
          <Slider
            id="loanAmount-slider"
            value={[loanAmount]}
            onValueChange={(values) => setLoanAmount(values[0])}
            min={10000}
            max={1000000}
            step={10000}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$10,000</span>
            <span>$1,000,000</span>
          </div>
        </div>
        
        {/* Down Payment */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="downPayment">Down Payment</Label>
            <span className="text-sm text-muted-foreground">{formatCurrency(downPayment)} ({Math.round((downPayment / loanAmount) * 100)}%)</span>
          </div>
          <Input
            id="downPayment"
            type="text"
            value={formatCurrency(downPayment)}
            onChange={handleDownPaymentInput}
            className="w-full"
          />
          <Slider
            id="downPayment-slider"
            value={[downPayment]}
            onValueChange={(values) => setDownPayment(values[0])}
            min={0}
            max={loanAmount * 0.5}
            step={5000}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$0</span>
            <span>50% of loan</span>
          </div>
        </div>
        
        {/* Interest Rate */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="interestRate">Interest Rate (%)</Label>
            <span className="text-sm text-muted-foreground">{interestRate.toFixed(2)}%</span>
          </div>
          <Input
            id="interestRate"
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
            step="0.1"
            className="w-full"
          />
          <Slider
            id="interestRate-slider"
            value={[interestRate]}
            onValueChange={(values) => setInterestRate(values[0])}
            min={0.5}
            max={15}
            step={0.1}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0.5%</span>
            <span>15%</span>
          </div>
        </div>
        
        {/* Loan Term */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="loanTerm">Loan Term (years)</Label>
            <span className="text-sm text-muted-foreground">{loanTerm} years</span>
          </div>
          <Input
            id="loanTerm"
            type="number"
            value={loanTerm}
            onChange={(e) => setLoanTerm(parseInt(e.target.value) || 0)}
            className="w-full"
          />
          <Slider
            id="loanTerm-slider"
            value={[loanTerm]}
            onValueChange={(values) => setLoanTerm(values[0])}
            min={1}
            max={40}
            step={1}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 year</span>
            <span>40 years</span>
          </div>
        </div>
        
        {/* Additional Payment */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="additionalPayment">Additional Monthly Payment</Label>
            <span className="text-sm text-muted-foreground">{formatCurrency(additionalPayment)}</span>
          </div>
          <Input
            id="additionalPayment"
            type="text"
            value={formatCurrency(additionalPayment)}
            onChange={handleAdditionalPaymentInput}
            className="w-full"
          />
          <Slider
            id="additionalPayment-slider"
            value={[additionalPayment]}
            onValueChange={(values) => setAdditionalPayment(values[0])}
            min={0}
            max={1000}
            step={50}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$0</span>
            <span>$1,000</span>
          </div>
        </div>
      </>
    );
  };

  // Render results
  const renderResults = () => {
    const principalAmount = loanAmount - downPayment;
    
    return (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="summary">Loan Summary</TabsTrigger>
          <TabsTrigger value="schedule">Payment Schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-6 pt-3">
          {/* Monthly Payment */}
          <div className="p-6 bg-secondary rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Monthly Payment</p>
            <p className="text-4xl font-bold mb-2">
              {monthlyPayment ? formatCurrency(monthlyPayment) : "$0"}
              {additionalPayment > 0 && (
                <span className="text-sm font-normal text-muted-foreground"> + {formatCurrency(additionalPayment)} extra</span>
              )}
            </p>
            <div className="text-sm text-muted-foreground">
              on a {formatCurrency(principalAmount)} loan at {interestRate}% for {loanTerm} years
            </div>
          </div>
          
          {/* Loan Cost Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total of {loanTerm * 12} Payments</p>
              <p className="text-2xl font-semibold">
                {totalPayment ? formatCurrency(totalPayment) : "$0"}
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Interest</p>
              <p className="text-2xl font-semibold">
                {totalInterest ? formatCurrency(totalInterest) : "$0"}
              </p>
            </div>
          </div>
          
          {/* Loan Breakdown Chart */}
          {loanSummary && (
            <div className="bg-muted rounded-lg p-4">
              <h3 className="font-medium mb-4 text-center">Loan Breakdown</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={loanSummary}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {loanSummary.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {loanSummary.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <div className="text-sm">
                      {item.name}: {formatCurrency(item.value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Early Payoff */}
          {paymentSchedule && paymentSchedule.length > 0 && (
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Loan Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Principal Amount:</p>
                  <p className="font-medium">{formatCurrency(principalAmount)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Interest Rate:</p>
                  <p className="font-medium">{interestRate}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Loan Term:</p>
                  <p className="font-medium">{loanTerm} years</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Down Payment:</p>
                  <p className="font-medium">{formatCurrency(downPayment)} ({Math.round((downPayment / loanAmount) * 100)}%)</p>
                </div>
              </div>
              
              {additionalPayment > 0 && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-md">
                  <h4 className="font-medium text-green-600 dark:text-green-400">Early Payoff Savings</h4>
                  <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Years Saved:</p>
                      <p className="font-medium">{formatNumber(generateAmortizationSchedule(principalAmount, interestRate / 100 / 12, loanTerm * 12, monthlyPayment || 0, additionalPayment).yearsSaved, 1)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Interest Saved:</p>
                      <p className="font-medium">{formatCurrency((loanSummary?.find(item => item.name === "Interest Saved")?.value || 0))}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="schedule" className="space-y-6 pt-3">
          {paymentSchedule && paymentSchedule.length > 0 ? (
            <>
              {/* Payment Chart */}
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-medium mb-4 text-center">Annual Payment Breakdown</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={paymentSchedule}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="paymentNumber" label={{ value: 'Year', position: 'insideBottomRight', offset: -5 }} />
                      <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Bar dataKey="principalPayment" name="Principal" stackId="a" fill="#3b82f6" />
                      <Bar dataKey="interestPayment" name="Interest" stackId="a" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Amortization Table */}
              <div className="overflow-x-auto rounded-lg border">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Year</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Principal</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Interest</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Payment</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Remaining Balance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {paymentSchedule.map((payment, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm">{payment.paymentNumber}</td>
                        <td className="px-4 py-2 text-sm text-right">{formatCurrency(payment.principalPayment)}</td>
                        <td className="px-4 py-2 text-sm text-right">{formatCurrency(payment.interestPayment)}</td>
                        <td className="px-4 py-2 text-sm text-right">{formatCurrency(payment.totalPayment)}</td>
                        <td className="px-4 py-2 text-sm text-right">{formatCurrency(payment.remainingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Calculate your loan to see the amortization schedule
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <CalculatorTemplate
      title="Loan Calculator"
      description="Calculate loan payments, interest, and amortization schedules."
      category="financial"
      renderInputs={renderInputs}
      renderResults={renderResults}
      handleCalculate={handleCalculate}
      handleReset={handleReset}
      showResults={showResults}
    />
  );
};

export default LoanCalculator;
