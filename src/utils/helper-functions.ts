
export const parseHour = (value: string) => {

  if (!value) {
    return -1;
  }

  const [hourStr, meridian] = value.trim().split(" ");

  let hour = parseInt(hourStr, 10);

  if (meridian === "AM" && hour === 12) {
    hour = 0;
  } else if (meridian === "PM" && hour !== 12) {
    hour += 12;
  }

  return hour;
};