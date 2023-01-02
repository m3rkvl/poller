import CreatePollForm from "../components/createPoll/CreatePollForm";
import Card from "../components/ui/Card";

const CreatePollPage = () => {
  document.title = `Poller • Create Your Poll`;

  return (
    <div className="content">
      <Card classes="flex flex-col lg:w-full" borderColor="teal">
        <h1 className="mb-2 text-2xl font-bold">Create a poll.</h1>
        <p className="mb-4 text-sm italic text-gray-400">
          Fields marked with <span className="text-red-300">*</span> are
          required.
        </p>
        <CreatePollForm />
      </Card>
    </div>
  );
};

export default CreatePollPage;
