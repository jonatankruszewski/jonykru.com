export type Feed = {
  url: string
  title: string
  link: string
  author: string
  description: string
  image: string
}

export type Article = {
  title: string
  pubDate: string
  link: string
  guid: string
  author: string
  thumbnail: string
  description: string
  content: string
  enclosure?: Record<string, unknown>
  categories?: string[]
  images?: string[]
}

export type MediumData = {
  status: string
  feed?: Feed
  items: Article[]
}

export type MediumFlatData = {
  title: string
  pubDate: string
  guid: string
  link: string
  categories: string[]
  image: string
}
