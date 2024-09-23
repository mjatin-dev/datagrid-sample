import moment from "moment";

export const addDaysInDate = (date, numberOfDays) => {
  return moment(date).add(numberOfDays, "days").format();
};

export const subtractDaysInDate = (date, numberOfDays) => {
  return moment(date).subtract(numberOfDays, "days").format();
};

export const getCurrentDate = () => {
  return new Date();
};

export const addMonthToCurrentDate = (date) => {
  return new Date(date.setMonth(date.getMonth() + 1));
};

export const subtractMonthToCurrentDate = (date) => {
  return new Date(date.setMonth(date.getMonth() - 1));
};

export const getFirstMondayOfMonth = (firstMonday) => {
  return parseInt(moment(firstMonday).format("D"));
};

export const getMondays = (date) => {
  let givenDate = new Date(date),
    month = givenDate.getMonth(),
    mondays = [];
  givenDate.setDate(1);
  // Get the first Monday in the month
  while (givenDate.getDay() !== 1) {
    givenDate.setDate(givenDate.getDate() + 1);
  }
  // Get all the other Mondays in the month
  while (givenDate.getMonth() === month) {
    mondays.push(new Date(givenDate.getTime()));
    givenDate.setDate(givenDate.getDate() + 7);
  }
  return mondays;
};
export const disabledHoursInEventEndTime = () => {
  const hours = [];
  for (let i = 0; i < moment().hour(); i++) {
    hours.push(i);
  }
  return hours;
};
export const disabledMinutesInEventEndTime = (selectedHour) => {
  const minutes = [];
  if (selectedHour !== -1 && moment().hour() === selectedHour) {
    for (let i = 0; i < moment().minutes(); i++) {
      minutes.push(i);
    }
  }
  return minutes;
};
export const isValidEndTime = (start_date, end_date, end_time) => {
  const startDate = start_date ? moment(start_date, "YYYY-MM-DD") : null;
  const endDate = end_date ? moment(end_date, "YYYY-MM-DD") : null;
  const today = moment().format("YYYY-MM-DD");
  const endTime = end_time ? moment(end_time, "hh:mm A") : null;
  const selectedHour = endTime?.hour() || 0;
  const selectedMinutes = endTime?.minutes() || 0;
  return startDate &&
    endDate &&
    startDate?.isSame(today) &&
    endDate?.isSame(today)
    ? selectedHour === moment().hour()
      ? selectedMinutes >= moment().minutes()
      : selectedHour >= moment().hour()
    : true;
};
