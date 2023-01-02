import { Link } from "react-router-dom";
import LogoWhite from "../../assets/logo-white-2-shdw.png";

const HomeBtn = () => {
  return (
    <Link to="/">
      <img src={LogoWhite} className="w-32 cursor-pointer xs:w-24" />
    </Link>
  );
};

export default HomeBtn;
