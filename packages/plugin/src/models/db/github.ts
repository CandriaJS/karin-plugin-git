import { SubscribedRepo } from '@/types/db';
import { createClient } from './index';
import { Platform } from '@/types';

export async function AddRepo(
  botId: string,
  groupId: string,
  owner: string,
  repo: string,
  branch: string,
) {
  let client = await createClient();
  await client.run(
    'INSERT INTO push (platform, botId, groupId, owner, repo, branch) VALUES (?, ?, ?, ?, ?, ?)',
    [Platform.GitHub, botId, groupId, owner, repo, branch],
  );
}

export async function GetAll(): Promise<SubscribedRepo[]> {
  let client = await createClient();
  const result = await new Promise<SubscribedRepo[]>((resolve, reject) => {
    client.all('SELECT * FROM push', (err, rows) => {
      if (err) reject(err);
      else resolve(rows as SubscribedRepo[]);
    });
  });
  return result;
}

export async function GetRepo(
  botId: string,
  groupId: string,
  owner: string,
  repo: string,
): Promise<SubscribedRepo | null> {
  let client = await createClient();
  const result = await new Promise<SubscribedRepo | null>((resolve, reject) => {
    client.get(
      'SELECT * FROM push WHERE platform = ? AND botId = ? AND groupId = ? AND owner = ? AND repo = ?',
      [Platform.GitHub, botId, groupId, owner, repo],
      (err, row) => {
        if (err) reject(err);
        else resolve(row as unknown as SubscribedRepo);
      },
    );
  });
  return result;
}

export async function GetGroup(groupId: string): Promise<SubscribedRepo[]> {
  let client = await createClient();
  const repos = await new Promise<SubscribedRepo[]>((resolve, reject) => {
    client.all(
      'SELECT * FROM push WHERE platform = ? AND groupId = ?',
      [Platform.GitHub, groupId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows as SubscribedRepo[]);
      },
    );
  });
  return repos;
}

export async function GetBot(botId: string): Promise<SubscribedRepo[]> {
  let client = await createClient();
  const repos = await new Promise<SubscribedRepo[]>((resolve, reject) => {
    client.all(
      'SELECT * FROM push WHERE platform = ? AND botId = ?',
      [Platform.GitHub, botId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows as SubscribedRepo[]);
      },
    );
  });
  return repos;
}

export async function GetRepoBranch(
  botId: string,
  groupId: string,
  owner: string,
  repo: string,
): Promise<string | null> {
  let client = await createClient();
  const result = await new Promise<string | null>((resolve, reject) => {
    client.get(
      'SELECT branch FROM push WHERE platform = ? AND botId = ? AND groupId = ? AND owner = ? AND repo = ?',
      [Platform.GitHub, botId, groupId, owner, repo],
      (err, row) => {
        if (err) reject(err);
        else resolve(row as string);
      },
    );
  });
  return result;
}

export async function UpdateCommitSha(
  botId: string,
  groupId: string,
  owner: string,
  repo: string,
  branch: string,
  commitSha: string,
) {
  let client = await createClient();
  await client.run(
    'UPDATE push SET commitSha = ? WHERE platform = ? AND botId = ? AND groupId = ? AND owner = ? AND repo = ? AND branch = ?',
    [commitSha, Platform.GitHub, botId, groupId, owner, repo, branch],
  );
}