import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { UserAuth } from "../context/auth/AuthContext";
import { db } from "../firebase";
import { useLocation } from "react-router-dom";

const PollRouteDecider = () => {
  const { user, userData } = UserAuth();
  const { pollId } = useParams();

  //prettier-ignore
  const [pollData, setPollData] = useState<any>(null);
  const [userRedirect, setUserRedirect] = useState("");
  const [sessionRedirect, setSessionRedirect] = useState("");
  const [unlimitedRedirect, setUnlimitedRedirect] = useState("");
  const { state }: any = useLocation();
  const [fromAccount, setFromAccount] = useState(false);
  const [index, setIndex] = useState<any>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "polls", `${pollId}`), (doc) => {
      const data = doc.data();
      setPollData((prev: any) => data);

      return () => {
        unsub();
      };
    });
  }, []);

  useEffect(() => {
    if (pollData?.endsAt > Date.now()) {
      if (pollData?.settings.voteRestriction === "user") {
        //prettier-ignore
        if (user && userData?.voted.every((vote: any) => vote.id !== pollData?.id))
          setUserRedirect((prev) => "vote");
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
        if (!localStorage.getItem(`${pollData?.id}`))
          setSessionRedirect("vote");
      } else {
        setSessionRedirect("");
      }

      if (pollData?.settings.voteRestriction === "unlimited") {
        setUnlimitedRedirect("vote");
      } else {
        setUnlimitedRedirect("");
      }
    } else if (pollData?.endsAt <= Date.now()) {
      console.log(pollData?.endsAt);
      console.log(Date.now());
      setSessionRedirect("results");
    }
  }, [pollData, user, userData]);

  useEffect(() => {
    if (state?.fromAccount) {
      setFromAccount(true);
      setIndex(state.index);
      window.history.replaceState({}, document.title);
    }
  }, [state]);

  return (
    <div className="content">
      {!pollData && (
        <LoadingSpinner isResultsPage={fromAccount} index={index} />
      )}
      {
        //prettier-ignore
        unlimitedRedirect === "vote" && <Navigate to={`/poll/${pollId}/vote`} replace={true}/>
      }
      {
        //prettier-ignore
        sessionRedirect === "vote" && <Navigate to={`/poll/${pollId}/vote`} replace={true}/>
      }
      {
        //prettier-ignore
        sessionRedirect === "results" && <Navigate to={`/poll/${pollId}/results`} replace={true}/>
      }
      {
        //prettier-ignore
        userRedirect === "vote" && <Navigate to={`/poll/${pollId}/vote`} replace={true}/>
      }
      {
        //prettier-ignore
        userRedirect === "results" && <Navigate to={`/poll/${pollId}/results`} replace={true}/>
      }
      {userRedirect === "login" && <div>LOGIN BRUH</div>}
    </div>
  );
};

export default PollRouteDecider;

/*
     {
          //prettier-ignore
          unlimitedRedirect === "vote" && <Navigate to={`/poll/${pollId}/vote`} />
        }
        {
          //prettier-ignore
          sessionRedirect === "vote" && <Navigate to={`/poll/${pollId}/vote`} />
        }
        {
          //prettier-ignore
          sessionRedirect === "results" && <Navigate to={`/poll/${pollId}/results`} />
        }
        {
          //prettier-ignore
          userRedirect === "vote" && <Navigate to={`/poll/${pollId}/vote`} />
        }
        {
          //prettier-ignore
          userRedirect === "results" && <Navigate to={`/poll/${pollId}/results`} />
        }
        {userRedirect === "login" && <div>LOGIN BRUH</div>}

              {unlimitedRedirect === "vote" && <LoadingSpinner />}
        {sessionRedirect === "vote" && <LoadingSpinner />}
        {sessionRedirect === "results" && <LoadingSpinner />}
        {userRedirect === "vote" && <LoadingSpinner />}
        {userRedirect === "results" && <LoadingSpinner />}
        {userRedirect === "login" && <LoadingSpinner />}
*/
