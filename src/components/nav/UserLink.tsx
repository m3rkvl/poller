import { Link } from "react-router-dom";

type AppProps = {
  userName: string;
};

const UserLink = ({ userName }: AppProps) => {
  return (
    <Link to="/account" className="btn">
      <span className="z-10 cursor-pointer">{userName}</span>
    </Link>
  );
};

export default UserLink;
