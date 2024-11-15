"use client";
import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Countdown() {
  const [duration, setDuration] = useState<number | string>("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSetDuration = (): void => {
    if (typeof duration === "number" && duration > 0) {
      setTimeLeft(duration);
      setIsActive(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleStart = (): void => {
    if (timeLeft > 0) {
      setIsActive(true);
      setIsPaused(false);
    }
  };

  const handlePause = (): void => {
    if (isActive) {
      setIsPaused(true);
      setIsActive(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleReset = (): void => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(typeof duration === "number" ? duration : 0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, isPaused]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setDuration(Number(e.target.value) || "");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <div className="bg-gradient-to-r from-blue-300 to-purple-300 dark:bg-gray-800 shadow-xl rounded-xl p-8 w-full max-w-md md:max-w-lg">
        <h1 className="text-3xl font-serif font-bold mb-6 text-gray-900 dark:text-white text-center">
          Countdown Timer
        </h1>
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <Input
            type="number"
            id="duration"
            placeholder="Enter duration in seconds"
            value={duration}
            onChange={handleDurationChange}
            className="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 shadow-sm"
          />
          <Button
            onClick={handleSetDuration}
            variant="outline"
            className="w-full sm:w-auto text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Set
          </Button>
        </div>
        <div className="text-6xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
          {formatTime(timeLeft)}
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            onClick={handleStart}
            variant="outline"
            className="w-full sm:w-auto text-black bg-pink-300 hover:bg-pink-500 px-6 py-2 rounded-md"
          >
            {isPaused ? "Resume" : "Start"}
          </Button>
          <Button
            onClick={handlePause}
            variant="outline"
            className="w-full sm:w-auto text-black bg-yellow-300 hover:bg-yellow-500 px-6 py-2 rounded-md"
          >
            Pause
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="w-full sm:w-auto text-black bg-red-300 hover:bg-red-500 px-6 py-2 rounded-md"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
