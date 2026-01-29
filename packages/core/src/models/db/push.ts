import { db } from '@/types'
import { createClient } from './index'

type RepoInfo = db.PushRepo

export const AddPush = async (
  repoId: number,
  branch: string = 'main',
  commitSha: string = 'main',
) => {
  let client = await createClient()
  await client.run(
    'INSERT INTO push (repoId, branch, commitSha) VALUES (?, ?, ?)',
    [repoId, branch, commitSha],
  )
}

export const GetAll = async () => {
  let client = await createClient()
  return await new Promise<RepoInfo[]>((resolve, reject) => {
    client.all('SELECT * FROM push', [], (err, rows) => {
      if (err) reject(err)
      else resolve(rows as RepoInfo[])
    })
  })
}

export const GetPush = async (
  repoId: number,
  branch: string,
): Promise<RepoInfo | null> => {
  let client = await createClient()
  return await new Promise<RepoInfo | null>((resolve, reject) => {
    client.get(
      'SELECT * FROM push WHERE repoId = ? AND branch = ?',
      [repoId, branch],
      (err, row) => {
        if (err) reject(err)
        else resolve(row as RepoInfo)
      },
    )
  })
}



export const RemovePush = async (repoId: number, branch?: string) => {
  let client = await createClient()
  if (branch) {
    await client.run('DELETE FROM push WHERE repoId = ? AND branch = ?', [
      repoId,
      branch,
    ])
  } else {
    await client.run('DELETE FROM push WHERE repoId = ?', [
      repoId,
    ])
  }
}

export const UpdatePush = async (
  repoId: number,
  branch: string,
  commitSha: string,
) => {
  let client = await createClient()
  await client.run(
    'UPDATE push SET commitSha = ? WHERE repoId = ? AND branch = ?',
    [commitSha, repoId, branch],
  )
}
