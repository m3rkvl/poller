import { Fragment } from "react";
import { Routes, Route } from "react-router";
import { Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./layout/Layout";
import CreatePollPage from "./pages/CreatePollPage";
import HomePage from "./pages/HomePage";
import PollResultsPage from "./pages/PollResultsPage";
import AccountPage from "./pages/AccountPage";
import { UserAuth } from "./context/auth/AuthContext";
import PollRouteDecider from "./pages/PollRouteDecider";
import PollVotePage from "./pages/PollVotePage";
import PollAdminPage from "./pages/PollAdminPage";
import ErrorPage from "./pages/ErrorPage";

function App() {
  const { user } = UserAuth();

  return (
    <Fragment>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          success: {
            className: "font-semibold text-gray-900 bg-gray-100",
            iconTheme: {
              primary: "#14b8a6",
              secondary: "#f3f4f6",
            },
          },
          error: {
            className: "font-semibold text-gray-900 bg-gray-100",
            iconTheme: {
              primary: "#ef4444",
              secondary: "#f3f4f6",
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/poll/create" element={<CreatePollPage />} />
          <Route path="/poll/:pollId">
            <Route index element={<PollRouteDecider />} />
            <Route path="vote" element={<PollVotePage />} />
            <Route path="results" element={<PollResultsPage />} />
            <Route path="admin" element={<PollAdminPage />} />
          </Route>
        </Route>
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/*" element={<Navigate to="/error" />} />
      </Routes>
    </Fragment>
  );
}

export default App;
