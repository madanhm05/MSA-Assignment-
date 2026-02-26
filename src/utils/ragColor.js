export const getRagColor = (status) => {
  switch (status) {
    case "RED":
      return "#ff4d4f";
    case "AMBER":
      return "#faad14";
    case "GREEN":
      return "#52c41a";
    default:
      return "#999";
  }
};