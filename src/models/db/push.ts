import { PushRepo } from '@/types/db'
import { createClient } from './index'

export async function AddRepo(eventId: number, branch: string) {
  let client = await createClient()

  await client.run('INSERT INTO push (eventId, branch) VALUES (?, ?)', [
    eventId,
    branch,
  ])
}

export async function GetAll(): Promise<PushRepo[]> {
  let client = await createClient()
  const result = await new Promise<PushRepo[]>((resolve, reject) => {
    client.all('SELECT * FROM push', [], (err, rows) => {
      if (err) reject(err)
      else resolve(rows as PushRepo[])
    })
  })
  return result
}

export async function GetRepo(
  eventId: number,
  branch: string,
): Promise<PushRepo | null>

export async function GetRepo(eventId: number): Promise<Array<PushRepo>>

export async function GetRepo(
  eventId: number,
  branch?: string,
): Promise<PushRepo | null | Array<PushRepo>> {
  let client = await createClient()
  if (branch != undefined) {
    return await new Promise<PushRepo | null>((resolve, reject) => {
      client.get(
        'SELECT * FROM push WHERE eventId = ? AND branch = ?',
        [eventId, branch],
        (err, row) => {
          if (err) reject(err)
          else resolve(row as PushRepo)
        },
      )
    })
  } else {
    return await new Promise<Array<PushRepo>>((resolve, reject) => {
      client.all(
        'SELECT * FROM push WHERE eventId = ?',
        [eventId],
        (err, rows) => {
          if (err) reject(err)
          else resolve(rows as PushRepo[])
        },
      )
    })
  }
}

export async function RemoveRepo(eventId: number): Promise<void>

export async function RemoveRepo(eventId: number, branch: string): Promise<void>
export async function RemoveRepo(
  eventId: number,
  branch?: string,
): Promise<void> {
  let client = await createClient()
  if (branch) {
    await new Promise<void>((resolve, reject) => {
      client.run(
        'DELETE FROM push WHERE eventId = ? AND branch = ?',
        [eventId, branch],
        (err) => {
          if (err) reject(err)
          else resolve()
        },
      )
    })
  } else {
    await new Promise<void>((resolve, reject) => {
      client.run('DELETE FROM push WHERE eventId = ?', [eventId], (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  }
}

export async function UpdateCommitSha(
  eventId: number,
  branch: string,
  commitSha: string,
) {
  let client = await createClient()
  await client.run(
    'UPDATE push SET commitSha = ? WHERE eventId = ? AND branch = ?',
    [commitSha, eventId, branch],
  )
}
