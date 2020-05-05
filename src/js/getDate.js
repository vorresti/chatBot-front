function formatDate(value) {
  return value < 10 ? `0${value}` : value;
}

export default function getDate(dateValue) {
  const currentDate = new Date(dateValue);
  const day = formatDate(currentDate.getDate());
  const month = formatDate(currentDate.getMonth() + 1);
  const year = formatDate(currentDate.getFullYear());
  const hour = formatDate(currentDate.getHours());
  const min = formatDate(currentDate.getMinutes());
  return `${hour}:${min} ${day}.${month}.${year}`;
}
