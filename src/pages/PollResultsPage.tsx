import { doc, onSnapshot } from "firebase/firestore";
import { Fragment, useEffect, useState } from "react";

import { toast } from "react-hot-toast";
import { Navigate, useParams } from "react-router";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { UserAuth } from "../context/auth/AuthContext";
import { db } from "../firebase";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Card from "../components/ui/Card";
import useCopyToClipboard from "../util/useCopyToClipboard";
import VoteToSee from "./VoteToSee";
import ShareCard from "../components/ShareCard";

const bgColors = [
  "#3b82f6",
  "#14b8a6",
  "#a855f7",
  "#ef4444",
  "rgba(59, 130, 246, .66)",
  "rgba(20, 184, 166, .66)",
  "rgba(168, 85, 247, .66)",
  "rgba(239, 68, 68, .66)",
  "rgba(59, 130, 246, .33)",
  "rgba(20, 184, 166, .33)",
  "rgba(168, 85, 247, .33)",
  "rgba(239, 68, 68, .33)",
];

const config = {
  thresholds: [
    { l: "s", r: 1 },
    { l: "m", r: 1 },
    { l: "mm", r: 59, d: "minute" },
    { l: "h", r: 1 },
    { l: "hh", r: 23, d: "hour" },
    { l: "d", r: 1 },
    { l: "dd", r: 29, d: "day" },
    { l: "M", r: 1 },
    { l: "MM", r: 11, d: "month" },
    { l: "y" },
    { l: "yy", d: "year" },
  ],
};
dayjs.extend(relativeTime, config);

const generatePercentage = (num: number, total: number) => {
  return Math.floor((num / total) * 100) || "0";
};

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

