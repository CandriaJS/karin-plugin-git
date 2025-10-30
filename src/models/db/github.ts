import { createClient } from './index';

export async function AddRepo(
  botId: string,
  groupId: string,
  owner: string,
  repo: string,
) {
  let client = await createClient();
  await client.run(
    'INSERT INTO github (botId, groupId, owner, repo) VALUES (?, ?, ?, ?)',
    [botId, groupId, owner, repo],
  );
}

export async function GetAll(): Promise<SubscribedRepo[]> {
  let client = await createClient();
  const result = await new Promise<SubscribedRepo[]>((resolve, reject) => {
    client.all('SELECT * FROM github', (err, rows) => {
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
      'SELECT * FROM github WHERE botId = ? AND groupId = ? AND owner = ? AND repo = ?',
      [botId, groupId, owner, repo],
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
      'SELECT * FROM github WHERE groupId = ?',
      [groupId],
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
      'SELECT * FROM github WHERE botId = ?',
      [botId],
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
    'UPDATE github SET commitSha = ? WHERE botId = ? AND groupId = ? AND owner = ? AND repo = ?',
    [commitSha, botId, groupId, owner, repo],
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
    'UPDATE github SET defaultBranch = ? WHERE botId = ? AND groupId = ? AND owner = ? AND repo = ?',
    [defaultBranch, botId, groupId, owner, repo],
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
      'SELECT defaultBranch FROM github WHERE botId = ? AND groupId = ? AND owner = ? AND repo = ?',
      [botId, groupId, owner, repo],
      (err, row) => {
        if (err) reject(err);
        else resolve(row as string);
      }
    );
  });
  return result;
}