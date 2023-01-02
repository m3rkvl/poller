import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import uuid from "react-uuid";
import { UserAuth } from "../../context/auth/AuthContext";
import makeSlug from "../../util/makeSlug";
import ChevronIcon from "../ui/ChevronIcon";

type buttonEvent = React.MouseEvent<HTMLButtonElement>;
type inputEvent = React.ChangeEvent<HTMLInputElement>;
type inputDescEvent = React.ChangeEvent<HTMLTextAreaElement>;

const CreatePollForm = () => {
  const { user, createPoll, createUserPoll } = UserAuth();
  const navigate = useNavigate();

  const [showDesc, setShowDesc] = useState(false);
  const [showOther, setShowOther] = useState(false);
  const [showDatetime, setShowDatetime] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState([
    { optionBody: "", other: false },
    { optionBody: "", other: false },
  ]);
  const [slugChanged, setSlugChanged] = useState(false);
  const [slug, setSlug] = useState(makeSlug(12));

  const [date, setDate] = useState(86400000);
  const [datetime, setDatetime] = useState(0);

  const [selection, setSelection] = useState("one");
  const [voteFrom, setVoteFrom] = useState(1);
  const [voteTo, setVoteTo] = useState(1);

  const [voteRestriction, setVoteRestriction] = useState("session");
  const [resultsRestriction, setResultsRestriction] = useState("public");

  const disabled =
    title.trim() === "" ||
    (description.trim() === "" && showDesc) ||
    options.some((option) => option.optionBody.trim() === "") ||
    slug.trim() === "";

  //=====================================================================================

  const handleTitleChange = (e: inputEvent) => {
    setTitle((prev) => e.target.value);
  };

  const handleDescriptionChange = (e: inputDescEvent) => {
    setDescription((prev) => e.target.value);
  };

  const handleOptionChange = (e: inputEvent, i: number) => {
    let data = [...options];
    data[i]["optionBody"] = e.target.value;
    setOptions(data);
  };

  const handleShowDate = () => {
    setShowDatetime(true);
  };

  const handleDatetimeChange = (e: inputEvent) => {
    setDate(0);
    setDatetime(new Date(e.target.value).getTime() - Date.now());
    console.log(new Date(e.target.value));
  };

  const handleDateChange = (value: number) => {
    setShowDatetime(false);
    setDatetime(0);
    setDate(value);
  };

  const handleSelectionChange = (value: string) => {
    setSelection(value);
  };

  const handleVoteFrom = (e: inputEvent) => {
    setVoteFrom(+e.target.value);
  };

  const handleVoteTo = (e: inputEvent) => {
    setVoteTo(+e.target.value);
  };

  const handleOne = () => {
    setVoteFrom(1);
    setVoteTo(1);
  };

  const handleUnlimited = () => {
    setVoteFrom(1);
    setVoteTo(options.length);
  };

  const handleVoteRestrictionChange = (value: string) => {
    setVoteRestriction(value);
  };

  const handleResultsRestrictionChange = (value: string) => {
    setResultsRestriction(value);
  };

  //=====================================================================================

  const addOption = () => {
    if (!showOther)
      setOptions((prev) => [...options, { optionBody: "", other: false }]);
    if (showOther) {
      let data = [...options];
      data.splice(options.length - 1, 0, {
        optionBody: "",
        other: false,
      });
      setOptions((prev) => data);
    }
  };

  const removeOption = (i: number, other: boolean) => {
    if (options.length === 1) return;
    let data = [...options];
    data.splice(i, 1);
    setOptions((prev) => data);

    if (other) setShowOther((prev) => false);
  };

  const addOther = () => {
    setOptions((prev) => [
      ...options,
      { optionBody: "Other", other: true, voteCount: 0 },
    ]);
    setShowOther((prev) => true);
  };

  //=====================================================================================

  const submitHandler = async () => {
    const id = uuid();
    const descriptionTxt =
      description.trim() !== "" && showDesc ? description.trim() : false;
    let endAfter: number = 0;
    if (date) endAfter = date;
    if (datetime) endAfter = datetime;
    const admin = user ? user.uid : null;
    const adminName = user ? user.displayName : null;
    const adminPass = makeSlug(6);
    const optionsArr = options
      .filter((option) => option.optionBody.trim() !== "")
      .map((option) => {
        return {
          option: option.optionBody.trim(),
          voteCount: 0,
        };
      });
    let slugTxt;
    if (slugChanged) slugTxt = slug.trim().split(" ").join("_");
    if (!slugChanged) slugTxt = slug;

    const pollData = {
      admin,
      adminName,
      adminPass,
      id,
      title: title.trim(),
      description: descriptionTxt,
      options: optionsArr,
      createdAt: Date.now(),
      endsAt: Date.now() + endAfter,
      slug: slugTxt,
      settings: {
        endAfter,
        optionRestriction: selection,
        range: {
          from: voteFrom,
          to: voteTo,
        },
        voteRestriction,
        resultsRestriction,
      },
    };

    const userPollObj = {
      id,
      slug: slugTxt,
      title: pollData.title,
      adminName,
      createdAt: pollData.createdAt,
      endsAt: pollData.endsAt,
    };
    try {
      await createPoll!(pollData);
      if (user) {
        await createUserPoll!(userPollObj);
      }
      navigate(`/poll/${slugTxt}/admin`, { state: { adminPass: adminPass } });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  //=====================================================================================
  //=====================================================================================

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submitHandler();
      }}
      className="flex flex-col items-start gap-4"
    >
      <label
        htmlFor="title"
        className="w-full text-sm font-semibold text-gray-300"
      >
        Title <span className="text-red-300">*</span>
        <input
          id="title"
          required
          type="text"
          className="inputTitle"
          placeholder="Your Title"
          onChange={(e) => handleTitleChange(e)}
          value={title}
        />
      </label>
      {showDesc && (
        <label htmlFor="description" className="inputLabel">
          Description
          <textarea
            id="description"
            className="inputDescription"
            placeholder="Your description."
            onChange={(e) => handleDescriptionChange(e)}
            value={description}
          />
        </label>
      )}
      <button
        className="descriptionBtn"
        type="button"
        onClick={() => {
          setShowDesc((prev) => !prev);
        }}
      >
        {showDesc ? "Cancel description" : "Add description"}
      </button>
      <label className="inputLabel -mb-3">
        Options <span className="optionsRequired">*</span>
      </label>
      <div className="flex w-full flex-col gap-2">
        {options.map((option, i) => (
          <div className="relative w-full" key={i}>
            <input
              placeholder={`Option ${i + 1}`}
              disabled={option.other}
              required
              type="text"
              // prettier-ignore
              className={`inputOptionDef ${option.other ? "inputOptionOther" : "inputOptionNorm "}`}
              value={option.optionBody}
              onChange={(e: inputEvent) => handleOptionChange(e, i)}
            />
            {(options.length > 2 || (options.length === 1 && showOther)) && (
              <button
                onClick={() => removeOption(i, option.other)}
                type="button"
                className="deleteBtn"
              >
                &#9587;
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2">
        <button onClick={addOption} type="button" className="addOptionBtn mr-2">
          <span className="z-10 cursor-pointer">Add option</span>
        </button>
        {!showOther && "or"}
        {!showOther && (
          <button className="addOtherBtn" type="button" onClick={addOther}>
            Add "
            <span className="cursor-pointer font-semibold text-gray-300">
              Other
            </span>
            "
          </button>
        )}
      </div>
      {/* ///////////////////////////////////////////////////////////////////////// */}
      <h2 className="mt-4 flex w-full items-center gap-2 border-t border-gray-700 pt-2 text-lg font-bold">
        <span onClick={() => setShowSettings((prev) => !prev)}>Settings</span>
        <button
          type="button"
          className="rounded-full border border-gray-800 outline-none focus:border-teal-700"
          onClick={() => setShowSettings((prev) => !prev)}
        >
          <ChevronIcon
            classes={`chevronIcon ${
              showSettings ? "-rotate-180" : "delay-500"
            }`}
          />
        </button>
      </h2>
      <div
        className={`flex w-full flex-col items-start gap-3 overflow-hidden transition-all duration-1000 ${
          showSettings ? "max-h-[200rem]" : "max-h-0 opacity-0"
        }`}
      >
        <label className="inputLabel -mb-3">End After</label>
        <div className="mb-1 flex flex-wrap items-center justify-start gap-2">
          {/* prettier-ignore */}
          <button className={`dateBtn ${date === 86400000 ? "dateBtnActive" : ""}`} type="button" onClick={() => handleDateChange(86400000)}>A Day</button>
          {/* prettier-ignore */}
          <button className={`dateBtn ${date === 86400000 * 7 ? "dateBtnActive" : ""}`} type="button" onClick={() => handleDateChange(86400000 * 7)}>A Week</button>
          {/* prettier-ignore */}
          <button className={`dateBtn ${date === 86400000 * 30 ? "dateBtnActive" : ""}`} type="button" onClick={() => handleDateChange(86400000 * 30)}>A Month</button>
          {
            //prettier-ignore
            !showDatetime && (<button className="dateBtn" type="button" onClick={handleShowDate}>Custom Date</button>)
          }
          {
            //prettier-ignore
            showDatetime && (<input type="datetime-local" min={new Date(Date.now()).toISOString().slice(0, 16)} className={`datetime ${date === 0 ? "datetimeActive" : ""}`} onChange={(e) => handleDatetimeChange(e)}/>)
          }
        </div>
        <label className="inputLabel -mb-3">Selection Restriction</label>
        <div className="mb-1 flex flex-wrap items-center justify-start gap-2">
          <button
            className={`selectionBtn ${
              selection === "one" ? "selectionBtnActive" : ""
            }`}
            type="button"
            onClick={() => {
              handleSelectionChange("one");
              handleOne();
            }}
          >
            One
          </button>
          <button
            className={`selectionBtn ${
              selection === "unlimited" ? "selectionBtnActive" : ""
            }`}
            type="button"
            onClick={() => {
              handleSelectionChange("unlimited");
              handleUnlimited();
            }}
          >
            Unlimited
          </button>
          <button
            className={`selectionBtn ${
              selection === "exact" ? "selectionBtnActive" : ""
            }`}
            type="button"
            onClick={() => {
              handleSelectionChange("exact");
            }}
          >
            Exact
          </button>
          <button
            className={`selectionBtn ${
              selection === "range" ? "selectionBtnActive" : ""
            }`}
            type="button"
            onClick={() => handleSelectionChange("range")}
          >
            Range
          </button>
          {
            //prettier-ignore
            (selection === "exact" || selection === "range") && (<input type="number" className="inputFrom" required placeholder={voteFrom + ""} min={1} max={options.length} onChange={(e) => {
            if(selection === "exact") {
              handleVoteFrom(e)
              handleVoteTo(e)
            }
            if(selection === "range") {
              handleVoteFrom(e)
            }
          }}/>)
          }
          {
            //prettier-ignore
            selection === "range" && (<input type="number" className="inputTo" placeholder={options.length + ""} required min={voteFrom} max={options.length} onChange={(e) => {handleVoteTo(e)}}/>)
          }
        </div>
        <label className="inputLabel -mb-3">Vote Restriction</label>
        <div className="mb-1 flex flex-wrap items-center justify-start gap-2">
          <button
            className={`selectionBtn ${
              voteRestriction === "session" ? "selectionBtnActive" : ""
            }`}
            type="button"
            onClick={() => {
              handleVoteRestrictionChange("session");
            }}
          >
            Browser Session
          </button>
          <button
            className={`selectionBtn ${
              voteRestriction === "user" ? "selectionBtnActive" : ""
            }`}
            type="button"
            onClick={() => {
              handleVoteRestrictionChange("user");
            }}
          >
            User Account
          </button>
          <button
            className={`selectionBtn ${
              voteRestriction === "unlimited" ? "selectionBtnActive" : ""
            }`}
            type="button"
            onClick={() => {
              handleVoteRestrictionChange("unlimited");
            }}
          >
            Unlimited
          </button>
        </div>
        {/* ///////////////////////////////////////////////////////////////////////// */}
        <label className="inputLabel -mb-3">Results Visibility</label>
        <div className="mb-2 flex flex-wrap items-center justify-start gap-2">
          <button
            className={`selectionBtn ${
              resultsRestriction === "public" ? "selectionBtnActive" : ""
            }`}
            type="button"
            onClick={() => {
              handleResultsRestrictionChange("public");
            }}
          >
            Always Public
          </button>
          <button
            className={`selectionBtn ${
              resultsRestriction === "publicAfterEnd"
                ? "selectionBtnActive"
                : ""
            }`}
            type="button"
            onClick={() => {
              handleResultsRestrictionChange("publicAfterEnd");
            }}
          >
            Public After Poll Ends
          </button>
          <button
            className={`selectionBtn ${
              resultsRestriction === "publicAfterVote"
                ? "selectionBtnActive"
                : ""
            }`}
            type="button"
            onClick={() => {
              handleResultsRestrictionChange("publicAfterVote");
            }}
          >
            Public After Voting
          </button>
          <button
            className={`selectionBtn ${
              resultsRestriction === "private" ? "selectionBtnActive" : ""
            }`}
            type="button"
            onClick={() => {
              handleResultsRestrictionChange("private");
            }}
          >
            Private
          </button>
        </div>
        <label
          htmlFor="slug"
          className="w-full text-sm font-semibold text-gray-300"
        >
          Slug <span className="text-red-300">*</span>{" "}
          <span data-content="example_slug_like_this" className="slugWarning">
            ?
          </span>
          <div className="relative">
            <p className="absolute left-4 top-2 text-base font-normal text-gray-400 smb:top-[.6rem] smb:text-xs slg:hidden">
              poller.host/polls/
            </p>
            <button
              onClick={() => {
                setSlugChanged((prev) => false);
                setSlug((prev) => makeSlug(12));
              }}
              type="button"
              className="slugMeBtn"
            >
              <span className="pointer-events-none relative z-10">
                Slug Me! 🎉
              </span>
            </button>
            <input
              id="slug"
              required
              type="text"
              className="inputSlug"
              placeholder="your_slug"
              onChange={(e) => {
                setSlugChanged((prev) => true);
                setSlug((prev) => e.target.value);
              }}
              value={slug}
            />
          </div>
        </label>
      </div>
      <button className="formSubmitBtn" disabled={disabled} type="submit">
        <span className="pointer-events-none relative z-10">
          {disabled ? "Fill the form to create your poll." : "Create Poll"}
        </span>
      </button>
    </form>
  );
};

export default CreatePollForm;
