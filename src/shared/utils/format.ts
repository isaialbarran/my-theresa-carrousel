export const formatReleaseYear = (releaseDate: string | null): number | null => {
  if (!releaseDate) return null;
  try {
    return new Date(releaseDate).getFullYear();
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
