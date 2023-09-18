// type ratings = Pick<GameType, 'rating'>
type ratings = {
  '1star': number
  '2star': number
  '3star': number
  '4star': number
  '5star': number
}

export const ratingAverage = (ratings: ratings) => {
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
  return average.toFixed(1)
}
