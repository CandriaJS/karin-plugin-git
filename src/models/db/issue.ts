import { StateType } from 'nipaw'
import { createClient } from './index'
import { IssueRepo } from '@/types'

export async function AddRepo(eventId: number): Promise<void>

export async function AddRepo(
  eventId: number,
  issueId: string,
  title: string,
  body: string | null,
  state: StateType,
): Promise<void>

export async function AddRepo(
  eventId: number,
  issueId?: string,
  title?: string,
  body?: string | null,
  state?: StateType,
): Promise<void> {
  let client = await createClient()

  if (
    issueId !== undefined &&
    title !== undefined &&
    body !== undefined &&
    state !== undefined
  ) {
    await client.run(
      'INSERT INTO issue (eventId, issueId, title, body, state) VALUES (?, ?, ?, ?, ?)',
      [eventId, issueId, title, body, state],
    )
  } else {
    await client.run('INSERT INTO issue (eventId) VALUES (?)', [eventId])
  }
}

export async function GetAll(): Promise<IssueRepo[]> {
  let client = await createClient()

  return await new Promise<IssueRepo[]>((resolve, reject) => {
    client.all('SELECT * FROM issue', [], (err, rows) => {
      if (err) reject(err)
      else resolve(rows as IssueRepo[])
    })
  })
}

export async function GetRepo(eventId: number): Promise<IssueRepo[]>

export async function GetRepo(
  eventId: number,
  issueId: string,
): Promise<IssueRepo | null>

export async function GetRepo(
  eventId: number,
  issueId?: string,
): Promise<IssueRepo[] | IssueRepo | null> {
  let client = await createClient()
  if (issueId != undefined) {
    return await new Promise<IssueRepo | null>((resolve, reject) => {
      client.get(
        'SELECT * FROM issue WHERE eventId = ? AND issueId = ?',
        [eventId, issueId],
        (err, rows) => {
          if (err) reject(err)
          else resolve(rows as unknown as IssueRepo | null)
        },
      )
    })
  } else {
    return await new Promise<IssueRepo[]>((resolve, reject) => {
      client.all(
        'SELECT * FROM issue WHERE eventId = ?',
        [eventId],
        (err, rows) => {
          if (err) reject(err)
          else resolve(rows as IssueRepo[])
        },
      )
    })
  }
}

export async function RemoveRepo(eventId: number): Promise<void>

export async function RemoveRepo(
  eventId: number,
  issueId: string,
): Promise<void>

export async function RemoveRepo(
  eventId: number,
  issueId?: string,
): Promise<void> {
  let client = await createClient()
  if (issueId != undefined) {
    await new Promise<void>((resolve, reject) => {
      client.run(
        'DELETE FROM issue WHERE eventId = ? AND issueId = ?',
        [eventId, issueId],
        (err) => {
          if (err) reject(err)
          else resolve()
        },
      )
    })
  } else {
    await new Promise<void>((resolve, reject) => {
      client.run('DELETE FROM issue WHERE eventId = ?', [eventId], (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  }
}

export async function UpdateState(
  eventId: number,
  issueId: string,
  state: StateType,
) {
  let client = await createClient()
  await new Promise<void>((resolve, reject) => {
    client.run(
      'UPDATE issue SET state = ? WHERE eventId = ? AND issueId = ?',
      [state, eventId, issueId],
      (err) => {
        if (err) reject(err)
        else resolve()
      },
    )
  })
}
