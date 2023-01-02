import { useState } from "react";
import GoogleIcon from "../../assets/GoogleIcon";

type AppProps = {
  onLogIn: () => void;
};

const LogInBtn = ({ onLogIn }: AppProps) => {
  return (
    <button onClick={onLogIn} className="btn logInBtnGr">
      <span className="z-10 cursor-pointer">Log In With</span>
      <GoogleIcon />
    </button>
  );
};

export default LogInBtn;
