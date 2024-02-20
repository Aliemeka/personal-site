export const convertDate = (date: string) => {
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return formattedDate;
};

export function compareDates(a: string, b: string) {
  const dateA: any = new Date(a);
  const dateB: any = new Date(b);
  return dateB - dateA;
}
