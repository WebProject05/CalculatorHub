
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Dice5, RefreshCw, Send } from "lucide-react";
import { toast } from "sonner";
import { downloadAsPDF } from "@/utils/pdfUtils";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const LuckyNumberCalculator = () => {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [luckyNumber, setLuckyNumber] = useState<number | null>(null);
  const [luckyColor, setLuckyColor] = useState("");
  const [luckyDay, setLuckyDay] = useState("");
  const [luckyGemstone, setLuckyGemstone] = useState("");
  const [showResults, setShowResults] = useState(false);
  
  // Calculate lucky number based on name and birth date
  const calculateLuckyNumber = () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    
    if (!birthDate) {
      toast.error("Please select your birth date");
      return;
    }
    
    try {
      // Name numerology: Sum the position values of letters in name
      const nameValue = name.toLowerCase().split('').reduce((sum, char) => {
        const charCode = char.charCodeAt(0);
        // Only consider alphabets and convert to 1-26 range
        if (charCode >= 97 && charCode <= 122) {
          return sum + (charCode - 96);
        }
        return sum;
      }, 0);
      
      // Birth date numerology: Sum the digits in birth date
      const dateString = format(birthDate, 'ddMMyyyy');
      const dateValue = dateString.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
      
      // Combine and reduce to a single digit (1-9)
      let finalNumber = (nameValue + dateValue) % 9;
      if (finalNumber === 0) finalNumber = 9; // 0 becomes 9 in numerology
      
      setLuckyNumber(finalNumber);
      
      // Set lucky color based on number
      const colors = [
        "",
        "Red", // 1
        "Orange", // 2
        "Yellow", // 3
        "Green", // 4
        "Blue", // 5
        "Indigo", // 6
        "Violet", // 7
        "Pink", // 8
        "Gold" // 9
      ];
      setLuckyColor(colors[finalNumber]);
      
      // Set lucky day based on number
      const days = [
        "",
        "Sunday", // 1
        "Monday", // 2
        "Tuesday", // 3
        "Wednesday", // 4
        "Thursday", // 5
        "Friday", // 6
        "Saturday", // 7
        "Sunday", // 8
        "Monday" // 9
      ];
      setLuckyDay(days[finalNumber]);
      
      // Set lucky gemstone based on number
      const gemstones = [
        "",
        "Ruby", // 1
        "Moonstone", // 2
        "Citrine", // 3
        "Emerald", // 4
        "Sapphire", // 5
        "Diamond", // 6
        "Amethyst", // 7
        "Jade", // 8
        "Topaz" // 9
      ];
      setLuckyGemstone(gemstones[finalNumber]);
      
      setShowResults(true);
      toast.success("Lucky number calculated!");
      
    } catch (error) {
      console.error("Error calculating lucky number:", error);
      toast.error("Error calculating lucky number. Please try again.");
    }
  };
  
  // Get lucky number meaning
  const getLuckyNumberMeaning = (num: number): string => {
    const meanings = [
      "",
      "Leadership, independence, and individuality. You are likely to be a pioneer and innovator.", // 1
      "Harmony, diplomacy, and cooperation. You excel in partnerships and creating balance.", // 2
      "Creativity, self-expression, and joy. You have a natural ability to inspire others.", // 3
      "Stability, practicality, and hard work. You build solid foundations in life.", // 4
      "Freedom, adaptability, and adventure. You embrace change and new experiences.", // 5
      "Nurturing, responsibility, and service. You care deeply for others and your community.", // 6
      "Spirituality, analysis, and wisdom. You seek deeper understanding and meaning.", // 7
      "Ambition, success, and material abundance. You have the ability to manifest wealth.", // 8
      "Compassion, humanitarianism, and completion. You see the big picture in life." // 9
    ];
    return meanings[num];
  };
  
  // Reset calculator
  const handleReset = () => {
    setName("");
    setBirthDate(undefined);
    setLuckyNumber(null);
    setLuckyColor("");
    setLuckyDay("");
    setLuckyGemstone("");
    setShowResults(false);
    toast.info("Calculator has been reset");
  };
  
  // Download as PDF
  const handleDownloadPDF = () => {
    downloadAsPDF('lucky-number-results', 'lucky-number-results.pdf');
  };
  
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Lucky Number Calculator</h1>
        <p className="text-muted-foreground">
          Discover your personal lucky number based on your name and birth date.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Input Form */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Enter Your Details</CardTitle>
            <CardDescription>
              Your lucky number is calculated from your name and birth date
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Your Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full"
              />
            </div>
            
            {/* Birth Date */}
            <div className="space-y-2">
              <Label htmlFor="birthDate">Birth Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal h-10"
                  >
                    {birthDate ? format(birthDate, "PPP") : "Select birth date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={birthDate}
                    onSelect={setBirthDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleReset} className="w-full flex items-center gap-2 mr-2">
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
            <Button onClick={calculateLuckyNumber} className="w-full flex items-center gap-2 ml-2">
              <Dice5 className="h-4 w-4" />
              Calculate
            </Button>
          </CardFooter>
        </Card>
        
        {/* Results */}
        <Card id="lucky-number-results" className={`lg:col-span-3 shadow-sm transition-opacity duration-500 ${showResults ? 'opacity-100' : 'opacity-50'}`}>
          <CardHeader>
            <CardTitle>Your Lucky Number</CardTitle>
            <CardDescription>
              Based on numerology principles using your name and birth date
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {luckyNumber ? (
              <>
                {/* Lucky Number Display */}
                <div className="p-6 bg-secondary rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Your Lucky Number</p>
                  <div className="inline-flex items-center justify-center bg-primary text-primary-foreground rounded-full w-24 h-24 text-5xl font-bold mb-2">
                    {luckyNumber}
                  </div>
                  <p className="text-lg font-medium mt-2">{name}</p>
                  <p className="text-sm text-muted-foreground">
                    Born on {birthDate ? format(birthDate, "MMMM dd, yyyy") : ""}
                  </p>
                </div>
                
                {/* Lucky Attributes */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">Lucky Color</p>
                    <p className="text-lg font-semibold">{luckyColor}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">Lucky Day</p>
                    <p className="text-lg font-semibold">{luckyDay}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">Lucky Gemstone</p>
                    <p className="text-lg font-semibold">{luckyGemstone}</p>
                  </div>
                </div>
                
                {/* Number Meaning */}
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">The Meaning of Number {luckyNumber}</h3>
                  <p className="text-muted-foreground">
                    {getLuckyNumberMeaning(luckyNumber)}
                  </p>
                </div>
                
                {/* Life Path Guidance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-medium mb-2">Your Strengths</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {luckyNumber === 1 && (
                        <>
                          <li>Natural leadership</li>
                          <li>Independent thinking</li>
                          <li>Strong willpower</li>
                        </>
                      )}
                      {luckyNumber === 2 && (
                        <>
                          <li>Cooperative nature</li>
                          <li>Diplomatic skills</li>
                          <li>Sensitivity to others</li>
                        </>
                      )}
                      {luckyNumber === 3 && (
                        <>
                          <li>Artistic expression</li>
                          <li>Communication skills</li>
                          <li>Optimistic outlook</li>
                        </>
                      )}
                      {luckyNumber === 4 && (
                        <>
                          <li>Reliability</li>
                          <li>Organizational skills</li>
                          <li>Practical thinking</li>
                        </>
                      )}
                      {luckyNumber === 5 && (
                        <>
                          <li>Versatility</li>
                          <li>Adaptability</li>
                          <li>Progressive mindset</li>
                        </>
                      )}
                      {luckyNumber === 6 && (
                        <>
                          <li>Nurturing nature</li>
                          <li>Responsibility</li>
                          <li>Harmonious presence</li>
                        </>
                      )}
                      {luckyNumber === 7 && (
                        <>
                          <li>Analytical skills</li>
                          <li>Spiritual awareness</li>
                          <li>Inner wisdom</li>
                        </>
                      )}
                      {luckyNumber === 8 && (
                        <>
                          <li>Business acumen</li>
                          <li>Manifestation ability</li>
                          <li>Drive for success</li>
                        </>
                      )}
                      {luckyNumber === 9 && (
                        <>
                          <li>Compassionate heart</li>
                          <li>Global perspective</li>
                          <li>Humanitarian values</li>
                        </>
                      )}
                    </ul>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-medium mb-2">Life Path Guidance</h3>
                    <p className="text-sm text-muted-foreground">
                      {luckyNumber === 1 && "Focus on developing your own unique path and don't be afraid to take the lead in situations."}
                      {luckyNumber === 2 && "Nurture your natural diplomacy and seek roles where your cooperative nature can shine."}
                      {luckyNumber === 3 && "Express yourself creatively and use your natural optimism to inspire those around you."}
                      {luckyNumber === 4 && "Build stable foundations in your life and trust your practical approach to challenges."}
                      {luckyNumber === 5 && "Embrace change and seek experiences that allow you freedom and variety in life."}
                      {luckyNumber === 6 && "Focus on creating harmony in your home and community, nurturing those you care about."}
                      {luckyNumber === 7 && "Pursue knowledge and spiritual growth, giving yourself time for reflection and analysis."}
                      {luckyNumber === 8 && "Develop your abilities in business and finance, aiming for both material and spiritual abundance."}
                      {luckyNumber === 9 && "Serve humanity with your compassionate nature and share your wisdom with the world."}
                    </p>
                  </div>
                </div>
                
                <div className="text-center text-sm text-muted-foreground">
                  <p>For entertainment purposes only. Numerology is not scientifically validated.</p>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Dice5 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Enter your name and birth date and click "Calculate" to discover your lucky number
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

export default LuckyNumberCalculator;
