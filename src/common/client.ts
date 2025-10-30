import { GitHubClient, GiteeClient, GitCodeClient, CnbClient } from 'nipaw';

export const client = {
  github: (() => {
    const client = new GitHubClient();
    client.setToken('<your token>');
    return client;
  })(),
  gitee: new GiteeClient(),
  gitcode: new GitCodeClient(),
  cnb: new CnbClient(),
};
