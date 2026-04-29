import type { ReleaseInfo } from '@/types/db'
import { createClient } from './index'

export const AddRelease = async (
  repoId: number,
  sessionId: number,
  tagName: string,
) => {
  const client = await createClient()
  await client.run(
    'INSERT INTO release (repoId, sessionId, tagName) VALUES (?, ?, ?)',
    [repoId, sessionId, tagName],
  )
}

export const GetAll = async () => {
  const client = await createClient()
  return await new Promise<ReleaseInfo[]>((resolve, reject) => {
    client.all('SELECT * FROM release', [], (err, rows) => {
      if (err) reject(err)
      else resolve(rows as ReleaseInfo[])
    })
  })
}

export const GetRelease = async (
  repoId: number,
  sessionId: number,
  tagName?: string,
): Promise<ReleaseInfo | null> => {
  const client = await createClient()
  return await new Promise<ReleaseInfo | null>((resolve, reject) => {
    if (tagName) {
      client.get(
        'SELECT * FROM release WHERE repoId = ? AND sessionId = ? AND tagName = ?',
        [repoId, sessionId, tagName],
        (err, row) => {
          if (err) reject(err)
          else resolve(row as ReleaseInfo)
        },
      )
    } else {
      client.get(
        'SELECT * FROM release WHERE repoId = ? AND sessionId = ?',
        [repoId, sessionId],
        (err, row) => {
          if (err) reject(err)
          else resolve(row as ReleaseInfo)
        },
      )
    }
  })
}

export const RemoveRelease = async (
  repoId: number,
  sessionId: number,
) => {
  const client = await createClient()
  await client.run('DELETE FROM release WHERE repoId = ? AND sessionId = ?', [
    repoId,
    sessionId,
  ])
}

export const GetReleaseWithDetails = async () => {
  const client = await createClient()
  return await new Promise<Array<ReleaseInfo & {
    platform: string
    owner: string
    repo: string
    botId: string
    groupId: string
  }>>((resolve, reject) => {
    client.all(
      `SELECT r.*, rp.platform, rp.owner, rp.repo, s.botId, s.groupId
       FROM release r
       JOIN repo rp ON r.repoId = rp.id
       JOIN session s ON r.sessionId = s.id`,
      [],
      (err, rows) => {
        if (err) reject(err)
        else resolve(rows as Array<ReleaseInfo & {
          platform: string
          owner: string
          repo: string
          botId: string
          groupId: string
        }>)
      },
    )
  })
}
