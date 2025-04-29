import { FC, useEffect, useState } from "react";

const DateTime: FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState({
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    time: new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime({
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      });
    }, 1000);

    return () => clearInterval(interval);
  });

  return (
    <div className="d-flex align-items-center">
      <span>{`${currentDateTime.date} ${currentDateTime.time}`}</span>
    </div>
  );
};

export default DateTime;
