type AppProp = {
  children?: React.ReactNode;
  borderColor?: string;
  classes?: string;
};

const Card = ({ children, borderColor = "none", classes }: AppProp) => {
  let borderClr;
  switch (borderColor) {
    case "red": {
      borderClr = "border-t-4 border-red-500";
      break;
    }
    case "purple": {
      borderClr = "border-t-4 border-purple-500";
      break;
    }
    case "teal": {
      borderClr = "border-t-4 border-teal-500";
      break;
    }
    case "blue": {
      borderClr = "border-t-4 border-blue-500";
      break;
    }
    case "admin": {
      borderClr =
        "relative after:absolute after:z-[-10] after:inset-0 after:bg-gradient-to-r after:from-teal-500 after:via-blue-500 after:to-purple-500 after:rounded-lg after:-translate-y-1";
      break;
    }
    default:
      "";
  }
  return (
    <section
      className={`w-1/2 rounded-lg ${borderClr} bg-gray-800 p-5 ${classes}`}
    >
      {children}
    </section>
  );
};

export default Card;
