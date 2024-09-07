export function getDayOrNightIcon(
  iconName: string,
  dateTimeString: string
): string {
  const hours = new Date(dateTimeString).getHours();  //get hours from the givem date and time

  const isDayTime = hours >= 6 && hours < 18;  //daytime from 6 am - 6 pm

  //if daytime, return "d", otherwise return "n"
  return isDayTime ? iconName.replace(/.$/, "d") : iconName.replace(/.$/, "n");
}