import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

type props = {
  redirectLink: string;
};

const VoteToSee = ({ redirectLink }: props) => {
  const [count, setCount] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      navigate(redirectLink, { replace: true });
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="content">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-semibold">
          You need to vote to see the results of this poll.
        </h1>
        <p className="italic text-gray-400">
          You are being directed to voting in {count}...
        </p>
      </div>
    </div>
  );
};

export default VoteToSee;
