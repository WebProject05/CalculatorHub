
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Copy, Download, Info, RefreshCw, Shield } from "lucide-react";
import { downloadAsPDF } from "@/utils/pdfUtils";

const PasswordGenerator = () => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  useEffect(() => {
    if (password) {
      calculatePasswordStrength();
    }
  }, [password]);
  
  const generatePassword = () => {
    // Make sure at least one character set is selected
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
      toast.error("Please select at least one character type");
      return;
    }
    
    // Character sets
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    // Build character pool based on selections
    let charPool = "";
    if (includeUppercase) charPool += uppercaseChars;
    if (includeLowercase) charPool += lowercaseChars;
    if (includeNumbers) charPool += numberChars;
    if (includeSymbols) charPool += symbolChars;
    
    // Generate random password
    let newPassword = "";
    
    // Ensure at least one character from each selected type
    if (includeUppercase) 
      newPassword += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
    if (includeLowercase) 
      newPassword += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));
    if (includeNumbers) 
      newPassword += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
    if (includeSymbols) 
      newPassword += symbolChars.charAt(Math.floor(Math.random() * symbolChars.length));
    
    // Fill the rest randomly
    for (let i = newPassword.length; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charPool.length);
      newPassword += charPool.charAt(randomIndex);
    }
    
    // Shuffle the password to mix the guaranteed characters
    newPassword = shuffleString(newPassword);
    
    setPassword(newPassword);
    setShowResults(true);
    toast.success("Password generated successfully");
  };
  
  const shuffleString = (str: string) => {
    const array = str.split('');
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
  };
  
  const calculatePasswordStrength = () => {
    // Basic password strength calculation (0-100)
    let strength = 0;
    
    // Length factor (up to 40 points)
    strength += Math.min(40, length * 2);
    
    // Character variety (up to 60 points)
    if (includeUppercase) strength += 15;
    if (includeLowercase) strength += 15;
    if (includeNumbers) strength += 15;
    if (includeSymbols) strength += 15;
    
    setPasswordStrength(strength);
  };
  
  const getStrengthLabel = () => {
    if (passwordStrength < 30) return "Very Weak";
    if (passwordStrength < 50) return "Weak";
    if (passwordStrength < 70) return "Moderate";
    if (passwordStrength < 90) return "Strong";
    return "Very Strong";
  };
  
  const getStrengthColor = () => {
    if (passwordStrength < 30) return "bg-red-500";
    if (passwordStrength < 50) return "bg-orange-500";
    if (passwordStrength < 70) return "bg-yellow-500";
    if (passwordStrength < 90) return "bg-lime-500";
    return "bg-green-500";
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
      .then(() => toast.success("Password copied to clipboard"))
      .catch(() => toast.error("Failed to copy password"));
  };
  
  const handleReset = () => {
    setPassword("");
    setLength(16);
    setIncludeUppercase(true);
    setIncludeLowercase(true);
    setIncludeNumbers(true);
    setIncludeSymbols(true);
    setShowResults(false);
    toast.info("Settings reset");
  };
  
  const handleDownloadPDF = () => {
    downloadAsPDF('password-result', 'password-generator-results.pdf');
  };
  
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Password Generator</h1>
        <p className="text-muted-foreground">
          Generate secure, random passwords with customizable parameters.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Input Form */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Password Settings</CardTitle>
            <CardDescription>
              Customize your password requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Password Length */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="passwordLength">Password Length</Label>
                <span className="text-sm text-muted-foreground">{length} characters</span>
              </div>
              <Slider
                value={[length]}
                min={8}
                max={32}
                step={1}
                onValueChange={(value) => setLength(value[0])}
              />
              <span className="text-xs text-muted-foreground flex justify-between">
                <span>8</span>
                <span>32</span>
              </span>
            </div>
            
            {/* Character Types */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Include Character Types</h3>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="includeUppercase" className="cursor-pointer">Uppercase Letters (A-Z)</Label>
                <Switch 
                  id="includeUppercase" 
                  checked={includeUppercase} 
                  onCheckedChange={setIncludeUppercase} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="includeLowercase" className="cursor-pointer">Lowercase Letters (a-z)</Label>
                <Switch 
                  id="includeLowercase" 
                  checked={includeLowercase} 
                  onCheckedChange={setIncludeLowercase} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="includeNumbers" className="cursor-pointer">Numbers (0-9)</Label>
                <Switch 
                  id="includeNumbers" 
                  checked={includeNumbers} 
                  onCheckedChange={setIncludeNumbers} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="includeSymbols" className="cursor-pointer">Special Characters (!@#$%^&*)</Label>
                <Switch 
                  id="includeSymbols" 
                  checked={includeSymbols} 
                  onCheckedChange={setIncludeSymbols} 
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleReset} className="w-full flex items-center gap-2 mr-2">
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
            <Button onClick={generatePassword} className="w-full flex items-center gap-2 ml-2">
              <Shield className="h-4 w-4" />
              Generate
            </Button>
          </CardFooter>
        </Card>
        
        {/* Results */}
        <Card id="password-result" className={`lg:col-span-3 shadow-sm transition-opacity duration-500 ${showResults ? 'opacity-100' : 'opacity-50'}`}>
          <CardHeader>
            <CardTitle>Generated Password</CardTitle>
            <CardDescription>
              Your secure random password
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {password ? (
              <>
                {/* Password Display */}
                <div className="p-4 bg-secondary rounded-lg">
                  <div className="mb-2 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Your Password</span>
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="h-3 w-3 mr-1" /> Copy
                    </Button>
                  </div>
                  <div className="bg-background p-4 rounded border border-border font-mono text-lg break-all">
                    {password}
                  </div>
                </div>
                
                {/* Password Strength */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Password Strength</span>
                    <span className="text-sm font-medium">{getStrengthLabel()}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getStrengthColor()}`} 
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Password Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Character Count</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Length:</p>
                        <p className="font-mono">{password.length}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Uppercase:</p>
                        <p className="font-mono">{(password.match(/[A-Z]/g) || []).length}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Lowercase:</p>
                        <p className="font-mono">{(password.match(/[a-z]/g) || []).length}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Numbers:</p>
                        <p className="font-mono">{(password.match(/[0-9]/g) || []).length}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Symbols:</p>
                        <p className="font-mono">{(password.match(/[^A-Za-z0-9]/g) || []).length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Password Safety</h3>
                    <p className="text-sm text-muted-foreground">
                      {passwordStrength >= 70 ? 
                        "This password would take centuries to crack with current technology." : 
                        passwordStrength >= 50 ? 
                          "This password is reasonably secure but could be stronger." :
                          "This password could be vulnerable to modern cracking methods."
                      }
                    </p>
                  </div>
                </div>
                
                {/* Security Tips */}
                <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                  <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Password Security Tips</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Use a different password for each account</li>
                      <li>Don't share your passwords with others</li>
                      <li>Consider using a password manager</li>
                      <li>Change your passwords periodically</li>
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Click "Generate" to create a secure password
                </p>
              </div>
            )}
          </CardContent>
          
          {showResults && password && (
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

export default PasswordGenerator;
