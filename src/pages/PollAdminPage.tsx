import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Fragment, Key, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router";
import { UserAuth } from "../context/auth/AuthContext";
import Card from "../components/ui/Card";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import useCopyToClipboard from "../util/useCopyToClipboard";
import { Link } from "react-router-dom";
import ShareCard from "../components/ShareCard";

const PollAdminPage = () => {
  const { user, userData, deletePoll, deleteUserPoll, updatePoll } = UserAuth();
  const { pollId } = useParams();
  const { state }: any = useLocation();
  const navigate = useNavigate();
  const [value, copy] = useCopyToClipboard();

  const [pollData, setPollData] = useState<any>(null);
  const [showResults, setShowResults] = useState("");
  const [adminPassType, setAdminPassType] = useState("password");
  const [adminPass, setAdminPass] = useState("");
  const [resultsRestriction, setResultsRestriction] = useState("public");

  const linkRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);

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
    if (!state) {
      if (user && user.uid === pollData?.admin) setShowResults("show");
      if (user && user.uid !== pollData?.admin) setShowResults("password");
      if (!user) setShowResults("password");
    }
    if (state) {
      setShowResults("show");
      window.history.replaceState({}, document.title);
    }
    setResultsRestriction(pollData?.settings.resultsRestriction);
  }, [pollData, user, userData]);

  const handleAdminPass = () => {
    if (adminPass === pollData.adminPass) {
      setShowResults("show");
      toast.success("Showing admin panel");
    }

    if (adminPass !== pollData.adminPass) {
      toast.error("Wrong password");
    }
  };

  const handleDeletePoll = async () => {
    try {
      await deletePoll!(pollData?.slug);
      await deleteUserPoll!(pollData?.id);
      toast.success("Poll deleted.");
      navigate("/", { replace: true });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleUpdatePoll = async () => {
    try {
      await updatePoll!(resultsRestriction, pollData?.slug);
      toast.success("Updated your poll!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleResultsRestrictionChange = (value: string) => {
    setResultsRestriction(value);
  };

  document.title = `Poller • Admin Panel${
    pollData ? ` for "${pollData.title}"` : ""
  }`;

  return (
    <Fragment>
      {!pollData && <LoadingSpinner />}
      {pollData && showResults === "password" && (
        <div className="content">
          <Card
            borderColor="admin"
            classes="flex items-center justify-center lg:w-full"
          >
            <div className="flex flex-col items-center gap-4">
              <h1 className="mb-4 text-3xl font-semibold slg:mb-1 slg:text-xl xs:text-lg">
                Enter your admin password.
              </h1>
              <input
                type={adminPassType}
                className="inputAdminPass"
                placeholder="Admin Password"
                onChange={(e: any) => setAdminPass((prev) => e.target.value)}
              />
              <div className="flex gap-4">
                <button
                  className="adminPassSubmitBtn"
                  onClick={handleAdminPass}
                >
                  <span className="pointer-events-none relative z-10">
                    Submit
                  </span>
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
          </Card>
        </div>
      )}
      {pollData && showResults === "show" && (
        <div className="content">
          <Card borderColor="admin" classes="flex flex-col gap-2 xl:w-full">
            <div className="flex flex-col gap-1 self-center">
              <h2 className="font-semibol mb-2 self-center text-3xl smb:text-xl">
                Your{" "}
                <span className="bg-gradient-to-tr from-teal-500 via-blue-500 to-purple-500 bg-clip-text font-bold text-transparent">
                  admin
                </span>{" "}
                password:
              </h2>
              <input
                ref={passRef}
                value={pollData?.adminPass}
                readOnly
                onClick={() => {
                  passRef.current!.select();
                  copy(pollData?.adminPass);
                  toast.success("Admin password copied.");
                }}
                className="relative mb-2 w-20 cursor-pointer self-center overflow-hidden rounded-lg border border-gray-500 bg-gradient-to-tr from-gray-700 to-gray-600 py-1 text-center transition-all duration-200 after:absolute after:inset-0 after:bg-gradient-to-tr after:from-gray-900 after:to-gray-900 after:opacity-0  after:transition-opacity after:duration-200 hover:border-gray-400 hover:text-gray-400 hover:after:opacity-25"
              />
            </div>
            <div className="mb-4 w-2/3 self-center border-b border-gray-700 pb-8 text-center text-gray-300 mdb:text-sm smb:w-full smb:text-xs">
              <p className="mb-4 rounded-lg bg-red-500 bg-opacity-10 py-1 px-2 font-semibold italic text-red-500 ">
                If you lose it, you'll lose your admin rights to this poll.
              </p>
              <p className="mb-1">
                Because you will need it to access the admin panel of this poll.
                Click on the button to{" "}
                <span className="font-semibold text-teal-400">copy</span> it,
                and <span className="font-semibold text-blue-400">save</span> it
                somewhere.{" "}
              </p>
              <p>
                If you were{" "}
                <span className="font-semibold text-purple-400">signed in</span>{" "}
                while creating the poll, you can see the admin panel without the
                password while signed in.
              </p>
            </div>

            <div className="mb-6 flex flex-col gap-1 self-center border-b border-gray-700 pb-8 ">
              <h2 className="font-semibol mb-2 self-center text-xl smb:text-xl">
                The{" "}
                <span className="bg-gradient-to-tr from-teal-500 via-blue-500 bg-clip-text font-bold text-transparent">
                  link
                </span>{" "}
                of your poll:
              </h2>
              <input
                ref={linkRef}
                value={`https://poller.host/poll/${pollData?.slug}/admin`}
                readOnly
                onClick={() => {
                  linkRef.current!.select();
                  copy(`https://poller.host/poll/${pollData?.slug}/admin`);
                  toast.success("Poll link copied.");
                }}
                className="relative mb-2 w-[30rem] cursor-pointer self-center overflow-hidden rounded-lg border border-gray-500 bg-gradient-to-tr from-gray-700 to-gray-600 py-1 text-center transition-all duration-200 after:absolute after:inset-0 after:bg-gradient-to-tr after:from-gray-900 after:to-gray-900 after:opacity-0  after:transition-opacity after:duration-200 hover:border-gray-400 hover:text-gray-400 hover:after:opacity-25 mdb:w-[24rem] smb:text-xs smb2:w-[18rem] xs:w-[14rem]"
              />
            </div>
            <div className="mb-8 flex flex-col items-center self-center border-b border-gray-700 pb-8">
              <label className="mb-1 text-sm font-semibold text-gray-300">
                Results Visibility
              </label>
              <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
                <button
                  className={`selectionBtn ${
                    resultsRestriction === "public" ? "selectionBtnActive" : ""
                  }`}
                  type="button"
                  onClick={() => {
                    handleResultsRestrictionChange("public");
                  }}
                >
                  Always Public
                </button>
                <button
                  className={`selectionBtn ${
                    resultsRestriction === "publicAfterEnd"
                      ? "selectionBtnActive"
                      : ""
                  }`}
                  type="button"
                  onClick={() => {
                    handleResultsRestrictionChange("publicAfterEnd");
                  }}
                >
                  Public After Poll Ends
                </button>
                <button
                  className={`selectionBtn ${
                    resultsRestriction === "publicAfterVote"
                      ? "selectionBtnActive"
                      : ""
                  }`}
                  type="button"
                  onClick={() => {
                    handleResultsRestrictionChange("publicAfterVote");
                  }}
                >
                  Public After Voting
                </button>
                <button
                  className={`selectionBtn ${
                    resultsRestriction === "private" ? "selectionBtnActive" : ""
                  }`}
                  type="button"
                  onClick={() => {
                    handleResultsRestrictionChange("private");
                  }}
                >
                  Private
                </button>
              </div>
              <button
                onClick={() => handleUpdatePoll()}
                className="editBtnAdmin w-2/3 text-center"
              >
                <span className="relative z-10 cursor-pointer">Change</span>
              </button>
            </div>
            <div className="flex gap-4 self-center">
              <Link
                to={`/poll/${pollData?.slug}/vote`}
                className="voteLinkAdmin"
              >
                <span className="relative z-10 cursor-pointer">Vote</span>
              </Link>
              <Link
                to={`/poll/${pollData?.slug}/results`}
                className="resultsLinkAdmin"
              >
                <span className="relative z-10 cursor-pointer">
                  See Results
                </span>
              </Link>
              <button className="deleteBtnAdmin" onClick={handleDeletePoll}>
                <span className="relative z-10 cursor-pointer">Delete</span>
              </button>
            </div>
          </Card>
          <ShareCard
            url={`https://poller.host/poll/${pollData?.slug}`}
            classes=""
          />
        </div>
      )}
    </Fragment>
  );
};

export default PollAdminPage;
