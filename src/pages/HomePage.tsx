import { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import Ab from "../assets/Ab.png";
import so from "../assets/so.png";
import lute from "../assets/lute.png";
import ly from "../assets/ly.png";
import no from "../assets/no.png";
import single from "../assets/single.png";
import person from "../assets/person.png";
import yet from "../assets/yet.png";

const HomePage = () => {
  const [second, setSecond] = useState(0);

  document.title = `Poller • Fast. Easy. Free.`;

  useEffect(() => {
    const interval = setInterval(() => {
      setSecond((prev) => {
        if (prev === 2) return 0;
        return prev + 1;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Fragment>
      <section className="content">
        <h1 className="select-none text-9xl font-extrabold lg:text-8xl mdb:text-7xl smb:text-5xl xs:text-3xl">
          {/* prettier-ignore */}
          <span className={`fastTxt ${second === 0 ? "after:opacity-100" : "after:opacity-0"}`}>Fast.</span>
          {/* prettier-ignore */}
          <span className={`easyTxt ${second === 1 ? "after:opacity-100" : "after:opacity-0"}`}>Easy.</span>
          {/* prettier-ignore */}
          <span className={`freeTxt ${second === 2 ? "after:opacity-100" : "after:opacity-0"}`}>Free.</span>
        </h1>
        <p className="mt-16 flex flex-col items-center justify-center gap-1 text-2xl text-gray-400 lg:text-xl mdb:mt-8 mdb:text-base smb:text-sm xs:text-xs">
          <span className="text-center">
            Have a question in mind and looking for a place to ask it in and get
            answers quickly?
          </span>{" "}
          <span className="flex flex-wrap items-center justify-center gap-1">
            <span className="text-gray-100">Poller</span> let's you create polls
            <span className="text-teal-400">fast</span> and
            <span className="mr-[-3px]  text-blue-400">easy</span>. And it's
            <span className="ml-1 -rotate-[1.5deg] text-red-500 ">
              absolutely free!
            </span>
          </span>
        </p>
        <div className="mt-12 flex items-center justify-center gap-8 text-xl smb2:gap-4">
          {/* prettier-ignore */}
          <Link to="/poll/create" className={`group heroPrimaryLink0 ${second === 0 ? "" : second === 1 ? "before:opacity-100" : second === 2 ? "after:opacity-100" : ""}`}>
          <span className="z-40 cursor-pointer">Create a Poll</span>
            <div className="absolute top-0 bottom-0 -left-[.5px] -right-[1px] bg-gray-900 scale-[97%] z-30 rounded-[.6rem] opacity-100 group-hover:opacity-0 transition-opacity duration-200 cursor-pointer"/>
        </Link>
          {/* prettier-ignore */}
          <Link to="/poll/goat_basketball_player" className="cursor-pointer text-lg p-2 text-gray-400 transition-all duration-200 hover:text-gray-200 hover:underline smb2:text-sm">
          View a Demo
        </Link>
        </div>
        <h3 className="mt-16 select-none text-base font-semibold tracking-widest text-gray-500 mdb:mt-12 mdb:text-sm smb2:hidden">
          TRUSTED AND USED BY
        </h3>
        <div className="mt-6 flex select-none gap-20 brightness-75 lg:gap-16 mdb:gap-14 smb:gap-8 smb2:hidden">
          <img
            src={Ab}
            draggable="false"
            className="h-14 select-none lg:h-10 mdb:h-8"
          />
          <img
            src={so}
            draggable="false"
            className="h-14 select-none lg:h-10 mdb:h-8"
          />
          <img
            src={lute}
            draggable="false"
            className="h-14 select-none lg:h-10 mdb:h-8"
          />
          <img
            src={ly}
            draggable="false"
            className="h-14 select-none lg:h-10 mdb:h-8"
          />
        </div>
        <div className="mt-8 flex select-none items-end gap-20 pb-16 brightness-75 lg:gap-16 mdb:gap-14 mdb:pb-4 smb:gap-8 smb2:hidden ">
          <img
            src={no}
            draggable="false"
            className="h-14 select-none lg:h-10 mdb:h-8"
          />
          <img
            src={single}
            draggable="false"
            className="h-14 select-none lg:h-10 mdb:h-8"
          />
          <img
            src={person}
            draggable="false"
            className="h-14 select-none lg:h-10 mdb:h-8"
          />
          <img
            src={yet}
            draggable="false"
            className="h-20 select-none lg:h-12 mdb:h-10"
          />
        </div>
      </section>
    </Fragment>
  );
};

export default HomePage;
