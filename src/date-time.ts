export function dateTimeString(at: number): string {
  return `${dateString(at)} ${timeString(at)}`;
}

export function dateString(at: number): string {
  const d = new Date(at);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${year}/${month < 10 ? '0' : ''}${month}/${day < 10 ? '0' : ''}${day}`;
}

export function timeString(at: number): string {
  const d = new Date(at);
  const hour = d.getHours();
  const min = d.getMinutes();
  const sec = d.getSeconds();
  return `${hour < 10 ? '0' : ''}${hour}:${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
}

export function shortDateString(at: number): string {
  const d = new Date(at);
  const month = d.getMonth();
  const day = d.getDate();
  return `${monthAbbreviations[month as MonthAbbreviations]} ${day < 10 ? '0' : ''}${day}`;
}

const monthAbbreviations = {
  0: 'Jan.',
  1: 'Feb.',
  2: 'Mar.',
  3: 'Apr.',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'Aug.',
  8: 'Sept.',
  9: 'Oct.',
  10: 'Nov.',
  11: 'Dec.',
};

type MonthAbbreviations = keyof typeof monthAbbreviations;
