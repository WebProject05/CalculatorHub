
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Info, PlusCircle, RefreshCw, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Grade options
const GRADES = [
  { value: "a+", label: "A+", points: 4.0 },
  { value: "a", label: "A", points: 4.0 },
  { value: "a-", label: "A-", points: 3.7 },
  { value: "b+", label: "B+", points: 3.3 },
  { value: "b", label: "B", points: 3.0 },
  { value: "b-", label: "B-", points: 2.7 },
  { value: "c+", label: "C+", points: 2.3 },
  { value: "c", label: "C", points: 2.0 },
  { value: "c-", label: "C-", points: 1.7 },
  { value: "d+", label: "D+", points: 1.3 },
  { value: "d", label: "D", points: 1.0 },
  { value: "d-", label: "D-", points: 0.7 },
  { value: "f", label: "F", points: 0.0 }
];

// Credit hour options
const CREDIT_HOURS = [1, 2, 3, 4, 5, 6];

// Course interface
interface Course {
  id: string;
  name: string;
  grade: string;
  credits: number;
}

const GpaCalculator = () => {
  // State for courses
  const [courses, setCourses] = useState<Course[]>([
    { id: "1", name: "Course 1", grade: "a", credits: 3 },
    { id: "2", name: "Course 2", grade: "b+", credits: 4 }
  ]);
  
  // State for results
  const [gpa, setGpa] = useState<number | null>(null);
  const [totalCredits, setTotalCredits] = useState(0);
  const [totalGradePoints, setTotalGradePoints] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  // Handle course name change
  const handleCourseNameChange = (id: string, value: string) => {
    setCourses(prevCourses => 
      prevCourses.map(course => 
        course.id === id ? { ...course, name: value } : course
      )
    );
  };
  
  // Handle grade change
  const handleGradeChange = (id: string, value: string) => {
    setCourses(prevCourses => 
      prevCourses.map(course => 
        course.id === id ? { ...course, grade: value } : course
      )
    );
  };
  
  // Handle credits change
  const handleCreditsChange = (id: string, value: number) => {
    setCourses(prevCourses => 
      prevCourses.map(course => 
        course.id === id ? { ...course, credits: value } : course
      )
    );
  };
  
  // Add a new course
  const addCourse = () => {
    const newId = (courses.length + 1).toString();
    setCourses([...courses, { id: newId, name: `Course ${newId}`, grade: "a", credits: 3 }]);
  };
  
  // Remove a course
  const removeCourse = (id: string) => {
    if (courses.length <= 1) {
      toast.error("You must have at least one course");
      return;
    }
    setCourses(courses.filter(course => course.id !== id));
  };
  
  // Calculate GPA
  const calculateGpa = () => {
    let totalPoints = 0;
    let credits = 0;
    
    // Validate course names
    for (const course of courses) {
      if (!course.name.trim()) {
        toast.error("Please enter names for all courses");
        return;
      }
    }
    
    // Calculate GPA
    for (const course of courses) {
      const gradeObj = GRADES.find(g => g.value === course.grade);
      if (gradeObj) {
        totalPoints += gradeObj.points * course.credits;
        credits += course.credits;
      }
    }
    
    const calculatedGpa = credits > 0 ? totalPoints / credits : 0;
    
    // Update state with results
    setGpa(calculatedGpa);
    setTotalCredits(credits);
    setTotalGradePoints(totalPoints);
    setShowResults(true);
    
    toast.success("GPA calculated successfully");
  };
  
  // Get letter grade for GPA
  const getLetterGradeForGpa = (gpaValue: number): string => {
    if (gpaValue >= 4.0) return "A";
    if (gpaValue >= 3.7) return "A-";
    if (gpaValue >= 3.3) return "B+";
    if (gpaValue >= 3.0) return "B";
    if (gpaValue >= 2.7) return "B-";
    if (gpaValue >= 2.3) return "C+";
    if (gpaValue >= 2.0) return "C";
    if (gpaValue >= 1.7) return "C-";
    if (gpaValue >= 1.3) return "D+";
    if (gpaValue >= 1.0) return "D";
    if (gpaValue >= 0.7) return "D-";
    return "F";
  };
  
  // Reset the calculator
  const handleReset = () => {
    setCourses([
      { id: "1", name: "Course 1", grade: "a", credits: 3 },
      { id: "2", name: "Course 2", grade: "b+", credits: 4 }
    ]);
    setGpa(null);
    setTotalCredits(0);
    setTotalGradePoints(0);
    setShowResults(false);
    toast.info("Calculator has been reset");
  };
  
  // Download as PDF
  const handleDownloadPDF = () => {
    toast.success("PDF download started");
    // In a real app, this would generate and download a PDF
  };
  
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">GPA Calculator</h1>
        <p className="text-muted-foreground">
          Calculate your Grade Point Average (GPA) based on course grades and credits.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Enter Your Courses</CardTitle>
            <CardDescription>
              Add your courses, grades, and credit hours
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Course List */}
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-5 sm:col-span-6">
                    <Label htmlFor={`course-${course.id}`} className="sr-only">Course Name</Label>
                    <Input
                      id={`course-${course.id}`}
                      value={course.name}
                      onChange={(e) => handleCourseNameChange(course.id, e.target.value)}
                      placeholder="Course Name"
                      className="w-full"
                    />
                  </div>
                  
                  <div className="col-span-3 sm:col-span-2">
                    <Label htmlFor={`grade-${course.id}`} className="sr-only">Grade</Label>
                    <Select 
                      value={course.grade} 
                      onValueChange={(value) => handleGradeChange(course.id, value)}
                    >
                      <SelectTrigger id={`grade-${course.id}`}>
                        <SelectValue placeholder="Grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {GRADES.map((grade) => (
                          <SelectItem key={grade.value} value={grade.value}>{grade.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-3 sm:col-span-2">
                    <Label htmlFor={`credits-${course.id}`} className="sr-only">Credits</Label>
                    <Select 
                      value={course.credits.toString()} 
                      onValueChange={(value) => handleCreditsChange(course.id, parseInt(value))}
                    >
                      <SelectTrigger id={`credits-${course.id}`}>
                        <SelectValue placeholder="Credits" />
                      </SelectTrigger>
                      <SelectContent>
                        {CREDIT_HOURS.map((credit) => (
                          <SelectItem key={credit} value={credit.toString()}>{credit} {credit === 1 ? 'credit' : 'credits'}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-1 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCourse(course.id)}
                      aria-label="Remove course"
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Add Course Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={addCourse}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Course
            </Button>
            
            {/* Info */}
            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
              <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm">
                  Enter all your courses for the semester to calculate your GPA. Make sure the credit hours are correct for each course.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleReset} className="w-full flex items-center gap-2 mr-2">
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
            <Button onClick={calculateGpa} className="w-full flex items-center gap-2 ml-2">
              <Send className="h-4 w-4" />
              Calculate GPA
            </Button>
          </CardFooter>
        </Card>
        
        {/* Results */}
        <Card className={`lg:col-span-1 shadow-sm transition-opacity duration-500 ${showResults ? 'opacity-100' : 'opacity-50'}`}>
          <CardHeader>
            <CardTitle>GPA Results</CardTitle>
            <CardDescription>
              Your calculated Grade Point Average
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {showResults && gpa !== null ? (
              <>
                {/* GPA Results */}
                <div className="p-6 bg-secondary rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Your GPA</p>
                  <p className="text-5xl font-bold mb-2">{gpa.toFixed(2)}</p>
                  <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    {getLetterGradeForGpa(gpa)}
                  </div>
                </div>
                
                {/* Course Summary */}
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Credits</span>
                      <span className="font-medium">{totalCredits}</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Grade Points</span>
                      <span className="font-medium">{totalGradePoints.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Course Count</span>
                      <span className="font-medium">{courses.length}</span>
                    </div>
                  </div>
                </div>
                
                {/* Performance Assessment */}
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Performance</h3>
                  <p className="text-sm text-muted-foreground">
                    {gpa >= 3.5 ? (
                      "Excellent! You're doing very well, keep up the good work!"
                    ) : gpa >= 3.0 ? (
                      "Good job! You're performing well above average."
                    ) : gpa >= 2.0 ? (
                      "You're doing okay, but there's room for improvement."
                    ) : (
                      "You may need to focus more on your studies to improve your GPA."
                    )}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Add your courses and click "Calculate GPA" to see your results
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
                Download Report
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default GpaCalculator;
