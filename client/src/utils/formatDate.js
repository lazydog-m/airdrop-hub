import { format, parseISO } from "date-fns";

export const formatDateVN = (date) => {
  const formattedDate = format(parseISO(date), "dd/MM/yyyy");
  return formattedDate;
}


