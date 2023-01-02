import { useContext, createContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  UserInfo,
} from "firebase/auth";
import {
  doc,
  setDoc,
  arrayUnion,
  onSnapshot,
  DocumentData,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { toast } from "react-hot-toast";

type ctx = {
  user?: any;
  userData?: any;
  googleSignIn?: Function;
  signOutUser?: Function;
  createPoll?: Function;
  deletePoll?: Function;
  updatePoll?: Function;
  createUserPoll?: Function;
  deleteUserPoll?: Function;
  createVote?: Function;
  createUserVote?: Function;
  deleteUserVote?: Function;
};

type Props = {
  children: React.ReactNode;
};

const AuthContext = createContext<ctx>({});

export const AuthContextProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [userData, setUserData] = useState<any>(null);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        const userRef = doc(db, "users", `${user.uid}`);
        setDoc(
          userRef,
          { created: arrayUnion(), voted: arrayUnion() },
          { merge: true }
        );
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorMessage);
      });
  };

  const signOutUser = () => {
    signOut(auth);
  };

  const createPoll = async (poll: any) => {
    console.log("submitting...");
    const docSnap = await getDoc(doc(db, "polls", poll.slug));
    if (docSnap.exists()) {
      throw new Error("Slug is in use, try another one!");
    }
    await setDoc(doc(db, "polls", poll.slug), poll);
    toast.success("Created your poll!");
  };

  const deletePoll = async (pollSlug: string) => {
    await deleteDoc(doc(db, "polls", pollSlug));
  };

  const updatePoll = async (resultsRestriction: string, pollSlug: string) => {
    const dataPath = doc(db, "polls", `${pollSlug}`);
    await updateDoc(dataPath, {
      "settings.resultsRestriction": resultsRestriction,
    });
  };

  const createUserPoll = async (pollObj: any) => {
    const dataPath = doc(db, "users", `${user?.uid}`);
    await updateDoc(dataPath, { created: arrayUnion(pollObj) });
  };

  const deleteUserPoll = async (pollId: string) => {
    const dataPath = doc(db, "users", `${user?.uid}`);
    const finalArr = userData?.created.filter(
      (poll: any) => poll.id !== pollId
    );
    await updateDoc(dataPath, { created: finalArr });
  };

  const createVote = async (slug: string, optionsObj: any) => {
    const dataPath = doc(db, "polls", slug);
    await updateDoc(dataPath, { options: optionsObj });
  };

  const createUserVote = async (voteObj: any) => {
    const dataPath = doc(db, "users", `${user?.uid}`);
    await updateDoc(dataPath, { voted: arrayUnion(voteObj) });
  };

  const deleteUserVote = async (pollId: string) => {
    try {
      const dataPath = doc(db, "users", `${user?.uid}`);
      const finalArr = userData?.voted.filter(
        (poll: any) => poll.id !== pollId
      );
      await updateDoc(dataPath, { voted: finalArr });
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser?.uid) {
        setUser((prevUser) => currentUser);

        const unsub = onSnapshot(
          doc(db, "users", `${currentUser?.uid}`),
          (doc) => {
            const data = doc.data();
            setUserData(data);
          }
        );
      }
      if (!currentUser?.uid) {
        setUser((prevUser) => null);
        setUserData((prevUserData: any) => null);
      }

      return () => {
        unsubscribe();
      };
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        googleSignIn,
        signOutUser,
        createPoll,
        deletePoll,
        createUserPoll,
        deleteUserPoll,
        createVote,
        createUserVote,
        deleteUserVote,
        updatePoll,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};

/*
useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser?.uid) {
        setUser((prevUser) => currentUser);

        const unsub = onSnapshot(
          doc(db, "users", `${currentUser?.uid}`),
          (doc) => {
            setUserData((prevUserData) => doc.data());
            console.log("Current data: ", userData);
          }
        );
      }
      if (!currentUser?.uid) {
        setUser((prevUser) => null);
        setUserData((prevUserData) => null);
      }
      console.log(currentUser);

      return () => {
        unsubscribe();
      };
    });
  }, []);
*/
