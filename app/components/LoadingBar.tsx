import { useEffect, useState } from "react";

const LoadingBar = ({ loading }: { loading: boolean }) => {
  const [progressLoader, setProgressLoader] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let elapsedTime = 0;
    const duration = 5000; // 5 seconds to 90%
    const incrementTime = 50; // updating every 50ms

    if (loading) {
      interval = setInterval(() => {
        elapsedTime += incrementTime;

        // For the first 5 seconds, apply the accelerating progress until 98%
        if (elapsedTime <= duration) {
          const fraction = elapsedTime / duration;
          const progress = 98 * fraction ** 2;
          setProgressLoader(progress);
        }
        // After 5 seconds, increment the next 5% slowly over 10 seconds
        else if (elapsedTime > duration && elapsedTime <= duration + 10000) {
          const increment = 0.005; // 5% over 10 seconds, so 0.5% per second
          setProgressLoader((prevProgress) => prevProgress + increment);
          if (progressLoader + increment >= 95) {
            clearInterval(interval);
          }
        } else {
          clearInterval(interval);
        }
      }, incrementTime);
    } else {
      setProgressLoader(0); // Reset state to 0 when loading is done
    }

    return () => {
      clearInterval(interval);
    };
  }, [loading]);

  if (!loading) return <></>;

  return (
    <div className="relative ml-3 flex w-[90%] flex-col items-center">
      <div className="relative h-6 w-[100%] overflow-hidden rounded-full bg-gray-300">
        <div
          className="absolute h-full rounded-full bg-purple-600 transition-all duration-200"
          style={{ width: `${progressLoader}%` }}
        >
          <div className="flex h-full w-full items-center justify-center font-bold text-white">
            {Math.floor(progressLoader)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingBar;
