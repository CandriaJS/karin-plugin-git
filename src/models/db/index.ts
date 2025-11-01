import { Version } from '@/root';
import { karinPathBase } from 'node-karin';
import sqlite from 'node-karin/sqlite3';

let dbClient: sqlite.Database | null = null;

export const createClient = async () => {
  if (!dbClient) {
    const dbPath = `${karinPathBase}/${Version.Plugin_Name}/data`;
    dbClient = new sqlite.Database(`${dbPath}/data.db`);
  }
  return dbClient;
};

/// 初始化数据库
export const InitDb = async () => {
  const client = await createClient();
  client.exec(`
    CREATE TABLE IF NOT EXISTS push (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT NOT NULL,
      botId TEXT NOT NULL,
      groupId TEXT NOT NULL,
      owner TEXT NOT NULL,
      repo TEXT NOT NULL,
      defaultBranch TEXT,
      commitSha TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(botId, groupId, owner, repo)
    )
  `);
};

export * as github from './github';
