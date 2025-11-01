import { createClient } from './index';

let platform = "github"
export async function AddRepo(
  botId: string,
  groupId: string,
  owner: string,
  repo: string,
) {
  let client = await createClient();
  await client.run(
    'INSERT INTO push (platform, botId, groupId, owner, repo) VALUES (?, ?, ?, ?, ?)',
    [platform,botId, groupId, owner, repo],
  );
}

export async function GetAll(): Promise<SubscribedRepo[]> {
  let client = await createClient();
  const result = await new Promise<SubscribedRepo[]>((resolve, reject) => {
    client.all('SELECT * FROM push', (err, rows) => {
      if (err) reject(err);
      else resolve(rows as SubscribedRepo[]);
    });
  })
  return result
}

export async function GetRepo(botId: string, groupId: string, owner: string, repo: string): Promise<SubscribedRepo | null> {
  let client = await createClient();
  const result = await new Promise<SubscribedRepo | null>((resolve, reject) => {
    client.get(
      'SELECT * FROM push WHERE platform = ? AND botId = ? AND groupId = ? AND owner = ? AND repo = ?',
      [platform,botId, groupId, owner, repo],
      (err, row) => {
        if (err) reject(err);
        else if (row && Object.keys(row).length > 0) resolve(row as unknown as SubscribedRepo);
        else resolve(null);
      }
    );
  });
  return result;
}

export async function GetGroup(groupId: string): Promise<SubscribedRepo[]> { 
  let client = await createClient();
  const repos = await new Promise<SubscribedRepo[]>((resolve, reject) => {
    client.all(
      'SELECT * FROM push WHERE platform = ? AND groupId = ?',
      [platform, groupId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows as SubscribedRepo[]);
      }
    );
  });
  return repos;
}

export async function GetBot(botId: string): Promise<SubscribedRepo[]> { 
  let client = await createClient();
  const repos = await new Promise<SubscribedRepo[]>((resolve, reject) => {
    client.all(
      'SELECT * FROM push WHERE platform = ? AND botId = ?',
      [platform, botId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows as SubscribedRepo[]);
      }
    );
  });
  return repos;
}

export async function UpdateCommitSha(
  botId: string,
  groupId: string,
  owner: string,
  repo: string,
  commitSha: string,
) { 
  let client = await createClient();
  await client.run(
    'UPDATE push SET commitSha = ? WHERE platform = ? AND botId = ? AND groupId = ? AND owner = ? AND repo = ?',
    [platform, commitSha, botId, groupId, owner, repo],
  )
}
export async function UpdateDefaultBranch(
  botId: string,
  groupId: string,
  owner: string,
  repo: string,
  defaultBranch: string,
) { 
  let client = await createClient();
  await client.run(
    'UPDATE push SET defaultBranch = ? WHERE platform = ? AND botId = ? AND groupId = ? AND owner = ? AND repo = ?',
    [platform, defaultBranch, botId, groupId, owner, repo],
  )
}

export async function GetRepoDefaultBranch(
  botId: string,
  groupId: string,
  owner: string,
  repo: string
): Promise<string | null> {
  let client = await createClient();
  const result = await new Promise<string | null>((resolve, reject) => {
    client.get(
      'SELECT defaultBranch FROM push WHERE platform = ? AND botId = ? AND groupId = ? AND owner = ? AND repo = ?',
      [platform, botId, groupId, owner, repo],
      (err, row) => {
        if (err) reject(err);
        else resolve(row as string);
      }
    );
  });
  return result;
}