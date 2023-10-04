import dayjs from 'dayjs'
import { Timestamp } from '@firebase/firestore'

export const formatDate = (date: Timestamp) => {
  const datePlayed = dayjs(date.seconds * 1000)
  return dayjs(datePlayed).format('MMM D, YYYY')
}
