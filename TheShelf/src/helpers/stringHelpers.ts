import type { GameIdResponse } from '@/services/boardGamesApi'

export const findGameName = (game: GameIdResponse) => {
  console.log('props.game', game)
  if (!game.name) {
    return ''
  }
  if (Array.isArray(game.name)) {
    const name = game.name.filter((name) => name['@_type'] == 'primary')
    return `${name[0]?.['@_value']}`
  }
  if (game.name['@_type'] == 'primary') {
    return `${game.name?.['@_value']}`
  }
  return ''
}
