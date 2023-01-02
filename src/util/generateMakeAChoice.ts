const generateMakeAChoice = (restriction: string, from: number, to: number) => {
  if (restriction === "one") return "Make a choice";

  if (restriction === "unlimited") return "Choose as many as you like";

  if (restriction === "exact")
    return `Make ${from === 1 ? "a choice" : `${from} choices`}`;

  if (restriction === "range") return `Make between ${from} to ${to} choices`;
};

export default generateMakeAChoice;
