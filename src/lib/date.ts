export const formatDateToLocale = (dateString: string | null): string => {
  if (!dateString) return "Selected date";
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const calculateValidity = (): string => {
  const now = new Date();
  const validUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const diffInMs = validUntil.getTime() - now.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${diffInHours}h : ${diffInMinutes}min`;
};
