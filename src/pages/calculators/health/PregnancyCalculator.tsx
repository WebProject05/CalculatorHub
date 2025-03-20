
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Calendar, CalendarDays, Baby, Clock } from "lucide-react";
import { formatDate } from "@/utils/calculators";
import CalculatorTemplate from "@/utils/CalculatorTemplate";

const PregnancyCalculator = () => {
  // Input state
  const [calculationType, setCalculationType] = useState<"due-date" | "conception">("due-date");
  const [knownDate, setKnownDate] = useState<string>("");
  const [cycleLength, setCycleLength] = useState<number>(28);
  
  // Results
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [conceptionDate, setConceptionDate] = useState<Date | null>(null);
  const [firstTrimesterEnd, setFirstTrimesterEnd] = useState<Date | null>(null);
  const [secondTrimesterEnd, setSecondTrimesterEnd] = useState<Date | null>(null);
  const [currentTrimester, setCurrentTrimester] = useState<number | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  // Calculate pregnancy dates
  const calculateDates = () => {
    try {
      if (!knownDate) {
        toast.error("Please enter a date");
        return;
      }
      
      const inputDate = new Date(knownDate);
      if (isNaN(inputDate.getTime())) {
        toast.error("Please enter a valid date");
        return;
      }
      
      if (calculationType === "due-date") {
        // Calculate due date from last menstrual period (LMP)
        // Naegele's rule: Add 280 days (40 weeks) to LMP
        const lmpDate = new Date(inputDate);
        
        // Calculate conception date (typically 2 weeks after LMP)
        const conception = new Date(lmpDate);
        conception.setDate(conception.getDate() + 14);
        setConceptionDate(conception);
        
        // Calculate due date (40 weeks from LMP)
        const due = new Date(lmpDate);
        due.setDate(due.getDate() + 280);
        setDueDate(due);
        
      } else {
        // Calculate due date from conception date
        // Conception date is given, add 38 weeks to get due date
        const conception = new Date(inputDate);
        setConceptionDate(conception);
        
        // Calculate due date (38 weeks from conception)
        const due = new Date(conception);
        due.setDate(due.getDate() + 266);
        setDueDate(due);
        
        // Calculate LMP (typically 2 weeks before conception)
        const lmp = new Date(conception);
        lmp.setDate(lmp.getDate() - 14);
        // We don't need to set LMP in state as it's not displayed
      }
      
      // Calculate trimester dates
      if (dueDate) {
        // First trimester ends at 13 weeks (91 days from LMP)
        const firstTrimEnd = new Date(conceptionDate!);
        firstTrimEnd.setDate(firstTrimEnd.getDate() - 14 + 91);
        setFirstTrimesterEnd(firstTrimEnd);
        
        // Second trimester ends at 26 weeks (182 days from LMP)
        const secondTrimEnd = new Date(conceptionDate!);
        secondTrimEnd.setDate(secondTrimEnd.getDate() - 14 + 182);
        setSecondTrimesterEnd(secondTrimEnd);
        
        // Calculate current trimester
        const today = new Date();
        if (today <= firstTrimesterEnd!) {
          setCurrentTrimester(1);
        } else if (today <= secondTrimesterEnd!) {
          setCurrentTrimester(2);
        } else if (today <= dueDate) {
          setCurrentTrimester(3);
        } else {
          setCurrentTrimester(null); // Past due date
        }
      }
      
      setShowResults(true);
      toast.success("Pregnancy dates calculated successfully");
    } catch (error) {
      console.error("Error calculating pregnancy dates:", error);
      toast.error("Error in calculation. Please check your inputs.");
    }
  };

  // Reset calculator
  const handleReset = () => {
    setCalculationType("due-date");
    setKnownDate("");
    setCycleLength(28);
    setDueDate(null);
    setConceptionDate(null);
    setFirstTrimesterEnd(null);
    setSecondTrimesterEnd(null);
    setCurrentTrimester(null);
    setShowResults(false);
    toast.info("Calculator has been reset");
  };

  // Format date for display with weekday
  const formatDateWithWeekday = (date: Date | null): string => {
    if (!date) return "Not calculated";
    
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const weekday = weekdays[date.getDay()];
    
    return `${weekday}, ${formatDate(date)}`;
  };

  // Calculate weeks between two dates
  const calculateWeeks = (startDate: Date, endDate: Date): number => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7);
  };

  // Render input form
  const renderInputs = () => {
    return (
      <div className="space-y-6">
        {/* Calculation Type */}
        <div className="space-y-2">
          <Label>Calculation Method</Label>
          <RadioGroup 
            value={calculationType} 
            onValueChange={(value) => setCalculationType(value as "due-date" | "conception")}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="due-date" id="due-date" className="mt-1" />
              <div>
                <Label htmlFor="due-date" className="font-medium">Calculate from Last Menstrual Period</Label>
                <p className="text-xs text-muted-foreground">
                  Use this if you know the first day of your last period
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="conception" id="conception" className="mt-1" />
              <div>
                <Label htmlFor="conception" className="font-medium">Calculate from Conception Date</Label>
                <p className="text-xs text-muted-foreground">
                  Use this if you know when conception occurred
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>
        
        {/* Date Input */}
        <div className="space-y-2">
          <Label htmlFor="knownDate">
            {calculationType === "due-date" 
              ? "First Day of Last Menstrual Period" 
              : "Conception Date"}
          </Label>
          <Input
            id="knownDate"
            type="date"
            value={knownDate}
            onChange={(e) => setKnownDate(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            {calculationType === "due-date" 
              ? "This is the first day of your last menstrual period, not the date of conception." 
              : "This is the date when conception likely occurred, typically during ovulation."}
          </p>
        </div>
        
        {/* Cycle Length (only relevant for due date calculation) */}
        {calculationType === "due-date" && (
          <div className="space-y-2">
            <Label htmlFor="cycleLength">Menstrual Cycle Length (days)</Label>
            <Input
              id="cycleLength"
              type="number"
              value={cycleLength}
              onChange={(e) => setCycleLength(parseInt(e.target.value) || 28)}
              min={21}
              max={35}
            />
            <p className="text-xs text-muted-foreground">
              The average cycle length is 28 days, but it can vary from 21 to 35 days.
            </p>
          </div>
        )}
        
        {/* Information */}
        <div className="p-4 bg-secondary rounded-lg">
          <p className="text-sm">
            A typical pregnancy lasts about 40 weeks from the first day of your last menstrual period (LMP), 
            or 38 weeks from conception. Pregnancy is divided into three trimesters, each lasting about 
            12-13 weeks.
          </p>
        </div>
      </div>
    );
  };

  // Render results
  const renderResults = () => {
    // Calculate current progress if dates are set
    const calculateProgress = (): number => {
      if (!conceptionDate || !dueDate) return 0;
      
      const today = new Date();
      const conception = new Date(conceptionDate);
      const due = new Date(dueDate);
      
      // Total pregnancy duration in milliseconds (from conception to due date)
      const totalDuration = due.getTime() - conception.getTime();
      
      // Time elapsed since conception
      const elapsed = today.getTime() - conception.getTime();
      
      // Calculate progress percentage
      let progress = (elapsed / totalDuration) * 100;
      
      // Constrain to 0-100%
      progress = Math.max(0, Math.min(100, progress));
      
      return Math.round(progress);
    };

    // Calculate weeks pregnant
    const calculateWeeksPregnant = (): string => {
      if (!conceptionDate) return "Not calculated";
      
      const today = new Date();
      const conception = new Date(conceptionDate);
      
      // Adjust to LMP (2 weeks before conception typically)
      const lmp = new Date(conception);
      lmp.setDate(lmp.getDate() - 14);
      
      const diffTime = today.getTime() - lmp.getTime();
      if (diffTime < 0) return "Not pregnant yet";
      
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const weeks = Math.floor(diffDays / 7);
      const days = diffDays % 7;
      
      return `${weeks} weeks, ${days} days`;
    };

    return (
      <div className="space-y-6">
        {/* Key Dates Display */}
        <div className="p-6 bg-secondary rounded-lg">
          <h3 className="font-medium text-center mb-4">Pregnancy Timeline</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Due Date (Estimated)</p>
                <p className="text-lg font-bold">{formatDateWithWeekday(dueDate)}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Baby className="h-5 w-5 text-pink-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Conception Date (Estimated)</p>
                <p className="text-lg font-medium">{formatDateWithWeekday(conceptionDate)}</p>
              </div>
            </div>
            
            {/* Current Pregnancy Stage */}
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Current Stage</p>
                <p className="text-lg font-medium">
                  {currentTrimester 
                    ? `${calculateWeeksPregnant()} (${currentTrimester}${currentTrimester === 1 ? 'st' : currentTrimester === 2 ? 'nd' : 'rd'} trimester)` 
                    : "Not currently pregnant or past due date"}
                </p>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          {dueDate && conceptionDate && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs">
                <span>Conception</span>
                <span>Due Date</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div 
                  className="bg-primary rounded-full h-2.5" 
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
              <p className="text-center text-sm font-medium mt-2">
                {calculateProgress()}% of pregnancy completed
              </p>
            </div>
          )}
        </div>
        
        {/* Trimester Breakdown */}
        <div className="space-y-2">
          <h3 className="font-medium">Trimester Timeline</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border ${currentTrimester === 1 ? 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-900' : 'bg-muted'}`}>
              <h4 className="font-medium mb-1">First Trimester</h4>
              <p className="text-sm">Weeks 1-13</p>
              <p className="text-sm text-muted-foreground mt-1">Ends: {formatDate(firstTrimesterEnd)}</p>
              <ul className="mt-2 text-xs space-y-1 text-muted-foreground">
                <li>• Morning sickness often occurs</li>
                <li>• Organs and body systems develop</li>
                <li>• Higher risk of miscarriage</li>
              </ul>
            </div>
            
            <div className={`p-4 rounded-lg border ${currentTrimester === 2 ? 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-900' : 'bg-muted'}`}>
              <h4 className="font-medium mb-1">Second Trimester</h4>
              <p className="text-sm">Weeks 14-26</p>
              <p className="text-sm text-muted-foreground mt-1">Ends: {formatDate(secondTrimesterEnd)}</p>
              <ul className="mt-2 text-xs space-y-1 text-muted-foreground">
                <li>• Morning sickness usually improves</li>
                <li>• Baby's movements become noticeable</li>
                <li>• Gender can be determined</li>
              </ul>
            </div>
            
            <div className={`p-4 rounded-lg border ${currentTrimester === 3 ? 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-900' : 'bg-muted'}`}>
              <h4 className="font-medium mb-1">Third Trimester</h4>
              <p className="text-sm">Weeks 27-40</p>
              <p className="text-sm text-muted-foreground mt-1">Ends: {formatDate(dueDate)}</p>
              <ul className="mt-2 text-xs space-y-1 text-muted-foreground">
                <li>• Baby gains weight rapidly</li>
                <li>• More frequent prenatal visits</li>
                <li>• Preparation for delivery</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Development Milestones */}
        <div className="space-y-2">
          <h3 className="font-medium">Key Development Milestones</h3>
          <div className="space-y-3 border rounded-lg p-4">
            <div>
              <h4 className="text-sm font-medium">8 Weeks</h4>
              <p className="text-xs text-muted-foreground">
                All major organs have begun to form. Baby's heart is beating, and tiny limbs are present.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium">12 Weeks</h4>
              <p className="text-xs text-muted-foreground">
                Baby's sex becomes distinguishable. Reflexes develop and baby can move, though you can't feel it yet.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium">20 Weeks</h4>
              <p className="text-xs text-muted-foreground">
                Halfway point! Detailed anatomy scan typically performed. Baby's movements become noticeable.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium">24 Weeks</h4>
              <p className="text-xs text-muted-foreground">
                Viability milestone. Baby's chances of survival outside the womb increase significantly from this point.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium">28 Weeks</h4>
              <p className="text-xs text-muted-foreground">
                Baby can open eyes, has rapid brain development, and establishes sleep patterns.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium">37 Weeks</h4>
              <p className="text-xs text-muted-foreground">
                Baby is considered full-term. Most organ systems are ready to function outside the womb.
              </p>
            </div>
          </div>
        </div>
        
        {/* Important Appointments */}
        {dueDate && conceptionDate && (
          <div className="space-y-2">
            <h3 className="font-medium">Recommended Appointments</h3>
            <div className="overflow-hidden bg-secondary rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3">Appointment</th>
                    <th className="text-left p-3">When</th>
                    <th className="text-left p-3">Date (Approx.)</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const lmp = new Date(conceptionDate);
                    lmp.setDate(lmp.getDate() - 14);
                    
                    const appointments = [
                      { name: "First Prenatal Visit", week: 8, date: new Date(lmp) },
                      { name: "Genetic Testing (Optional)", week: 10, date: new Date(lmp) },
                      { name: "Ultrasound & Screening", week: 20, date: new Date(lmp) },
                      { name: "Glucose Test", week: 24, date: new Date(lmp) },
                      { name: "Third Trimester Checkup", week: 28, date: new Date(lmp) },
                      { name: "Group B Strep Test", week: 36, date: new Date(lmp) },
                      { name: "Weekly Checkups", week: 37, date: new Date(lmp) }
                    ];
                    
                    appointments.forEach(app => {
                      app.date.setDate(app.date.getDate() + (app.week * 7));
                    });
                    
                    return appointments.map((app, index) => (
                      <tr key={index} className="border-b border-muted">
                        <td className="p-3">{app.name}</td>
                        <td className="p-3">Week {app.week}</td>
                        <td className="p-3">{formatDate(app.date)}</td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Note: These are general guidelines. Always follow your healthcare provider's recommended schedule.
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <CalculatorTemplate
      title="Pregnancy Calculator"
      description="Calculate due date, conception date, and track important pregnancy milestones."
      category="health"
      renderInputs={renderInputs}
      renderResults={renderResults}
      handleCalculate={calculateDates}
      handleReset={handleReset}
      showResults={showResults}
    />
  );
};

export default PregnancyCalculator;
