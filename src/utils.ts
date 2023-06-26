export const convertDate = (date: string) => {
  const dateString = "2023-06-26T00:00:00.000Z";
  const dateObj = new Date(dateString);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return formattedDate;
};
