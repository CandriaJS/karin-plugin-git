import { db } from '@/types'
import { createClient } from './index'

type BindInfo = db.BindInfo

export const AddBind = async (groupId: string, repoId: number) => {
  const client = await createClient()
  await client.run('INSERT INTO bind (groupId, repoId) VALUES (?, ?)', [
    groupId,
    repoId,
  ])
}

export const GetAll = async () => {
  const client = await createClient()
  return await new Promise<BindInfo[]>((resolve, reject) => {
    client.all('SELECT * FROM bind', [], (err, rows) => {
      if (err) reject(err)
      else resolve(rows as BindInfo[])
    })
  })
}

export const GetBind = async (groupId: string): Promise<BindInfo | null> => {
  const client = await createClient()
  return await new Promise<BindInfo | null>((resolve, reject) => {
    client.get(
      'SELECT * FROM bind WHERE groupId = ?',
      [groupId],
      (err, row) => {
        if (err) reject(err)
        else resolve(row as BindInfo)
      },
    )
  })
}

export const RemoveBind = async (groupId: string, repoId: number) => {
  const client = await createClient()
  await client.run('DELETE FROM bind WHERE groupId = ? AND repoId = ?', [
    groupId,
    repoId,
  ])
}
