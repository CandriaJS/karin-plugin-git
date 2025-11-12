import { Version } from '@/root'
import { karinPathBase } from 'node-karin'
import sqlite from 'node-karin/sqlite3'

let dbClient: sqlite.Database | null = null

export const createClient = async () => {
  if (!dbClient) {
    const dbPath = `${karinPathBase}/${Version.Plugin_Name}/data`
    dbClient = new sqlite.Database(`${dbPath}/data.db`)
  }
  return dbClient
}

/**
 * 初始化数据库
 */
export const InitDb = async () => {
  const client = await createClient()

  // 创建 repo 表
  client.exec(`
    CREATE TABLE IF NOT EXISTS repo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner TEXT NOT NULL,
      repo TEXT NOT NULL,
      botId TEXT NOT NULL,
      groupId TEXT NOT NULL,
      createdAt DATETIME DEFAULT (datetime('now', 'localtime')),
      updatedAt DATETIME DEFAULT (datetime('now', 'localtime')), 
      UNIQUE(owner, repo, botId, groupId)
    )
  `)

  // 创建 event 表
  client.exec(`
    CREATE TABLE IF NOT EXISTS event (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      repoId INTEGER NOT NULL,
      platform TEXT NOT NULL,
      eventType TEXT NOT NULL,
      createdAt DATETIME DEFAULT (datetime('now', 'localtime')),
      updatedAt DATETIME DEFAULT (datetime('now', 'localtime')), 
      FOREIGN KEY (repoId) REFERENCES repo(id) ON DELETE CASCADE
    )
  `)

  // 创建 push 表
  client.exec(`
    CREATE TABLE IF NOT EXISTS push (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      eventId INTEGER NOT NULL,
      branch TEXT NOT NULL,
      commitSha TEXT,
      createdAt DATETIME DEFAULT (datetime('now', 'localtime')),
      updatedAt DATETIME DEFAULT (datetime('now', 'localtime')), 
      FOREIGN KEY (eventId) REFERENCES event(id) ON DELETE CASCADE
    )
  `)

  // 创建 issue 表
  client.exec(`
    CREATE TABLE IF NOT EXISTS issue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      eventId INTEGER NOT NULL,
      issueId TEXT NOT NULL,
      title TEXT,
      body TEXT,
      state TEXT,
      createdAt DATETIME DEFAULT (datetime('now', 'localtime')),
      updatedAt DATETIME DEFAULT (datetime('now', 'localtime')), 
      FOREIGN KEY (eventId) REFERENCES event(id) ON DELETE CASCADE
    )
  `)

  // 创建索引
  client.exec(
    `CREATE INDEX IF NOT EXISTS idx_repo_lookup ON repo(botId, groupId)`,
  )
  client.exec(`CREATE INDEX IF NOT EXISTS idx_push_event ON push(eventId)`)
  client.exec(`CREATE INDEX IF NOT EXISTS idx_issue_event ON issue(eventId)`)
  client.exec(`CREATE INDEX IF NOT EXISTS idx_event_repo ON event(repoId)`)
  client.exec(
    `CREATE INDEX IF NOT EXISTS idx_event_platform ON event(platform)`,
  )
  client.exec(`CREATE INDEX IF NOT EXISTS idx_event_type ON event(eventType)`)
}

export * as push from './push'
export * as repo from './repo'
export * as issue from './issue'
export * as event from './event'
