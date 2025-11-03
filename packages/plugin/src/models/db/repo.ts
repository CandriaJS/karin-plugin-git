import { createClient } from '.';
import { RepoInfo } from '@/types/db';

export async function AddRepo(
  botId: string,
  groupId: string,
  owner: string,
  repo: string,
) {
  let client = await createClient();
  await client.run(
    'INSERT INTO repo (owner, repo, botId, groupId) VALUES (?, ?, ?, ?)',
    [owner, repo, botId, groupId],
  );
}

export async function GetAll(): Promise<RepoInfo[]> {
  let client = await createClient();
  const result = await new Promise<RepoInfo[]>((resolve, reject) => {
    client.all('SELECT * FROM repo', (err, rows) => {
      if (err) reject(err);
      else resolve(rows as RepoInfo[]);
    });
  });
  return result;
}


export async function GetRepo(repoId: number): Promise<RepoInfo | null>;

export async function GetRepo(botId: string, groupId: string, owner: string, repo: string): Promise<RepoInfo | null>;
export async function GetRepo(...args: [number] | [string, string, string, string]): Promise<RepoInfo | null> {
  let client = await createClient();
  
  if (args.length === 1) {
    const [id] = args;
    const result = await new Promise<RepoInfo | null>((resolve, reject) => {
      client.get(
        'SELECT * FROM repo WHERE id = ?',
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row as RepoInfo);
        }
      );
    });
    return result;
  } else {
    const [botId, groupId, owner, repo] = args;
    const result = await new Promise<RepoInfo | null>((resolve, reject) => {
      client.get(
        'SELECT * FROM repo WHERE owner = ? AND repo = ? AND botId = ? AND groupId = ?',
        [owner, repo, botId, groupId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row as RepoInfo);
        }
      );
    });
    return result;
  }
}
export async function GetGroupRepo(groupId: string): Promise<RepoInfo[]> {
  let client = await createClient();
  const result = await new Promise<RepoInfo[]>((resolve, reject) => {
    client.get(
      'SELECT * FROM repo WHERE groupId = ?',
      [groupId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row as RepoInfo[]);
      },
    );
  });
  return result;
}
