import { EventRepo, EventType, Platform } from '@/types'
import { createClient } from './index'

export async function AddRepo(
  platform: Platform,
  repoId: number,
  event: Array<EventType>,
) {
  let client = await createClient()
  const eventType = event.join(',')
  await client.run(
    'INSERT INTO event (platform,repoId, eventType) VALUES (?, ?, ?)',
    [platform, repoId, eventType],
  )
}

export async function GetAll(): Promise<Array<EventRepo>> {
  let client = await createClient()
  const result = await new Promise<Array<EventRepo>>((resolve, reject) => {
    client.all('SELECT * FROM event', [], (err, rows) => {
      if (err) reject(err)
      else resolve(rows as Array<EventRepo>)
    })
  })
  result.forEach((item) => {
    item.eventType = (item.eventType as unknown as string).split(
      ',',
    ) as Array<EventType>
  })
  return result
}

export async function GetRepo(
  platform: Platform,
  repoId: number,
): Promise<Array<EventRepo>> {
  let client = await createClient()
  const result = await new Promise<Array<EventRepo>>((resolve, reject) => {
    client.all(
      'SELECT * FROM event WHERE platform = ? AND repoId = ?',
      [platform, repoId],
      (err, rows) => {
        if (err) reject(err)
        else resolve(rows as Array<EventRepo>)
      },
    )
  })
  if (result) {
    result.forEach((item) => {
      item.eventType = (item.eventType as unknown as string).split(
        ',',
      ) as Array<EventType>
    })
  }
  return result
}

export async function RemoveRepo(
  platform: Platform,
  repoId: number,
): Promise<void> {
  let client = await createClient()
  await new Promise<void>((resolve, reject) => {
    client.run(
      'DELETE FROM event WHERE platform = ? AND repoId = ?',
      [platform, repoId],
      (err) => {
        if (err) reject(err)
        else resolve()
      },
    )
  })
}

export async function UpdateEventType(
  platform: Platform,
  repoId: number,
  event: Array<EventType>,
): Promise<void> {
  let client = await createClient()
  await new Promise<void>((resolve, reject) => {
    client.run(
      'UPDATE event SET eventType = ? WHERE platform = ? AND repoId = ?',
      [event, platform, repoId],
      (err) => {
        if (err) reject(err)
        else resolve()
      },
    )
  })
}
