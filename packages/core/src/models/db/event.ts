import { EventRepo, EventType } from '@/types'
import { createClient } from './index'
import { Platform } from '@candriajs/template'

export async function AddRepo(
  platform: Platform,
  repoId: number,
  event: Array<EventType>,
) {
  let client = await createClient()
  const eventType = event.join(',')
  await client.run(
    'INSERT INTO event (platform,repoId, eventType) VALUES (?, ?, ?)',
    [platform.toString().toLowerCase(), repoId, eventType],
  )
}

export async function GetAll(platform: Platform): Promise<Array<EventRepo>>

export async function GetAll(
  platform: Platform,
  eventType: EventType,
): Promise<Array<EventRepo>>

export async function GetAll(): Promise<Array<EventRepo>>

export async function GetAll(
  platform?: Platform,
  eventType?: EventType,
): Promise<Array<EventRepo>> {
  let client = await createClient()

  let query = 'SELECT * FROM event'
  const params: (Platform | EventType | string)[] = []

  if (platform !== undefined) {
    query += ' WHERE platform = ?'
    params.push(platform.toString().toLowerCase())

    if (eventType !== undefined) {
      query += ' AND eventType = ?'
      params.push(eventType)
    }
  } else if (eventType !== undefined) {
    query += ' WHERE eventType = ?'
    params.push(eventType)
  }

  const result = await new Promise<Array<EventRepo>>((resolve, reject) => {
    client.all(query, params, (err: Error, rows: EventRepo[]) => {
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
): Promise<Array<EventRepo>>

export async function GetRepo(
  platform: Platform,
  repoId: number,
  eventType: Array<EventType> | EventType,
): Promise<EventRepo | null>
export async function GetRepo(
  platform: Platform,
  repoId: number,
  eventType?: Array<EventType> | EventType,
): Promise<Array<EventRepo> | EventRepo | null> {
  let client = await createClient()

  if (eventType) {
    const result = await new Promise<Array<EventRepo>>((resolve, reject) => {
      client.all(
        'SELECT * FROM event WHERE platform = ? AND repoId = ?',
        [platform.toString().toLowerCase(), repoId],
        (err: Error, rows: EventRepo[]) => {
          if (err) reject(err)
          else resolve(rows as Array<EventRepo>)
        },
      )
    })

    if (result && result.length > 0) {
      const event = Array.isArray(eventType) ? eventType : [eventType]
      const filtered = result.filter((item) => {
        const itemEvents = (item.eventType as unknown as string).split(
          ',',
        ) as Array<EventType>
        return event.some((event) => itemEvents.includes(event))
      })
      filtered.forEach((item) => {
        item.eventType = (item.eventType as unknown as string).split(
          ',',
        ) as Array<EventType>
      })

      return filtered.length > 0 ? filtered[0] : null
    }
    return null
  } else {
    const result = await new Promise<Array<EventRepo>>((resolve, reject) => {
      client.all(
        'SELECT * FROM event WHERE platform = ? AND repoId = ?',
        [platform.toString().toLowerCase(), repoId],
        (err: Error, rows: EventRepo[]) => {
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
      (err: Error) => {
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
  const eventType = event.join(',')
  await new Promise<void>((resolve, reject) => {
    client.run(
      'UPDATE event SET eventType = ? WHERE platform = ? AND repoId = ?',
      [eventType, platform.toString().toLowerCase(), repoId],
      (err: any) => {
        if (err) reject(err)
        else resolve()
      },
    )
  })
}
