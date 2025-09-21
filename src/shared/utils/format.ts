export const formatReleaseYear = (releaseDate: string | null): number | null => {
  if (!releaseDate) return null;
  try {
    const year = new Date(releaseDate).getFullYear();
    return isNaN(year) ? null : year;
  } catch {
    return null;
  }
};

export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

export const formatVoteCount = (voteCount: number): string => {
  if (voteCount >= 1000) {
    return `${(voteCount / 1000).toFixed(1)}k`;
  }
  return voteCount.toString();
};
