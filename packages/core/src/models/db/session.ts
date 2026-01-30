import { db } from '@/types'
import { createClient } from './index'

type SessionInfo = db.SessionInfo

export const AddSession = async (botId: string, groupId: string) => {
  const client = await createClient()
  await client.run('INSERT INTO session (botId,groupId) VALUES (?,?)', [
    botId,
    groupId,
  ])
}
export const GetAll = async () => {
  const client = await createClient()
  return await new Promise<SessionInfo[]>((resolve, reject) => {
    client.all('SELECT * FROM session', (err, rows) => {
      if (err) reject(err)
      else resolve(rows as SessionInfo[])
    })
  })
}

type GetSession = {
  (id: number): Promise<SessionInfo | null>
  (botId: string, groupId: string): Promise<SessionInfo | null>
}

export const GetSession: GetSession = async (IdOrBotId: number | string, groupId?: string) => {
  const client = await createClient()
  if (typeof IdOrBotId === 'string') {
    return await new Promise<SessionInfo | null>((resolve, reject) => {
      client.get(
        'SELECT * FROM session WHERE botId = ? AND groupId = ?',
        [IdOrBotId, groupId],
        (err, row) => {
          if (err) reject(err)
          else resolve(row as SessionInfo)
        },
      )
    })
  }
  return await new Promise<SessionInfo | null>((resolve, reject) => {
    client.get(
      'SELECT * FROM session WHERE id = ?',
      [IdOrBotId],
      (err, row) => {
        if (err) reject(err)
        else resolve(row as SessionInfo)
      },
    )
  })
}

export const RemoveSession = async (botId: number, groupId: number) => {
  const client = await createClient()
  await client.run('DELETE FROM session WHERE botId = ? AND groupId = ?', [
    botId,
    groupId,
  ])
}
