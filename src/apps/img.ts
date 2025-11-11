import { Client, formatDate, Render } from '@/common'
import karin from 'node-karin'

export const github = karin.command(/^img$/i, async (e) => {
  const client = Client.github()
  const issueInfo = await client.getIssueInfo('KarinJS', 'Karin', '540')
  const issue = {
    ...issueInfo,
    owner: 'KarinJS',
    repo: 'Karin',
    title: await Render.markdown(issueInfo.title),
    body: issueInfo.body ? await Render.markdown(issueInfo.body) : null,
    issueDate: formatDate(issueInfo.createdAt),
  }
  console.log(issueInfo)
  const img = await Render.render('issue/index', {
    issue,
  })
  await e.reply(img)
})
