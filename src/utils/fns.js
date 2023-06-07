import moment from "moment";

export const gd = (offset, type = "month") => moment().add(offset, type);
