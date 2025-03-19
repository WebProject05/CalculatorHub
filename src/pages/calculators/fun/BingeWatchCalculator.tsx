
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { formatNumber } from "@/utils/calculators";
import CalculatorTemplate from "@/utils/CalculatorTemplate";
import { MonitorPlay, Timer, Video } from "lucide-react";

const BingeWatchCalculator = () => {
  // State for form inputs
  const [showName, setShowName] = useState<string>("Stranger Things");
  const [seasons, setSeasons] = useState<number>(4);
  const [episodesPerSeason, setEpisodesPerSeason] = useState<number>(8);
  const [episodeDuration, setEpisodeDuration] = useState<number>(50);
  const [hoursPerDay, setHoursPerDay] = useState<number>(3);
  const [skipIntro, setSkipIntro] = useState<boolean>(true);
  const [introDuration, setIntroDuration] = useState<number>(60);
  
  // State for results
  const [totalEpisodes, setTotalEpisodes] = useState<number | null>(null);
  const [totalWatchTime, setTotalWatchTime] = useState<number | null>(null);
  const [daysRequired, setDaysRequired] = useState<number | null>(null);
  const [weeksRequired, setWeeksRequired] = useState<number | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  
  // Calculate binge watch time
  const calculateBingeTime = () => {
    // Validate inputs
    if (!showName.trim()) {
      toast.error("Please enter a show name");
      return;
    }
    
    if (seasons <= 0 || episodesPerSeason <= 0 || episodeDuration <= 0 || hoursPerDay <= 0) {
      toast.error("All values must be greater than zero");
      return;
    }
    
    // Calculate total episodes
    const calculatedTotalEpisodes = seasons * episodesPerSeason;
    
    // Calculate time savings from skipping intros (in minutes)
    const introSavingsPerEpisode = skipIntro ? introDuration / 60 : 0;
    
    // Calculate total watch time in hours
    const totalWatchTimeInMinutes = calculatedTotalEpisodes * (episodeDuration - introSavingsPerEpisode);
    const calculatedTotalWatchTime = totalWatchTimeInMinutes / 60;
    
    // Calculate days required
    const calculatedDaysRequired = calculatedTotalWatchTime / hoursPerDay;
    
    // Calculate weeks required
    const calculatedWeeksRequired = calculatedDaysRequired / 7;
    
    // Update state
    setTotalEpisodes(calculatedTotalEpisodes);
    setTotalWatchTime(calculatedTotalWatchTime);
    setDaysRequired(calculatedDaysRequired);
    setWeeksRequired(calculatedWeeksRequired);
    setShowResults(true);
    
    toast.success(`Binge-watch time calculated for ${showName}`);
  };
  
  // Reset calculator
  const handleReset = () => {
    setShowName("Stranger Things");
    setSeasons(4);
    setEpisodesPerSeason(8);
    setEpisodeDuration(50);
    setHoursPerDay(3);
    setSkipIntro(true);
    setIntroDuration(60);
    setTotalEpisodes(null);
    setTotalWatchTime(null);
    setDaysRequired(null);
    setWeeksRequired(null);
    setShowResults(false);
    toast.info("Calculator has been reset");
  };
  
  // Format time in hours and minutes
  const formatTime = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (wholeHours === 0) {
      return `${minutes} minutes`;
    } else if (minutes === 0) {
      return `${wholeHours} ${wholeHours === 1 ? 'hour' : 'hours'}`;
    } else {
      return `${wholeHours} ${wholeHours === 1 ? 'hour' : 'hours'} ${minutes} minutes`;
    }
  };
  
  // Render inputs
  const renderInputs = () => {
    return (
      <>
        {/* Show Name */}
        <div className="space-y-2">
          <Label htmlFor="showName">TV Show or Series Name</Label>
          <Input
            id="showName"
            value={showName}
            onChange={(e) => setShowName(e.target.value)}
            placeholder="Enter show name"
          />
        </div>
        
        {/* Seasons */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="seasons">Number of Seasons</Label>
            <span className="text-sm text-muted-foreground">{seasons}</span>
          </div>
          <Slider
            id="seasons-slider"
            value={[seasons]}
            onValueChange={(values) => setSeasons(values[0])}
            min={1}
            max={20}
            step={1}
            className="py-2"
          />
          <Input
            id="seasons"
            type="number"
            min={1}
            value={seasons}
            onChange={(e) => setSeasons(parseInt(e.target.value) || 1)}
          />
        </div>
        
        {/* Episodes Per Season */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="episodesPerSeason">Episodes Per Season</Label>
            <span className="text-sm text-muted-foreground">{episodesPerSeason}</span>
          </div>
          <Slider
            id="episodesPerSeason-slider"
            value={[episodesPerSeason]}
            onValueChange={(values) => setEpisodesPerSeason(values[0])}
            min={1}
            max={24}
            step={1}
            className="py-2"
          />
          <Input
            id="episodesPerSeason"
            type="number"
            min={1}
            value={episodesPerSeason}
            onChange={(e) => setEpisodesPerSeason(parseInt(e.target.value) || 1)}
          />
        </div>
        
        {/* Episode Duration */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="episodeDuration">Average Episode Duration (minutes)</Label>
            <span className="text-sm text-muted-foreground">{episodeDuration} minutes</span>
          </div>
          <Slider
            id="episodeDuration-slider"
            value={[episodeDuration]}
            onValueChange={(values) => setEpisodeDuration(values[0])}
            min={10}
            max={120}
            step={5}
            className="py-2"
          />
          <Input
            id="episodeDuration"
            type="number"
            min={1}
            value={episodeDuration}
            onChange={(e) => setEpisodeDuration(parseInt(e.target.value) || 1)}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>10 min</span>
            <span>120 min</span>
          </div>
        </div>
        
        {/* Skip Intro */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="skipIntro" className="cursor-pointer">Skip Intro/Credits</Label>
            <Switch
              id="skipIntro"
              checked={skipIntro}
              onCheckedChange={setSkipIntro}
            />
          </div>
          
          {skipIntro && (
            <div className="space-y-2 pl-5 border-l-2 border-muted">
              <div className="flex justify-between">
                <Label htmlFor="introDuration">Intro/Credits Duration (seconds)</Label>
                <span className="text-sm text-muted-foreground">{introDuration} seconds</span>
              </div>
              <Slider
                id="introDuration-slider"
                value={[introDuration]}
                onValueChange={(values) => setIntroDuration(values[0])}
                min={10}
                max={180}
                step={5}
                className="py-2"
              />
              <Input
                id="introDuration"
                type="number"
                min={1}
                value={introDuration}
                onChange={(e) => setIntroDuration(parseInt(e.target.value) || 1)}
              />
            </div>
          )}
        </div>
        
        {/* Hours Per Day */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="hoursPerDay">Hours You Can Watch Per Day</Label>
            <span className="text-sm text-muted-foreground">{hoursPerDay} hours</span>
          </div>
          <Slider
            id="hoursPerDay-slider"
            value={[hoursPerDay]}
            onValueChange={(values) => setHoursPerDay(values[0])}
            min={0.5}
            max={12}
            step={0.5}
            className="py-2"
          />
          <Input
            id="hoursPerDay"
            type="number"
            min={0.5}
            step={0.5}
            value={hoursPerDay}
            onChange={(e) => setHoursPerDay(parseFloat(e.target.value) || 0.5)}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0.5 hours</span>
            <span>12 hours</span>
          </div>
        </div>
      </>
    );
  };
  
  // Render results
  const renderResults = () => {
    // Safety check for null values
    if (totalEpisodes === null || totalWatchTime === null || daysRequired === null || weeksRequired === null) {
      return <div className="text-center py-10">Please calculate first</div>;
    }
    
    return (
      <>
        {/* Show Information */}
        <div className="p-6 bg-secondary rounded-lg text-center">
          <MonitorPlay className="h-10 w-10 mx-auto mb-2 text-primary" />
          <h2 className="text-xl font-bold">{showName}</h2>
          <div className="flex justify-center gap-x-4 mt-2 text-sm text-muted-foreground">
            <span>{seasons} {seasons === 1 ? 'season' : 'seasons'}</span>
            <span>•</span>
            <span>{totalEpisodes} episodes</span>
            <span>•</span>
            <span>{episodeDuration} min/episode</span>
          </div>
        </div>
        
        {/* Time Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted p-4 rounded-lg flex flex-col items-center">
            <Timer className="h-6 w-6 mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Total Watch Time</p>
            <p className="text-2xl font-bold">{formatTime(totalWatchTime)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              ({formatNumber(totalWatchTime, 1)} hours)
            </p>
          </div>
          
          <div className="bg-muted p-4 rounded-lg flex flex-col items-center">
            <Video className="h-6 w-6 mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Binge Duration</p>
            <p className="text-2xl font-bold">{formatNumber(daysRequired, 1)} days</p>
            <p className="text-xs text-muted-foreground mt-1">
              ({formatNumber(weeksRequired, 1)} weeks)
            </p>
          </div>
        </div>
        
        {/* Binge Schedule */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-3">Your Binge-Watch Schedule</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Daily watch time:</span>
              <span className="font-medium">{hoursPerDay} hours per day</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Episodes per day:</span>
              <span className="font-medium">
                ~{formatNumber(hoursPerDay * 60 / episodeDuration, 1)} episodes
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Time saved by skipping intros:</span>
              <span className="font-medium">
                {skipIntro
                  ? formatTime((totalEpisodes * introDuration) / 3600)
                  : "0 hours"}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Completion date if starting today:</span>
              <span className="font-medium">
                {new Date(Date.now() + daysRequired * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        
        {/* Popular Shows */}
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-medium mb-3">Popular Shows for Comparison</h3>
          
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-3 gap-2 border-b pb-2">
              <span className="font-medium">Show</span>
              <span className="font-medium">Episodes</span>
              <span className="font-medium">Total Hours</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <span>Game of Thrones</span>
              <span>73</span>
              <span>70 hours</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <span>Breaking Bad</span>
              <span>62</span>
              <span>50 hours</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <span>Friends</span>
              <span>236</span>
              <span>90 hours</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <span>The Office (US)</span>
              <span>201</span>
              <span>77 hours</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <span>Stranger Things</span>
              <span>32</span>
              <span>25 hours</span>
            </div>
          </div>
        </div>
      </>
    );
  };
  
  return (
    <CalculatorTemplate
      title="Binge-Watch Calculator"
      description="Calculate how long it will take to watch an entire TV series."
      category="fun"
      renderInputs={renderInputs}
      renderResults={renderResults}
      handleCalculate={calculateBingeTime}
      handleReset={handleReset}
      showResults={showResults}
    />
  );
};

export default BingeWatchCalculator;
