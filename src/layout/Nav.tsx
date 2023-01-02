import HomeBtn from "../components/nav/HomeBtn";
import { UserAuth } from "../context/auth/AuthContext";
import LogInBtn from "../components/nav/LogInBtn";
import LogOutBtn from "../components/nav/LogOutBtn";
import UserLink from "../components/nav/UserLink";

const Nav = () => {
  const { googleSignIn, signOutUser, user } = UserAuth();

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn!();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser!();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <header>
      <nav className="flex w-full justify-between px-48 py-8 xl:px-16 mdb:px-8 xs:px-4">
        <HomeBtn />
        {user && (
          <div className="flex items-center justify-center gap-4 smb:gap-2">
            <UserLink userName={user.displayName} />
            <LogOutBtn onLogOut={handleSignOut} />
          </div>
        )}
        {!user && <LogInBtn onLogIn={handleGoogleSignIn} />}
      </nav>
    </header>
  );
};

export default Nav;