const PollResultsPage = () => {
  const { user, userData } = UserAuth();
  const { pollId } = useParams();
  const [value, copy] = useCopyToClipboard();

  //prettier-ignore
  const [pollData, setPollData] = useState<any>(null);
  const [showResults, setShowResults] = useState("");
  const [adminPassType, setAdminPassType] = useState("password");
  const [adminPass, setAdminPass] = useState("");
  const [totalVotes, setTotalVotes] = useState(0);
  const [values, setValues] = useState<any>();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "polls", `${pollId}`), (doc) => {
      const data = doc.data();
      setPollData(data);

      return () => {
        unsub();
      };
    });
  }, []);

  useEffect(() => {
    if (pollData?.settings.resultsRestriction === "public") {
      setShowResults("show");

      if (pollData?.settings.voteRestriction === "user") {
        //prettier-ignore
        if (user && userData?.voted.some((vote: any) => vote.id === pollData?.id)) {
          //prettier-ignore
          const userVote = userData?.voted.filter((vote: any) => vote.id === pollData?.id)[0];
          setValues((prev: any) => userVote.voteValues);
        }
      }

      if (pollData?.settings.voteRestriction === "session") {
        //prettier-ignore
        if (localStorage.getItem(`${pollData?.id}`)) {
          const userVote = JSON.parse(localStorage.getItem(`${pollData?.id}`) || "");
          //prettier-ignore
          setValues((prev: any) => userVote.voteValues);
        }
      }
    }

    if (pollData?.settings.resultsRestriction === "publicAfterVote") {
      if (pollData?.settings.voteRestriction === "user") {
        //prettier-ignore
        if (user && userData?.voted.every((vote: any) => vote.id !== pollData?.id))
          setShowResults("vote");
        //prettier-ignore
        if (user && userData?.voted.some((vote: any) => vote.id === pollData?.id)) {
          const userVote = userData?.voted.filter((vote: any) => vote.id === pollData?.id)[0];
          setValues((prev: any) => userVote.voteValues);
          setShowResults("show");
        }
        if (!user) setShowResults("login");
      }

      if (pollData?.settings.voteRestriction === "session") {
        if (localStorage.getItem(`${pollData?.id}`)) {
          //prettier-ignore
          const userVote = JSON.parse(localStorage.getItem(`${pollData?.id}`) || "");
          //prettier-ignore
          setValues((prev: any) => userVote.voteValues);
          setShowResults("show");
        }
        if (!localStorage.getItem(`${pollData?.id}`)) setShowResults("vote");
      }
    }

    if (pollData?.settings.resultsRestriction === "publicAfterEnd") {
      if (pollData?.endsAt > Date.now()) setShowResults("countdown");

      if (pollData?.endsAt <= Date.now()) {
        if (pollData?.settings.voteRestriction === "session") {
          if (localStorage.getItem(`${pollData?.id}`)) {
            //prettier-ignore
            const userVote = JSON.parse(localStorage.getItem(`${pollData?.id}`) || "");
            //prettier-ignore
            setValues((prev: any) => userVote.voteValues);
            setShowResults("show");
          }
          if (!localStorage.getItem(`${pollData?.id}`)) setShowResults("vote");
        }

        if (pollData?.settings.voteRestriction === "user") {
          //prettier-ignore
          if (user && userData?.voted.every((vote: any) => vote.id !== pollData?.id))
            setShowResults("vote");
          //prettier-ignore
          if (user && userData?.voted.some((vote: any) => vote.id === pollData?.id)) {
            const userVote = userData?.voted.filter((vote: any) => vote.id === pollData?.id)[0];
            setValues((prev: any) => userVote.voteValues);
            setShowResults("show");
          }
          if (!user) setShowResults("login");
        }

        setShowResults("show");
      }
    }

    if (pollData?.settings.resultsRestriction === "private") {
      if (user && user.uid === pollData?.admin) setShowResults("show");
      if (user && user.uid !== pollData?.admin) setShowResults("password");
      if (!user) setShowResults("password");
    }
  }, [pollData, user, userData]);

  useEffect(() => {
    setTotalVotes((prev) =>
      pollData?.options.reduce((acc: any, curr: any) => acc + curr.voteCount, 0)
    );
  }, [pollData]);

  const handleAdminPass = () => {
    if (adminPass === pollData.adminPass) {
      setShowResults("show");
      toast.success("Showing results");
    }

    if (adminPass !== pollData.adminPass) {
      toast.error("Wrong password");
    }
  };

  document.title = `Poller • ${
    pollData ? `Results for "${pollData.title}"` : "Results"
  }`;

  return (
    <div className="content">
      {!pollData && <LoadingSpinner />}
      {
        //prettier-ignore
        showResults === "vote" && <VoteToSee redirectLink={`/poll/${pollData?.slug}/vote`}/>
      }
      {showResults === "countdown" && (
        <h1 className="text-2xl font-semibold">
          You can see the results{" "}
          <span className="text-purple-500">
            {" "}
            {dayjs(pollData?.endsAt).fromNow()}
          </span>
          ...
        </h1>
      )}
      {showResults === "password" && (
        <div className="flex w-1/3 flex-col items-center gap-4">
          <h1 className="mb-4 text-3xl font-semibold">
            Enter your admin password.
          </h1>
          <input
            type={adminPassType}
            className="inputAdminPass"
            placeholder="Admin Password"
            onChange={(e: any) => setAdminPass((prev) => e.target.value)}
          />
          <div className="flex gap-4">
            <button className="adminPassSubmitBtn" onClick={handleAdminPass}>
              <span className="pointer-events-none relative z-10">Submit</span>
            </button>
            <button
              className="adminPassShowBtn"
              onClick={() =>
                setAdminPassType((prev) =>
                  prev === "password" ? "text" : "password"
                )
              }
            >
              <span className="pointer-events-none relative z-10">
                Show Password
              </span>
            </button>
          </div>
        </div>
      )}
      {pollData && showResults === "show" && (
        <Fragment>
          <Card
            borderColor="purple"
            classes="w-full flex flex-col gap-4 lg:w-full"
          >
            <div className="flex flex-col items-start gap-1">
              <div className="flex w-full justify-between text-2xl font-semibold ">
                <h1>{pollData.title}</h1>
              </div>
              <p className="flex w-full justify-between text-sm text-gray-500">
                {`by ${pollData?.adminName || "a guest"}`} &#8226;{" "}
                {dayjs(pollData?.createdAt).fromNow()}
              </p>
            </div>
            <ul className="mb-4 flex w-full flex-col gap-4">
              {pollData.options
                ?.sort((a: any, b: any) => b.voteCount - a.voteCount)
                .map((option: any, i: number) => {
                  return (
                    <li key={i}>
                      <div className="mb-1 flex items-center justify-between smb2:text-sm xs:text-xs">
                        <h2>{option.option}</h2>
                        <div className="flex gap-1">
                          <p className="flex-shrink-0 text-gray-400">{`${generatePercentage(
                            option.voteCount,
                            totalVotes
                          )}%`}</p>
                          <span className="text-gray-200">
                            <span className="text-gray-400">{"("}</span>
                            {`${option.voteCount}`}
                            <span className="text-gray-400">{")"}</span>
                          </span>
                        </div>
                      </div>
                      <div>
                        <div
                          className={`relative h-3 overflow-hidden rounded-md bg-gradient-to-tr from-gray-600 to-gray-600`}
                        >
                          <div
                            className={`absolute left-0 top-0 bottom-0 block rounded-md opacity-100 transition-all duration-200`}
                            style={{
                              width: `${generatePercentage(
                                option.voteCount,
                                totalVotes
                              )}%`,
                              background: `${bgColors[i]}`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ul>
            <div
              className={`flex w-full items-start ${
                values ? "justify-between" : "justify-end"
              } border-t border-gray-600 pt-4 pb-2`}
            >
              {values && (
                <p>
                  <span className="italic text-gray-400">You voted:</span>{" "}
                  {values
                    .map((v: any) => pollData?.options[v].option)
                    .reduce((acc: any, el: any, i: any) => {
                      return acc === null
                        ? [el]
                        : [
                            ...acc,
                            <span
                              key={i}
                              className="text-extrabold text-purple-500"
                            >{` | `}</span>,
                            el,
                          ];
                    }, null)}
                </p>
              )}
              <p className="ml-4 shrink-0 text-gray-400">
                Total Votes: {totalVotes}
              </p>
            </div>
            <p className="-mt-4 w-full text-right text-gray-300">{`Voting ${
              pollData?.endsAt > Date.now() ? "ends" : "ended"
            }  ${dayjs(pollData?.endsAt).fromNow()}.`}</p>
          </Card>
          <ShareCard
            url={`https://poller.host/poll/${pollData?.slug}`}
            classes=""
          />
        </Fragment>
      )}
    </div>
  );
};

export default PollResultsPage;
