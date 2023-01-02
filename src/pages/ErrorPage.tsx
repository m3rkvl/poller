import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../layout/Footer";
import Nav from "../layout/Nav";

function ErrorPage() {
  const [count, setCount] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const errorTxt = `404: Not Found`;

  document.title = `Poller • Something Went Wrong...`;

  return (
    <Fragment>
      <Nav />
      <main className="content mt-5">
        <h1 className="mb-4 bg-gradient-to-tr from-teal-500 via-blue-500 to-purple-500 bg-cover bg-clip-text text-5xl font-bold text-transparent">
          Something went wrong...
        </h1>
        <h2 className="mb-2 text-2xl">{errorTxt}</h2>
        <p className="text-sm italic text-gray-500">
          You'll be redirected in {count}...
        </p>
      </main>
      <Footer />
    </Fragment>
  );
}

export default ErrorPage;
