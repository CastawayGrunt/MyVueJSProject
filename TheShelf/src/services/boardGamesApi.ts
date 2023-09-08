import axios from 'axios'
import { XMLParser, XMLValidator } from 'fast-xml-parser'

const baseUrl = 'https://boardgamegeek.com/xmlapi2'

export interface GameDetailResponse {
  name: { '@_type': string; '@_value': string }
  yearpublished: { '@_value': number }
  '@_id': number
  '@_type': string
}

export const searchGames = (query: string) => {
  const response = new Promise<GameDetailResponse[]>((resolve, reject) =>
    axios
      .get(`${baseUrl}/search?query=${query}&type=boardgame,boardgameexpansion`)
      .then((result) => {
        if (XMLValidator.validate(result.data)) {
          const options = {
            ignoreAttributes: false,
            attributeNamePrefix: '@_',
            ignoreDeclaration: true,
            parseAttributeValue: true
          }
          const parser = new XMLParser(options)
          const data = parser.parse(result.data)

          resolve(data.items.item)
        }
      })
      .catch((error) => {
        reject(error)
      })
  )
  return response
}
