"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Mic, MicOff, Volume2, Guitar } from "lucide-react";

type GuitarString = {
  name: string;
  note: string;
  frequency: number;
  color: string;
};

const GUITAR_STRINGS: GuitarString[] = [
  { name: "1st (E)", note: "E", frequency: 329.63, color: "text-red-500" },
  { name: "2nd (B)", note: "B", frequency: 246.94, color: "text-orange-500" },
  { name: "3rd (G)", note: "G", frequency: 196.00, color: "text-yellow-500" },
  { name: "4th (D)", note: "D", frequency: 146.83, color: "text-green-500" },
  { name: "5th (A)", note: "A", frequency: 110.00, color: "text-blue-500" },
  { name: "6th (E)", note: "E", frequency: 82.41, color: "text-purple-500" },
];

export function GuitarTuner() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentFrequency, setCurrentFrequency] = useState<number | null>(null);
  const [closestString, setClosestString] = useState<GuitarString | null>(null);
  const [tuningDirection, setTuningDirection] = useState<"up" | "down" | "in-tune" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const startListening = async () => {
    try {
      setError(null);
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create audio context
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 4096; // Increased for better frequency resolution
      analyserRef.current.smoothingTimeConstant = 0.8;
      
      // Connect microphone to analyser
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      microphoneRef.current.connect(analyserRef.current);
      
      setIsListening(true);
      detectPitch();
    } catch (err) {
      setError("Microphone access denied. Please allow microphone access to use the tuner.");
      console.error("Error accessing microphone:", err);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    setCurrentFrequency(null);
    setClosestString(null);
    setTuningDirection(null);
    setVolume(0);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const detectPitch = () => {
    if (!analyserRef.current || !isListening) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    analyserRef.current.getFloatFrequencyData(dataArray);

    // Calculate volume level
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += Math.pow(10, dataArray[i] / 20);
    }
    const average = sum / bufferLength;
    setVolume(average);

    // Find the peak frequency with better detection
    let maxIndex = 0;
    let maxValue = -Infinity;
    
    // Focus on guitar frequency range (80Hz - 400Hz)
    const sampleRate = audioContextRef.current?.sampleRate || 44100;
    const minBin = Math.floor(80 * analyserRef.current.fftSize / sampleRate);
    const maxBin = Math.floor(400 * analyserRef.current.fftSize / sampleRate);
    
    for (let i = minBin; i < maxBin && i < bufferLength; i++) {
      if (dataArray[i] > maxValue) {
        maxValue = dataArray[i];
        maxIndex = i;
      }
    }

    // Convert bin index to frequency
    const frequency = (maxIndex * sampleRate) / (analyserRef.current.fftSize * 2);
    
    // Only update if we have a reasonable frequency and sufficient volume
    if (frequency > 80 && frequency < 400 && maxValue > -60 && average > 0.01) {
      setCurrentFrequency(frequency);
      
      // Find closest guitar string
      let closest = GUITAR_STRINGS[0];
      let minDifference = Math.abs(frequency - closest.frequency);
      
      GUITAR_STRINGS.forEach(string => {
        const difference = Math.abs(frequency - string.frequency);
        if (difference < minDifference) {
          minDifference = difference;
          closest = string;
        }
      });
      
      setClosestString(closest);
      
      // Determine tuning direction with smaller tolerance
      const difference = frequency - closest.frequency;
      const tolerance = 1; // Hz tolerance
      
      if (Math.abs(difference) < tolerance) {
        setTuningDirection("in-tune");
      } else if (difference > 0) {
        setTuningDirection("down");
      } else {
        setTuningDirection("up");
      }
    } else {
      setCurrentFrequency(null);
      setClosestString(null);
      setTuningDirection(null);
    }

    animationFrameRef.current = requestAnimationFrame(detectPitch);
  };

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  const getTuningInstruction = () => {
    if (!tuningDirection || !closestString) return "";
    
    switch (tuningDirection) {
      case "in-tune":
        return "Perfect! String is in tune.";
      case "up":
        return `Tune ${closestString.name} UP (tighten the string)`;
      case "down":
        return `Tune ${closestString.name} DOWN (loosen the string)`;
      default:
        return "";
    }
  };

  const getTuningColor = () => {
    switch (tuningDirection) {
      case "in-tune":
        return "text-green-500";
      case "up":
        return "text-blue-500";
      case "down":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Guitar className="mr-2 h-4 w-4" />
          Tuner
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Guitar Tuner</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {error && (
            <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950 p-3 rounded-md">
              {error}
            </div>
          )}
          
          <div className="text-center">
            <Button
              onClick={isListening ? stopListening : startListening}
              className={`w-full ${isListening ? 'bg-red-600 hover:bg-red-700' : ''}`}
            >
              {isListening ? (
                <>
                  <MicOff className="mr-2 h-4 w-4" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  Start Listening
                </>
              )}
            </Button>
          </div>

          {isListening && (
            <div className="space-y-4">
              {/* Volume indicator */}
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">Volume</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-100" 
                    style={{ width: `${Math.min(volume * 1000, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Frequency display */}
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">Detected Frequency</div>
                <div className="text-3xl font-bold font-mono">
                  {currentFrequency ? `${currentFrequency.toFixed(1)} Hz` : "---"}
                </div>
              </div>

              {/* Closest string and tuning direction */}
              {closestString && (
                <div className="text-center space-y-2">
                  <div className={`text-4xl font-bold ${closestString.color}`}>
                    {closestString.note}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {closestString.name}
                  </div>
                  <div className={`text-lg font-medium ${getTuningColor()}`}>
                    {getTuningInstruction()}
                  </div>
                </div>
              )}

              {/* All strings with highlighting */}
              <div className="space-y-2">
                <div className="text-sm font-medium">All Strings:</div>
                <div className="grid grid-cols-2 gap-2">
                  {GUITAR_STRINGS.map((string) => {
                    const isActive = closestString?.name === string.name;
                    const isInTune = isActive && tuningDirection === "in-tune";
                    
                    return (
                      <div
                        key={string.name}
                        className={`p-3 rounded border text-sm transition-all duration-200 ${
                          isActive 
                            ? isInTune
                              ? "border-green-500 bg-green-50 dark:bg-green-950"
                              : "border-blue-500 bg-blue-50 dark:bg-blue-950"
                            : "border-border"
                        }`}
                      >
                        <div className={`font-medium ${string.color}`}>
                          {string.note} ({string.frequency} Hz)
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {string.name}
                        </div>
                        {isActive && (
                          <div className={`text-xs font-medium mt-1 ${getTuningColor()}`}>
                            {tuningDirection === "in-tune" ? "✓ In tune" : 
                             tuningDirection === "up" ? "↑ Tune up" : "↓ Tune down"}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground text-center">
            <p>Make sure your guitar is close to the microphone for best results.</p>
            <p>Play each string individually to tune it.</p>
            <p>Green highlight = in tune, Blue highlight = detected string</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
