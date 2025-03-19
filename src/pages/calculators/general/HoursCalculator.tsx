
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { formatCurrency, formatNumber } from "@/utils/calculators";
import CalculatorTemplate from "@/utils/CalculatorTemplate";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";

interface TimeEntry {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  breakDuration: number;
  hours: number;
}

const HoursCalculator = () => {
  // Default days of the week
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  // State for form inputs
  const [entries, setEntries] = useState<TimeEntry[]>([
    { id: 1, day: "Monday", startTime: "09:00", endTime: "17:00", breakDuration: 60, hours: 7 }
  ]);
  const [hourlyRate, setHourlyRate] = useState<number>(15);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [totalHours, setTotalHours] = useState<number>(0);
  const [totalPay, setTotalPay] = useState<number>(0);
  
  // Add a new time entry
  const addEntry = () => {
    const lastEntry = entries[entries.length - 1];
    let nextDay = "Monday";
    
    if (lastEntry) {
      const lastDayIndex = daysOfWeek.indexOf(lastEntry.day);
      const nextDayIndex = (lastDayIndex + 1) % 7;
      nextDay = daysOfWeek[nextDayIndex];
    }
    
    setEntries([
      ...entries,
      {
        id: Date.now(),
        day: nextDay,
        startTime: "09:00",
        endTime: "17:00",
        breakDuration: 60,
        hours: 7
      }
    ]);
  };
  
  // Remove a time entry
  const removeEntry = (id: number) => {
    if (entries.length <= 1) {
      toast.error("You must have at least one time entry");
      return;
    }
    
    setEntries(entries.filter(entry => entry.id !== id));
  };
  
  // Update a time entry field
  const updateEntry = (id: number, field: keyof TimeEntry, value: string | number) => {
    const updatedEntries = entries.map(entry => {
      if (entry.id === id) {
        const updatedEntry = { ...entry, [field]: value };
        
        // Recalculate hours if start or end time or break changes
        if (field === 'startTime' || field === 'endTime' || field === 'breakDuration') {
          const hours = calculateHours(
            field === 'startTime' ? value as string : entry.startTime,
            field === 'endTime' ? value as string : entry.endTime,
            field === 'breakDuration' ? value as number : entry.breakDuration
          );
          updatedEntry.hours = hours;
        }
        
        return updatedEntry;
      }
      return entry;
    });
    
    setEntries(updatedEntries);
  };
  
  // Calculate hours between start and end time, minus break
  const calculateHours = (startTime: string, endTime: string, breakMinutes: number): number => {
    if (!startTime || !endTime) return 0;
    
    // Parse times to minutes since midnight
    const startParts = startTime.split(':').map(Number);
    const endParts = endTime.split(':').map(Number);
    
    const startMinutes = startParts[0] * 60 + startParts[1];
    let endMinutes = endParts[0] * 60 + endParts[1];
    
    // Handle overnight shifts (end time is earlier than start time)
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60; // Add 24 hours
    }
    
    // Calculate total minutes worked
    let totalMinutes = endMinutes - startMinutes - breakMinutes;
    
    // Convert to hours with 2 decimal precision
    return Math.max(0, parseFloat((totalMinutes / 60).toFixed(2)));
  };
  
  // Calculate totals and show results
  const handleCalculate = () => {
    if (entries.length === 0) {
      toast.error("Add at least one time entry");
      return;
    }
    
    // Sum up total hours
    const calculatedTotalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
    setTotalHours(calculatedTotalHours);
    
    // Calculate total pay
    setTotalPay(calculatedTotalHours * hourlyRate);
    
    setShowResults(true);
    toast.success("Hours and pay calculated successfully");
  };
  
  // Reset calculator
  const handleReset = () => {
    setEntries([
      { id: 1, day: "Monday", startTime: "09:00", endTime: "17:00", breakDuration: 60, hours: 7 }
    ]);
    setHourlyRate(15);
    setTotalHours(0);
    setTotalPay(0);
    setShowResults(false);
    toast.info("Calculator has been reset");
  };
  
  // Render input form
  const renderInputs = () => {
    return (
      <>
        {/* Time Entries */}
        <div className="space-y-4">
          <Label>Time Entries</Label>
          
          <div className="space-y-3">
            {entries.map((entry, index) => (
              <div key={entry.id} className="grid grid-cols-12 gap-2 items-center border p-3 rounded-md">
                <div className="col-span-12 sm:col-span-3">
                  <Label htmlFor={`day-${entry.id}`} className="text-xs mb-1 block">Day</Label>
                  <select
                    id={`day-${entry.id}`}
                    value={entry.day}
                    onChange={(e) => updateEntry(entry.id, 'day', e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  >
                    {daysOfWeek.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-span-6 sm:col-span-2">
                  <Label htmlFor={`start-${entry.id}`} className="text-xs mb-1 block">Start</Label>
                  <Input
                    id={`start-${entry.id}`}
                    type="time"
                    value={entry.startTime}
                    onChange={(e) => updateEntry(entry.id, 'startTime', e.target.value)}
                  />
                </div>
                
                <div className="col-span-6 sm:col-span-2">
                  <Label htmlFor={`end-${entry.id}`} className="text-xs mb-1 block">End</Label>
                  <Input
                    id={`end-${entry.id}`}
                    type="time"
                    value={entry.endTime}
                    onChange={(e) => updateEntry(entry.id, 'endTime', e.target.value)}
                  />
                </div>
                
                <div className="col-span-6 sm:col-span-2">
                  <Label htmlFor={`break-${entry.id}`} className="text-xs mb-1 block">Break (min)</Label>
                  <Input
                    id={`break-${entry.id}`}
                    type="number"
                    min="0"
                    value={entry.breakDuration}
                    onChange={(e) => updateEntry(entry.id, 'breakDuration', parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div className="col-span-4 sm:col-span-2">
                  <Label htmlFor={`hours-${entry.id}`} className="text-xs mb-1 block">Hours</Label>
                  <div className="h-9 border rounded-md px-3 flex items-center text-sm bg-secondary">
                    {formatNumber(entry.hours, 2)}
                  </div>
                </div>
                
                <div className="col-span-2 sm:col-span-1 flex justify-end items-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeEntry(entry.id)}
                    className="h-9 w-9 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addEntry}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Time Entry
          </Button>
        </div>
        
        {/* Hourly Rate */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="hourlyRate">Hourly Rate</Label>
            <span className="text-sm text-muted-foreground">{formatCurrency(hourlyRate)}/hour</span>
          </div>
          <Input
            id="hourlyRate"
            type="number"
            min="0"
            step="0.01"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
            className="w-full"
          />
        </div>
      </>
    );
  };
  
  // Render results
  const renderResults = () => {
    return (
      <>
        {/* Summary */}
        <div className="p-6 bg-secondary rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Hours</p>
              <p className="text-4xl font-bold">{formatNumber(totalHours, 2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Pay</p>
              <p className="text-4xl font-bold">{formatCurrency(totalPay)}</p>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground text-center">
            Based on {formatCurrency(hourlyRate)}/hour × {formatNumber(totalHours, 2)} hours
          </div>
        </div>
        
        {/* Time Entry Table */}
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => {
                const dailyPay = entry.hours * hourlyRate;
                
                return (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <div className="font-medium">{entry.day}</div>
                      <div className="text-xs text-muted-foreground">
                        {entry.startTime} - {entry.endTime} ({entry.breakDuration} min break)
                      </div>
                    </TableCell>
                    <TableCell>{formatNumber(entry.hours, 2)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(dailyPay)}</TableCell>
                  </TableRow>
                );
              })}
              
              {/* Totals row */}
              <TableRow className="bg-muted/50">
                <TableCell className="font-medium">Total</TableCell>
                <TableCell className="font-medium">{formatNumber(totalHours, 2)}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(totalPay)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        
        {/* Additional Information */}
        <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
          <h3 className="font-medium">Helpful Information</h3>
          <p>Regular full-time work is typically 40 hours per week (2,080 hours per year).</p>
          <p>At {formatCurrency(hourlyRate)}/hour, your estimated earnings would be:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Weekly: {formatCurrency(40 * hourlyRate)}</li>
            <li>Monthly: {formatCurrency(40 * hourlyRate * 4.33)}</li>
            <li>Yearly: {formatCurrency(40 * hourlyRate * 52)}</li>
          </ul>
        </div>
      </>
    );
  };
  
  return (
    <CalculatorTemplate
      title="Hours Calculator"
      description="Calculate work hours and pay for timesheet management."
      category="general"
      renderInputs={renderInputs}
      renderResults={renderResults}
      handleCalculate={handleCalculate}
      handleReset={handleReset}
      showResults={showResults}
    />
  );
};

export default HoursCalculator;
