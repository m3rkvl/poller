import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import loadingBg from "../../assets/loadingBackground.png";
import loadingLogo from "../../assets/loadingLogo.png";
import { UserAuth } from "../../context/auth/AuthContext";

type loadingProps = {
  isResultsPage?: boolean;
  index?: number | null;
};

const LoadingSpinner = ({
  isResultsPage = false,
  index = null,
}: loadingProps) => {
  const { deleteUserVote } = UserAuth();
  const [warning, setWarning] = useState(false);
  const [count, setCount] = useState(10);
  const navigate = useNavigate();

  document.title = `Poller • Loading...`;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setWarning(true);
      document.title = `Poller • Something Went Wrong...`;
      if (isResultsPage) {
        deleteUserVote!(index);
      }
    }, 5000);

    const interval = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    const timeout2 = setTimeout(() => {
      navigate("/");
    }, 10000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
      clearTimeout(timeout2);
    };
  }, [isResultsPage]);

  return (
    <div className="relative mb-8 -mt-8 grid h-[32rem] w-full grid-cols-1 grid-rows-1 content-center justify-items-center">
      {warning && (
        <h1 className="relative z-10 col-start-1 col-end-1 row-start-1 row-end-1 block self-center text-3xl font-bold opacity-100 drop-shadow-md lg:text-xl smb2:text-base xs:text-sm">
          {`Seems like this is taking too long... Redirecting you in ${count}`}
        </h1>
      )}
      <img
        src={loadingBg}
        className="col-start-1 col-end-1 row-start-1 row-end-1 block animate-spin-slow-r self-center opacity-25"
        alt="Background Gradient"
      />
      <img
        src={loadingLogo}
        className="col-start-1 col-end-1 row-start-1 row-end-1 block animate-spin-slow self-center rounded-full opacity-50 backdrop-blur-sm"
        alt="Loading Logo"
      />
    </div>
  );
};

export default LoadingSpinner;
