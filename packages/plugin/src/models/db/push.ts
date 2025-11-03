import { Platform } from '@/types';
import { PushRepo } from '@/types/db';
import { createClient } from './index';

export async function AddRepo(
  platform: Platform,
  repoId: number,
  branch: string,
) {
  let client = await createClient();

  await client.run(
    'INSERT INTO push (platform,repoId, branch) VALUES (?, ?, ?)',
    [platform, repoId, branch],
  );
}

export async function GetAll(): Promise<PushRepo[]> {
  let client = await createClient();
  const result = await new Promise<PushRepo[]>((resolve, reject) => {
    client.all('SELECT * FROM push', [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows as PushRepo[]);
    });
  });
  return result;
}

export async function GetRepo(
  platform: Platform,
  repoId: number,
  branch: string,
): Promise<PushRepo | null> {
  let client = await createClient();
  const result = await new Promise<PushRepo | null>((resolve, reject) => {
    client.get(
      'SELECT * FROM push WHERE platform = ? AND repoId = ? AND branch = ?',
      [platform, repoId, branch], (err, row) => {
        if (err) reject(err);
        else resolve(row as PushRepo);
      },
    );
  });
  return result;
}

export async function UpdateCommitSha(
  platform: Platform,
  repoId: number,
  branch: string,
  commitSha: string,
) {
  let client = await createClient();
  await client.run(
    'UPDATE push SET commitSha = ? WHERE platform = ? AND repoId = ? AND branch = ?',
    [commitSha, platform, repoId, branch],
  );
}
