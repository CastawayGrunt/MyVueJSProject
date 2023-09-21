import { type Ratings } from '@/services/fireGameData'

export const ratingAverage = (ratings: Ratings) => {
  if (ratings === undefined) {
    return 0
  }
  const totalRatings =
    ratings['1star'] + ratings['2star'] + ratings['3star'] + ratings['4star'] + ratings['5star']

  if (totalRatings === 0) {
    return 0
  }

  const totalScore =
    ratings['1star'] +
    ratings['2star'] * 2 +
    ratings['3star'] * 3 +
    ratings['4star'] * 4 +
    ratings['5star'] * 5

  const average = totalScore / totalRatings

  const formattedAverage = () => {
    if (!average.toString().includes('0')) {
      return average
    }
    return average.toFixed(1)
  }

  const rating = {
    formattedAverageString: formattedAverage(),
    totalRatings: totalRatings
  }

  return rating
}
