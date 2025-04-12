import { CredlyData } from '@/types/credly.types'

export const getCredlyData = async () => {
  const res = await fetch(
    'https://www.credly.com/users/jonatan-kruszewski/badges?page=1&page_size=48&sort=rank',
    {
      headers: {
        accept: 'application/json',
        'accept-language':
          'en-IL,en;q=0.9,he-IL;q=0.8,he;q=0.7,en-US;q=0.6,es;q=0.5,la;q=0.4,fil;q=0.3,el;q=0.2',
        'cache-control': 'no-cache',
        pragma: 'no-cache',
        priority: 'u=1, i',
        'sec-ch-ua':
          '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        Referer: 'https://www.credly.com/users/jonatan-kruszewski',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      },
      body: null,
      method: 'GET'
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch Credly')
  }

  return (await res.json()) as CredlyData
}
