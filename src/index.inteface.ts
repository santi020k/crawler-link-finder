export interface IData {
  url?: string
  result?: {
    statusCode?: number
    links?: Array<{ url: string, href: string }>
  }
}

export interface ISiteTree {
  pages: Array<{
    url?: string,
    links?: Array<{ url: string, href: string }>
  }>
  urls: Record<string, string>
  redirects: Record<string, string>,
}