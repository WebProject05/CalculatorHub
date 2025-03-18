
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Heart, RefreshCw, Send } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const LoveCalculator = () => {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [compatibilityScore, setCompatibilityScore] = useState<number | null>(null);
  const [compatibilityMessage, setCompatibilityMessage] = useState("");
  const [showResults, setShowResults] = useState(false);
  
  // Calculate compatibility score based on names
  const calculateCompatibility = () => {
    if (!name1.trim() || !name2.trim()) {
      toast.error("Please enter both names");
      return;
    }
    
    // Pseudoscientific algorithm for fun
    const combinedName = (name1 + name2).toLowerCase();
    let loveLetters = "love";
    let count = 0;
    
    for (let char of combinedName) {
      if (loveLetters.includes(char)) {
        count++;
      }
    }
    
    // Create a score based on character matching and length
    let baseScore = Math.min(100, Math.max(40, (count * 10) + (combinedName.length % 10) * 5));
    
    // Add some randomness (±10%) to make it more fun
    const randomFactor = Math.floor(Math.random() * 20) - 10;
    const finalScore = Math.min(100, Math.max(1, baseScore + randomFactor));
    
    setCompatibilityScore(finalScore);
    setCompatibilityMessage(getCompatibilityMessage(finalScore));
    setShowResults(true);
    
    toast.success("Love compatibility calculated!");
  };
  
  // Get message based on score
  const getCompatibilityMessage = (score: number): string => {
    if (score >= 90) return "Soulmates! A match made in heaven.";
    if (score >= 80) return "Very strong connection. True love potential!";
    if (score >= 70) return "Great match! You have a bright future together.";
    if (score >= 60) return "Good compatibility. Worth pursuing this relationship.";
    if (score >= 50) return "Average compatibility. Could work with some effort.";
    if (score >= 40) return "Some challenges ahead, but don't give up!";
    if (score >= 30) return "Might need to work harder on this relationship.";
    if (score >= 20) return "Quite difficult. Friendship might be better.";
    return "Not the best match. But love can overcome anything!";
  };
  
  // Reset calculator
  const handleReset = () => {
    setName1("");
    setName2("");
    setCompatibilityScore(null);
    setCompatibilityMessage("");
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
        <h1 className="text-3xl font-bold mb-2">Love Calculator</h1>
        <p className="text-muted-foreground">
          Calculate the love compatibility between two people. Just for fun!
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Input Form */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Enter Names</CardTitle>
            <CardDescription>
              See how compatible you are with your crush or partner
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* First Person */}
            <div className="space-y-2">
              <Label htmlFor="name1">First Person</Label>
              <Input
                id="name1"
                value={name1}
                onChange={(e) => setName1(e.target.value)}
                placeholder="Enter first name"
                className="w-full"
              />
            </div>
            
            {/* Second Person */}
            <div className="space-y-2">
              <Label htmlFor="name2">Second Person</Label>
              <Input
                id="name2"
                value={name2}
                onChange={(e) => setName2(e.target.value)}
                placeholder="Enter second name"
                className="w-full"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleReset} className="w-full flex items-center gap-2 mr-2">
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
            <Button onClick={calculateCompatibility} className="w-full flex items-center gap-2 ml-2">
              <Send className="h-4 w-4" />
              Calculate
            </Button>
          </CardFooter>
        </Card>
        
        {/* Results */}
        <Card className={`lg:col-span-3 shadow-sm transition-opacity duration-500 ${showResults ? 'opacity-100' : 'opacity-50'}`}>
          <CardHeader>
            <CardTitle>Love Compatibility Results</CardTitle>
            <CardDescription>
              See how compatible {name1 && name2 ? `${name1} and ${name2}` : "you two"} are
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {compatibilityScore !== null ? (
              <>
                {/* Hearts Animation */}
                <div className="p-6 bg-secondary rounded-lg text-center relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <Heart className="text-red-500 h-40 w-40" />
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-1">Love Compatibility</p>
                  <div className="flex items-center justify-center gap-4">
                    <p className="text-4xl font-bold mb-2 text-red-500">{name1}</p>
                    <Heart className="h-8 w-8 text-red-500 animate-pulse" />
                    <p className="text-4xl font-bold mb-2 text-red-500">{name2}</p>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Compatibility Score</span>
                      <span className="text-sm font-medium">{compatibilityScore}%</span>
                    </div>
                    <Progress value={compatibilityScore} className="h-4" />
                  </div>
                  
                  <p className="mt-6 text-lg font-medium">{compatibilityMessage}</p>
                </div>
                
                {/* Love Horoscope */}
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">What This Means</h3>
                  <p className="text-sm text-muted-foreground">
                    {compatibilityScore >= 70 ? (
                      "You have a strong connection that could lead to a beautiful relationship. There's natural chemistry between you two that makes your interactions special."
                    ) : compatibilityScore >= 40 ? (
                      "Your relationship has potential but may require effort and communication. Focus on understanding each other's needs and perspectives."
                    ) : (
                      "Your connection might face challenges, but remember that opposites can attract too! Real relationships take work regardless of initial compatibility."
                    )}
                  </p>
                </div>
                
                {/* Relationship Tips */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-medium mb-2">Strengths</h3>
                    <p className="text-sm text-muted-foreground">
                      {compatibilityScore >= 60 ? 
                        "Communication, trust, and mutual respect. You likely understand each other well." : 
                        "Learning from differences, potential for growth, and complementary traits."}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-medium mb-2">Tips</h3>
                    <p className="text-sm text-muted-foreground">
                      {compatibilityScore >= 60 ? 
                        "Keep doing what you're doing! Share more experiences to further strengthen your bond." : 
                        "Focus on open communication and appreciating your differences as strengths rather than obstacles."}
                    </p>
                  </div>
                </div>
                
                <div className="text-center text-sm text-muted-foreground mt-4">
                  <p>This calculator is for entertainment purposes only. Real relationships are complex and not determined by algorithms!</p>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Enter two names and click "Calculate" to see your love compatibility
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
                Save Results
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LoveCalculator;
