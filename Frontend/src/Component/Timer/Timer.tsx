import { useEffect, useState } from "react";
import "./Timer.scss";

interface TimerProps {
  initialTime: number; // Time in seconds
  onTimeout: () => void;
}

const Timer: React.FC<TimerProps> = ({ initialTime, onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeout]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="timer">
      <p>Time Remaining: {formatTime(timeLeft)}</p>
    </div>
  );
};

export default Timer;