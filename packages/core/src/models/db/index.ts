import { Version } from '@/root'
import { karinPathBase } from 'node-karin'
import sqlite, { type Database } from 'node-karin/sqlite3'

let dbClient: Database | null = null

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
      platform TEXT NOT NULL,
      owner TEXT NOT NULL,
      repo TEXT NOT NULL,
      createdAt DATETIME DEFAULT (datetime('now', 'localtime')),
      updatedAt DATETIME DEFAULT (datetime('now', 'localtime')), 
      UNIQUE(platform, owner, repo)
    )
  `)
  // 创建 session 表
  client.exec(`
    CREATE TABLE IF NOT EXISTS session (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      botId TEXT NOT NULL,
      groupId TEXT NOT NULL,
      createdAt DATETIME DEFAULT (datetime('now', 'localtime')),
      updatedAt DATETIME DEFAULT (datetime('now', 'localtime')), 
      UNIQUE(botId, groupId)
    )
  `)

  // 创建 push 表
  client.exec(`
    CREATE TABLE IF NOT EXISTS push (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      repoId INTEGER NOT NULL,
      sessionId INTEGER NOT NULL,
      branch TEXT NOT NULL,
      commitSha TEXT NOT NULL,
      createdAt DATETIME DEFAULT (datetime('now', 'localtime')),
      updatedAt DATETIME DEFAULT (datetime('now', 'localtime')), 
      FOREIGN KEY (repoId) REFERENCES repo(id) ON DELETE CASCADE,
      FOREIGN KEY (sessionId) REFERENCES session(id) ON DELETE CASCADE,
      UNIQUE(repoId, sessionId, branch, commitSha)
    )
  `)

  // 创建 bind 表
  client.exec(`
    CREATE TABLE IF NOT EXISTS bind (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      groupId TEXT NOT NULL,
      repoId INTEGER NOT NULL,
      createdAt DATETIME DEFAULT (datetime('now', 'localtime')),
      updatedAt DATETIME DEFAULT (datetime('now', 'localtime')), 
      FOREIGN KEY (repoId) REFERENCES repo(id) ON DELETE CASCADE,
      UNIQUE(groupId, repoId)
    )
  `)

  // 创建 release 表
  client.exec(`
    CREATE TABLE IF NOT EXISTS release (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      repoId INTEGER NOT NULL,
      sessionId INTEGER NOT NULL,
      tagName TEXT NOT NULL,
      createdAt DATETIME DEFAULT (datetime('now', 'localtime')),
      updatedAt DATETIME DEFAULT (datetime('now', 'localtime')), 
      FOREIGN KEY (repoId) REFERENCES repo(id) ON DELETE CASCADE,
      FOREIGN KEY (sessionId) REFERENCES session(id) ON DELETE CASCADE,
      UNIQUE(repoId, sessionId, tagName)
    )
  `)

  // 创建索引
  client.exec(
    `CREATE INDEX IF NOT EXISTS idx_session_lookup ON session(botId, groupId)`,
  )
  client.exec(`CREATE INDEX IF NOT EXISTS idx_repo_lookup ON repo(platform, owner, repo)`)
  client.exec(
    `CREATE INDEX IF NOT EXISTS idx_push_branch ON push(repoId, branch)`,
  )
}

export * as push from './push'
export * as session from './session'
export * as bind from './bind'
export * as repo from './repo'
