import {Atomist, Message} from '@atomist/rug/operations/Handler'
import {TreeNode} from '@atomist/rug/tree/PathExpression'
declare var atomist: Atomist

atomist.on<TreeNode, TreeNode>("/Issue()[.state()='open'][/resolvedBy::Commit()/author::GitHubId()[/hasGithubIdentity::Person()/hasChatIdentity::ChatId()]?]?[/by::GitHubId()[/hasGithubIdentity::Person()/hasChatIdentity::ChatId()]?][/belongsTo::Repo()/channel::ChatChannel()]", m => {
   let issue = m.root() as any
   let message = atomist.messageBuilder().regarding(issue)

   let cid = "issue/" + issue.belongsTo().owner() + "/" + issue.belongsTo().name() + "/" + issue.number()
   
   bindIssueActions(message, issue.number(), issue.belongsTo().owner(), issue.belongsTo().name()).withCorrelationId(cid).send()
})

atomist.on<TreeNode, TreeNode>("/Issue()[.state()='closed'][/resolvedBy::Commit()/author::GitHubId()[/hasGithubIdentity::Person()/hasChatIdentity::ChatId()]?]?[/by::GitHubId()[/hasGithubIdentity::Person()/hasChatIdentity::ChatId()]?][/belongsTo::Repo()/channel::ChatChannel()]", m => {
   let issue = m.root() as any
   let message = atomist.messageBuilder().regarding(issue)
   let registry = message.actionRegistry()

   let reopen = registry.findByName("ReopenIssue|Reopen")
   reopen = registry.bindParameter(reopen, "number", issue.number())
   reopen = registry.bindParameter(reopen, "repo", issue.belongsTo().name())
   reopen = registry.bindParameter(reopen, "owner", issue.belongsTo().owner())
   message.withAction(reopen)
   
   let cid = "issue/" + issue.belongsTo().owner() + "/" + issue.belongsTo().name() + "/" + issue.number()

   message.send().withCorrelationId(cid)
})

atomist.on<TreeNode, TreeNode>("/Comment()[/by::GitHubId()[/hasGithubIdentity::Person()/hasChatIdentity::ChatId()]?][/on::Issue()[/belongsTo::Repo()/channel::ChatChannel()][/by::GitHubId()[/hasGithubIdentity::Person()/hasChatIdentity::ChatId()]?][/resolvedBy::Commit()/author::GitHubId()[/hasGithubIdentity::Person()/hasChatIdentity::ChatId()]?]?]", m => {
   let comment = m.root() as any
   let message = atomist.messageBuilder().regarding(comment)

   let cid = "comment/" + comment.on().belongsTo().owner() + "/" + comment.on().belongsTo().name() + "/" + comment.on().number() + "/" + comment.id()

   bindIssueActions(message, comment.on().number(), comment.on().belongsTo().owner(), comment.on().belongsTo().name()).withCorrelationId(cid).send()
})

function bindIssueActions(message: Message, number: number, owner: string, repo: string): Message {
  let registry = message.actionRegistry()

  let assign = registry.findByName("AssignIssue|Assign")
  assign = registry.bindParameter(assign, "number", number)
  assign = registry.bindParameter(assign, "repo", repo)
  assign = registry.bindParameter(assign, "owner", owner)
  message.withAction(assign)

  let bug = registry.findByName("LabelIssue|Bug")
  bug = registry.bindParameter(bug, "number", number)
  bug = registry.bindParameter(bug, "label", "bug")
  bug = registry.bindParameter(bug, "repo", repo)
  bug = registry.bindParameter(bug, "owner", owner)
  message.withAction(bug)

  let enhancement = registry.findByName("LabelIssue|Enhancement")
  enhancement = registry.bindParameter(enhancement, "number", number)
  enhancement = registry.bindParameter(enhancement, "label", "enhancement")
  enhancement = registry.bindParameter(enhancement, "repo", repo)
  enhancement = registry.bindParameter(enhancement, "owner", owner)
  message.withAction(enhancement)

  let close = registry.findByName("CloseIssue|Close")
  close = registry.bindParameter(close, "number", number)
  close = registry.bindParameter(close, "repo", repo)
  close = registry.bindParameter(close, "owner", owner)
  message.withAction(close)

  let comment = registry.findByName("CommentIssue|Comment")
  comment = registry.bindParameter(comment, "number", number)
  comment = registry.bindParameter(comment, "repo", repo)
  comment = registry.bindParameter(comment, "owner", owner)
  message.withAction(comment)

  return message

}
