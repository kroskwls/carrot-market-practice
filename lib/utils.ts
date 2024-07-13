export const formatToWon = (price: number) => {
  return price.toLocaleString("ok-KR");
}

export const formatToTimeAgo = (date: string) => {
  const dayInMs = 1000 * 60 * 60 * 24;
  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const diff = Math.floor((time - now) / dayInMs);

  const formatter = new Intl.RelativeTimeFormat("ko");

  return formatter.format(diff, "days");
}