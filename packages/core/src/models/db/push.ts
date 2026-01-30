import { db } from '@/types'
import { createClient } from './index'

type PushInfo = db.PushInfo

export const AddPush = async (
  repoId: number,
  sessionId: number,
  branch: string = 'main',
  commitSha: string = 'main',
) => {
  const client = await createClient()
  await client.run(
    'INSERT INTO push (repoId, sessionId, branch, commitSha) VALUES (?, ?, ?, ?)',
    [repoId, sessionId, branch, commitSha],
  )
}

export const GetAll = async () => {
  const client = await createClient()
  return await new Promise<PushInfo[]>((resolve, reject) => {
    client.all('SELECT * FROM push', [], (err, rows) => {
      if (err) reject(err)
      else resolve(rows as PushInfo[])
    })
  })
}

export const GetPush = async (
  repoId: number,
  sessionId: number,
  branch: string,
): Promise<PushInfo | null> => {
  const client = await createClient()
  return await new Promise<PushInfo | null>((resolve, reject) => {
    client.get(
      'SELECT * FROM push WHERE repoId = ? AND sessionId = ? AND branch = ?',
      [repoId, sessionId, branch],
      (err, row) => {
        if (err) reject(err)
        else resolve(row as PushInfo)
      },
    )
  })
}

export const RemovePush = async (
  repoId: number,
  sessionId: number,
  branch?: string,
) => {
  const client = await createClient()
  if (branch) {
    await client.run(
      'DELETE FROM push WHERE repoId = ? AND sessionId = ? AND branch = ?',
      [repoId, sessionId, branch],
    )
  } else {
    await client.run('DELETE FROM push WHERE repoId = ? AND sessionId = ?', [
      repoId,
      sessionId,
    ])
  }
}

export const UpdatePush = async (
  repoId: number,
  sessionId: number,
  branch: string,
  commitSha: string,
) => {
  let client = await createClient()
  await client.run(
    'UPDATE push SET commitSha = ? WHERE repoId = ? AND sessionId = ? AND branch = ?',
    [commitSha, repoId, sessionId, branch],
  )
}
