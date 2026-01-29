import { Platform, db } from '@/types'
import { createClient } from '.'

type RepoInfo = db.RepoInfo
export const AddRepo = async (
  platform: Platform,
  owner: string,
  repo: string,
  botId: string,
  groupId: string,
) => {
  let client = await createClient()
  await client.run(
    'INSERT INTO repo (platform,owner, repo, botId, groupId) VALUES (?,?, ?, ?, ?)',
    [platform, owner, repo, botId, groupId],
  )
}

export const GetAll = async () => {
  let client = await createClient()
  return await new Promise<RepoInfo[]>((resolve, reject) => {
    client.all('SELECT * FROM repo', (err, rows) => {
      if (err) reject(err)
      else resolve(rows as RepoInfo[])
    })
  })
}

export const GetRepo = async (
  platform: Platform,
  owner: string,
  repo: string,
  botId: string,
  groupId: string,
): Promise<RepoInfo | null> => {
  let client = await createClient()
  return await new Promise<RepoInfo | null>((resolve, reject) => {
    client.get(
      'SELECT * FROM repo WHERE platform = ? AND owner = ? AND repo = ? AND botId = ? AND groupId = ?',
      [platform, owner, repo, botId, groupId],
      (err, row) => {
        if (err) reject(err)
        else resolve(row as RepoInfo)
      },
    )
  })
}

export const GetRepoById = async (id: number): Promise<RepoInfo | null> => {
  let client = await createClient()
  return await new Promise<RepoInfo | null>((resolve, reject) => {
    client.get('SELECT * FROM repo WHERE id = ?', [id], (err, row) => {
      if (err) reject(err)
      else resolve(row as RepoInfo)
    })
  })
}
