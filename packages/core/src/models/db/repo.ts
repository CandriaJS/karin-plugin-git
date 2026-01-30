import { Platform, db } from '@/types'
import { createClient } from '.'

type RepoInfo = db.RepoInfo
export const AddRepo = async (
  platform: Platform,
  owner: string,
  repo: string,
) => {
  const client = await createClient()
  await client.run('INSERT INTO repo (platform,owner, repo) VALUES (?,?, ?)', [
    platform,
    owner,
    repo,
  ])
}

export const GetAll = async () => {
  const client = await createClient()
  return await new Promise<RepoInfo[]>((resolve, reject) => {
    client.all('SELECT * FROM repo', (err, rows) => {
      if (err) reject(err)
      else resolve(rows as RepoInfo[])
    })
  })
}

type GetRepo = {
  (id: number): Promise<RepoInfo | null>
  (platform: Platform, owner: string, repo: string): Promise<RepoInfo | null>
}

export const GetRepo: GetRepo = async (
  IdOrPlatform: Platform | number,
  owner?: string,
  repo?: string,
): Promise<RepoInfo | null> => {
  const client = await createClient()
  if (typeof IdOrPlatform === 'number') {
    return await new Promise<RepoInfo | null>((resolve, reject) => {
      client.get(
        'SELECT * FROM repo WHERE id = ?',
        [IdOrPlatform],
        (err, row) => {
          if (err) reject(err)
          else resolve(row as RepoInfo)
        },
      )
    })
  }
  return await new Promise<RepoInfo | null>((resolve, reject) => {
    client.get(
      'SELECT * FROM repo WHERE platform = ? AND owner = ? AND repo = ?',
      [IdOrPlatform, owner, repo],
      (err, row) => {
        if (err) reject(err)
        else resolve(row as RepoInfo)
      },
    )
  })
}
