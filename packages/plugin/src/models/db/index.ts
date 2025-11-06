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
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(owner, repo, botId, groupId)
    )
  `)

  // 创建 push 表
  client.exec(`
    CREATE TABLE IF NOT EXISTS push (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      repoId INTEGER NOT NULL,
      platform TEXT NOT NULL,
      branch TEXT NOT NULL,
      commitSha TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (repoId) REFERENCES repo(id) ON DELETE CASCADE
    )
  `)

  // 创建索引
  client.exec(
    `CREATE INDEX IF NOT EXISTS idx_repo_lookup ON repo(botId, groupId)`,
  )
  client.exec(`CREATE INDEX IF NOT EXISTS idx_push_repo ON push(repoId)`)
  client.exec(`CREATE INDEX IF NOT EXISTS idx_push_platform ON push(platform)`)
}

export * as push from './push'
export * as repo from './repo'
