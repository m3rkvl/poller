import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { UserAuth } from "../context/auth/AuthContext";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Card from "../components/ui/Card";
import DescIcon from "../components/ui/DescIcon";
import generateMakeAChoice from "../util/generateMakeAChoice";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

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

const PollVotePage = () => {
  const navigate = useNavigate();
  const { user, userData, createVote, createUserVote } = UserAuth();
  const { pollId } = useParams();

  //prettier-ignore
  const [pollData, setPollData] = useState<any>(null);
  const [userRedirect, setUserRedirect] = useState("");
  const [sessionRedirect, setSessionRedirect] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [disabled, setDisabled] = useState(false);

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
    if (pollData?.endsAt > Date.now()) {
      if (pollData?.settings.voteRestriction === "user") {
        if (
          user &&
          userData?.voted.some((vote: any) => vote.id === pollData?.id)
        )
          setUserRedirect((prev) => "results");
        if (!user) setUserRedirect((prev) => "login");
      } else {
        setUserRedirect("");
      }

      if (pollData?.settings.voteRestriction === "session") {
        if (localStorage.getItem(`${pollData?.id}`))
          setSessionRedirect("results");
      } else {
        setSessionRedirect("");
      }
    } else if (pollData?.endsAt <= Date.now()) {
      setSessionRedirect("results");
    }
  }, [pollData, user, userData]);

  const makeAChoice = generateMakeAChoice(
    pollData?.settings.optionRestriction,
    pollData?.settings.range.from,
    pollData?.settings.range.to
  );

  const inputType =
    pollData?.settings.range.from === 1 && pollData?.settings.range.from === 1
      ? "radio"
      : "checkbox";

  const handleSelected = (i: number, isMax: boolean) => {
    console.log(pollData?.settings.range.from);

    if (selected.includes(i)) {
      setSelected((prev) =>
        prev.filter((el) => el !== i).sort((a, b) => a - b)
      );
    }
    if (!selected.includes(i) && isMax) {
      setSelected((prev) => {
        const newArr = prev.filter((el, i) => i !== prev.length - 1);
        return [...newArr, i].sort((a, b) => a - b);
      });
    }
    if (!selected.includes(i) && !isMax) {
      setSelected((prev) => [...prev, i].sort((a, b) => a - b));
    }
  };

  const handleVoteSubmit = async (e: any) => {
    e.preventDefault();

    if (selected.length < pollData?.settings.range.from) return;

    const optionsObj = pollData?.options.map((op: any, i: number) => {
      if (selected.includes(i)) {
        return { option: op.option, voteCount: op.voteCount + 1 };
      }
      if (!selected.includes(i)) {
        return op;
      }
    });

    const userVoteObj = {
      id: pollData.id,
      voteValues: selected,
      slug: pollData.slug,
      title: pollData.title,
      deleted: false,
      adminName: pollData.adminName,
      createdAt: pollData.createdAt,
      votedAt: Date.now(),
      endsAt: pollData.endsAt,
    };

    try {
      await createVote!(pollData?.slug, optionsObj);

      if (pollData?.settings.voteRestriction === "user") {
        await createUserVote!(userVoteObj);
      }

      if (pollData?.settings.voteRestriction === "session") {
        localStorage.setItem(`${pollData?.id}`, JSON.stringify(userVoteObj));
      }

      toast.success("Your vote is submitted!");
      navigate(`/poll/${pollData.slug}/results`);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  document.title = `Poller • ${
    pollData ? `Vote for "${pollData.title}"` : "Vote"
  }`;

  return (
    <div className="content">
      {!pollData && <LoadingSpinner />}
      {
        //prettier-ignore
        sessionRedirect === "results" && <Navigate to={`/poll/${pollId}/results`} replace={true}/>
      }
      {
        //prettier-ignore
        userRedirect === "results" && <Navigate to={`/poll/${pollId}/results`} replace={true}/>
      }
      {userRedirect === "login" && (
        <Navigate to={`/poll/${pollId}`} replace={true} />
      )}
      {pollData && userRedirect !== "login" && (
        <Card borderColor="blue" classes="flex flex-col gap-4 lg:w-full">
          <div className="flex flex-col items-start gap-1">
            <div className="flex w-full justify-between text-2xl font-semibold smb2:text-xl">
              <h1>{pollData.title}</h1>
            </div>
            <p className="flex w-full justify-between text-sm text-gray-500 smb2:text-xs">
              {`by ${pollData?.adminName || "a guest"}`} &#8226;{" "}
              {dayjs(pollData?.createdAt).fromNow()}
            </p>
          </div>
          {pollData?.description && (
            <p className="flex gap-2 italic text-gray-400 smb2:gap-1 smb2:text-xs">
              <DescIcon classes="text-blue-300 flex-shrink-0 w-5 h-5 smb2:w-4 smb2:h-4 -translate-y-[15%]" />
              "{pollData.description}"
            </p>
          )}
          <p className="flex text-gray-300 smb2:text-xs">
            {makeAChoice} <span className="ml-[2px] text-red-300">*</span>
            <span className="ml-1"> :</span>
          </p>
          <form
            onSubmit={(e) => handleVoteSubmit(e)}
            className="flex flex-col gap-1"
          >
            {pollData?.options.map((option: any, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  id={`${i}`}
                  type={inputType}
                  onChange={() =>
                    handleSelected(
                      i,
                      selected.length === pollData?.settings.range.to
                    )
                  }
                  checked={selected.includes(i)}
                  className="h-4 w-4 cursor-pointer rounded-full border-2 border-gray-800 bg-gray-700 text-blue-600 ring-offset-0 focus:border-blue-500 focus:ring-0 focus:ring-offset-0"
                />
                <label htmlFor={`${i}`} className="cursor-pointer smb2:text-sm">
                  {option.option}
                </label>
              </div>
            ))}
          </form>
          {pollData && (
            <p className="text-gray-400 smb2:text-xs">{`Voting ends ${dayjs(
              pollData?.endsAt
            ).fromNow()}.`}</p>
          )}
          <div className="flex gap-2">
            <button
              onClick={(e) => handleVoteSubmit(e)}
              type="submit"
              className="voteBtn"
              disabled={selected.length < pollData?.settings.range.from}
            >
              <span className="pointer-events-none relative z-10">
                {selected.length < pollData?.settings.range.from
                  ? makeAChoice
                  : "Vote"}
              </span>
            </button>
            <Link
              to={`/poll/${pollData?.slug}/results`}
              className="resultsBtn pointer-cursor"
            >
              <span className="relative z-10 cursor-pointer">See Results</span>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PollVotePage;
