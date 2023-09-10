import axios from 'axios'
import { XMLParser, XMLValidator } from 'fast-xml-parser'

const baseUrl = 'https://boardgamegeek.com/xmlapi2'

export interface GameSearchResponse {
  name: { '@_type': string; '@_value': string }
  yearpublished: { '@_value': number }
  '@_id': number
  '@_type': string
}

type gameName = {
  '@_sortindex': number
  '@_type': string
  '@_value': string
}

export interface GameIdResponse {
  '@_id': number
  '@_type': string
  description: string
  image: string
  link: {
    '@_id': number
    '@_type': string
    '@_value': string
  }
  maxplayers: {
    '@_value': number
  }
  maxplaytime: {
    '@_value': number
  }
  minage: {
    '@_value': number
  }
  minplayers: {
    '@_value': number
  }
  minplaytime: {
    '@_value': number
  }
  name: [gameName] | gameName
  playingtime: {
    '@_value': number
  }
  poll: {
    '@_name': string
    '@_title': string
    results: {
      result: {
        '@_level': string
        '@_numvotes': number
        '@_value': number
      }
    }
  }
  thumbnail: string
  yearpublished: { '@_value': number }
}

const parseXMLResults = (data: any) => {
  const options = {
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    ignoreDeclaration: true,
    parseAttributeValue: true
  }
  const parser = new XMLParser(options)
  const result = parser.parse(data)
  return result
}

export const getGames = (query: string) => {
  const response = new Promise<GameSearchResponse[]>((resolve, reject) =>
    axios
      .get(`${baseUrl}/search?query=${query}&type=boardgame,boardgameexpansion`)
      .then((result) => {
        if (XMLValidator.validate(result.data)) {
          const data = parseXMLResults(result.data)

          resolve(data.items.item)
        }
      })
      .catch((error) => {
        reject(error)
      })
  )
  return response
}

export const getGameDetails = (id: number) => {
  const response = new Promise<GameIdResponse>((resolve, reject) =>
    axios
      .get(`${baseUrl}/thing?id=${id}`)
      .then((result) => {
        if (XMLValidator.validate(result.data)) {
          const data = parseXMLResults(result.data)

          resolve(data.items.item)
        }
      })
      .catch((error) => {
        reject(error)
      })
  )
  return response
}
