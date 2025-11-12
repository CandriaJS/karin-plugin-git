import { StateType } from 'nipaw'
import { createClient } from './index'
import { Platform, IssueRepo } from '@/types'

export async function AddRepo(platform: Platform, repoId: number): Promise<void>

export async function AddRepo(
  platform: Platform,
  repoId: number,
  issueId: string,
  title: string,
  body: string | null,
  state: StateType,
): Promise<void>

export async function AddRepo(
  platform: Platform,
  repoId: number,
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
      'INSERT INTO issue (platform, repoId, issueId, title, body, state) VALUES (?, ?, ?, ?, ?, ?)',
      [platform, repoId, issueId, title, body, state],
    )
  } else {
    await client.run('INSERT INTO issue (platform, repoId) VALUES (?, ?)', [
      platform,
      repoId,
    ])
  }
}

export async function GetAll(): Promise<IssueRepo[]> {
  let client = await createClient()

  return await new Promise<IssueRepo[]>((resolve, reject) => {
      client.all('SELECT * FROM issue', [], (err, rows) => {
        if (err) reject(err)
        else resolve(rows as IssueRepo[])
      })
    });

}

export async function GetRepo(
  platform: Platform,
  repoId: number,
): Promise<IssueRepo[]>

export async function GetRepo(
  platform: Platform,
  repoId: number,
  issueId: string,
): Promise<IssueRepo | null>

export async function GetRepo(
  platform: Platform,
  repoId: number,
  issueId?: string,
): Promise<IssueRepo[] | IssueRepo | null> {
  let client = await createClient()
  if (issueId != undefined) {
    return await new Promise<IssueRepo | null>((resolve, reject) => {
          client.get(
            'SELECT * FROM issue WHERE platform = ? AND repoId = ? AND issueId = ?',
            [platform, repoId, issueId],
            (err, rows) => {
              if (err) reject(err)
              else resolve(rows as unknown as IssueRepo | null)
            },
          )
        });

  } else {
    return await new Promise<IssueRepo[]>((resolve, reject) => {
          client.all(
            'SELECT * FROM issue WHERE platform = ? AND repoId = ?',
            [platform, repoId],
            (err, rows) => {
              if (err) reject(err)
              else resolve(rows as IssueRepo[])
            },
          )
        });

  }
}

export async function RemoveRepo(
  platform: Platform,
  repoId: number,
): Promise<void>

export async function RemoveRepo(
  platform: Platform,
  repoId: number,
  issueId: string,
): Promise<void>

export async function RemoveRepo(
  platform: Platform,
  repoId: number,
  issueId?: string,
): Promise<void> {
  let client = await createClient()
  if (issueId != undefined) {
    await new Promise<void>((resolve, reject) => {
      client.run(
        'DELETE FROM issue WHERE platform = ? AND repoId = ? AND issueId = ?',
        [platform, repoId, issueId],
        (err) => {
          if (err) reject(err)
          else resolve()
        },
      )
    })
  } else {
    await new Promise<void>((resolve, reject) => {
      client.run(
        'DELETE FROM issue WHERE platform = ? AND repoId = ?',
        [platform, repoId],
        (err) => {
          if (err) reject(err)
          else resolve()
        },
      )
    })
  }
}

export async function UpdateState(
  platform: Platform,
  repoId: number,
  issueId: string,
  state: StateType,
) {
  let client = await createClient()
  await new Promise<void>((resolve, reject) => {
    client.run(
      'UPDATE issue SET state = ? WHERE platform = ? AND repoId = ? AND issueId = ?',
      [state, platform, repoId, issueId],
      (err) => {
        if (err) reject(err)
        else resolve()
      },
    )
  })
}
