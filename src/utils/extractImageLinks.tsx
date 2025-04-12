export const extractImageLinks = (html: string) => {
  const imageLinks = []
  const regex = /<img[^>]+src=["'](https?:\/\/[^"']+)["']/g
  let match

  while ((match = regex.exec(html)) !== null) {
    imageLinks.push(match[1])
  }

  return imageLinks
}
