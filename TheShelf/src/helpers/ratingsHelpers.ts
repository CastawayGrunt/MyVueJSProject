import { type Ratings } from '@/services/fireGameData'

export const ratingAverage = (ratings: Ratings) => {
  let rating = {
    formattedAverageString: '0',
    totalRatings: 0
  }

  if (ratings === undefined) {
    return rating
  }

  const totalRatings =
    ratings['1star'] + ratings['2star'] + ratings['3star'] + ratings['4star'] + ratings['5star']

  if (totalRatings === 0) {
    return rating
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
      return average.toString()
    }
    return average.toFixed(1)
  }

  return (rating = {
    formattedAverageString: formattedAverage(),
    totalRatings: totalRatings
  })
}
