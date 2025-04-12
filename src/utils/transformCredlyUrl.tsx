export const transformCredlyUrl = (
  url: string,
  baseUrl: string = 'https://images.credly.com/',
  size: number = 200
) => {
  if (!url.startsWith(baseUrl)) return url
  return url.replace(baseUrl, `${baseUrl}size/${size}x${size}/`)
}
