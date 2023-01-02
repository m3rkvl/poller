type AppProps = {
  onLogOut: () => void;
};

const LogOutBtn = ({ onLogOut }: AppProps) => {
  return (
    <button onClick={onLogOut} className="btn logOutBtnGr">
      <span className="z-10 cursor-pointer">Log Out</span>
    </button>
  );
};

export default LogOutBtn;
