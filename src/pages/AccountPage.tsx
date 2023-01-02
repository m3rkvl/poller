import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { UserAuth } from "../context/auth/AuthContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

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

const AccountPage = () => {
  const { userData } = UserAuth();

  const [showCreated, setShowCreated] = useState(true);
  const [showVoted, setShowVoted] = useState(false);

  const handleShowCreated = () => {
    setShowVoted(false);
    setShowCreated(true);
  };

  const handleShowVoted = () => {
    setShowCreated(false);
    setShowVoted(true);
  };

  document.title = `Poller • Polls You ${showCreated ? "Created" : "Voted In"}`;

  return (
    <Fragment>
      {!userData && <LoadingSpinner />}
      {userData && (
        <div className="content">
          <div className="mb-4 flex gap-4">
            <button
              onClick={handleShowCreated}
              className={
                showCreated ? "accountBtnCreatedActive" : "accountBtnCreated"
              }
            >
              <span className="pointer-events-none relative z-10">Created</span>
            </button>
            <button
              onClick={handleShowVoted}
              className={
                showVoted ? "accountBtnVotedActive" : "accountBtnVoted"
              }
            >
              <span className="pointer-events-none relative z-10">Voted</span>
            </button>
          </div>
          {showCreated && (
            <ul className="flex flex-col gap-4 lg:w-2/3 mdb:w-full">
              {userData?.created
                .sort((a: any, b: any) => b.createdAt - a.createdAt)
                .map((poll: any, i: number) => (
                  <li key={i}>
                    <Link
                      to={`/poll/${poll.slug}/admin`}
                      className="cursor-pointer"
                    >
                      <div className="relative w-full cursor-pointer overflow-hidden rounded-lg bg-gradient-to-r from-gray-800 to-gray-800 p-4 after:absolute after:inset-0 after:bg-gradient-to-tr after:from-purple-800 after:to-purple-600 after:opacity-0 after:transition-opacity after:duration-200 hover:after:opacity-10 smb2:p-2">
                        <div className="pointer-events-none relative z-10 flex flex-col items-start gap-1 ">
                          <div className="flex w-full justify-between text-xl font-semibold smb2:text-base">
                            <h1>{poll.title}</h1>
                          </div>
                          <p className="flex w-full justify-between text-sm text-gray-500 smb2:text-xs">
                            {`by ${poll?.adminName || "a guest"}`} &#8226;{" "}
                            Created {dayjs(poll?.createdAt).fromNow()}
                          </p>
                        </div>
                        <div className="pointer-events-none relative z-10 flex items-center justify-end gap-3 smb2:gap-1 ">
                          <p className="text-sm text-gray-500 smb2:text-xs">
                            {dayjs(poll.endsAt).fromNow(true)}{" "}
                            {poll.endsAt > Date.now() ? "left" : "ago"}
                          </p>
                          {poll.endsAt > Date.now() && (
                            <div className="flex h-full w-14 items-center justify-center rounded-lg bg-green-800 bg-opacity-25 px-2 py-1 text-sm text-green-500 smb2:text-xs">
                              &#8226; Live
                            </div>
                          )}
                          {poll.endsAt <= Date.now() && (
                            <div className="flex h-full w-14 items-center justify-center rounded-lg bg-red-800 bg-opacity-25 px-2 py-1 text-sm text-red-500">
                              &#8226; End
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
            </ul>
          )}
          {!showCreated && (
            <ul className="flex w-1/3 flex-col gap-4 lg:w-2/3 mdb:w-full">
              {userData?.voted
                .sort((a: any, b: any) => b.votedAt - a.votedAt)
                .map((poll: any, i: number) => (
                  <li key={i}>
                    <Link
                      to={`/poll/${poll.slug}`}
                      state={{ fromAccount: true, index: poll.id }}
                      className={`${
                        poll.deleted
                          ? "pointer-events-none select-none opacity-25"
                          : "cursor-pointer"
                      }`}
                    >
                      <div className="relative w-full cursor-pointer overflow-hidden rounded-lg bg-gradient-to-r from-gray-800 to-gray-800 p-4 after:absolute after:inset-0 after:bg-gradient-to-tr after:from-blue-800 after:to-blue-600 after:opacity-0 after:transition-opacity after:duration-200 hover:after:opacity-10">
                        <div className="pointer-events-none flex flex-col items-start gap-1 ">
                          <div className="flex w-full justify-between text-xl font-semibold smb2:text-base">
                            <h1>{poll.title}</h1>
                          </div>
                          <p className="flex w-full justify-between text-sm text-gray-500 smb2:text-xs">
                            {`by ${poll?.adminName || "a guest"}`} &#8226; Voted{" "}
                            {dayjs(poll?.votedAt).fromNow()}
                          </p>
                        </div>
                        <div className="pointer-events-none flex items-center justify-end gap-3 ">
                          <p className="text-sm text-gray-500 smb2:text-xs">
                            {dayjs(poll.endsAt).fromNow(true)}{" "}
                            {poll.endsAt > Date.now() ? "left" : "ago"}
                          </p>
                          {poll.endsAt > Date.now() && (
                            <div className="flex h-full w-14 items-center justify-center rounded-lg bg-green-800 bg-opacity-25 px-2 py-1 text-sm text-green-500 smb2:text-xs">
                              &#8226; Live
                            </div>
                          )}
                          {poll.endsAt <= Date.now() && (
                            <div className="flex h-full w-14 items-center justify-center rounded-lg bg-red-800 bg-opacity-25 px-2 py-1 text-sm text-red-500">
                              &#8226; End
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}
    </Fragment>
  );
};

export default AccountPage;
