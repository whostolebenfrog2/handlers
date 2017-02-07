import {Atomist, Message} from '@atomist/rug/operations/Handler'
import {TreeNode} from '@atomist/rug/tree/PathExpression'
declare var atomist: Atomist

atomist.on<TreeNode, TreeNode>("/issue[.state()='open']", m => {
   let issue = m.root() as any
   let message = atomist.messageBuilder().regarding(issue)

   bindIssueActions(message, issue.number(), issue.repo().owner(), issue.repo().name()).send()
})

atomist.on<TreeNode, TreeNode>("/issue[.state()='closed']", m => {
   let issue = m.root() as any
   let message = atomist.messageBuilder().regarding(issue)
   let registry = message.actionRegistry()

   let reopen = registry.findByName("ReopenIssue|Reopen")
   reopen = registry.bindParameter(reopen, "number", issue.number())
   reopen = registry.bindParameter(reopen, "repo", issue.repo().name())
   reopen = registry.bindParameter(reopen, "owner", issue.repo().owner())
   message.withAction(reopen)

   message.send()
})

atomist.on<TreeNode, TreeNode>("/comment", m => {
   let issueComment = m.root() as any
   let message = atomist.messageBuilder().regarding(issueComment)

   bindIssueActions(message, issueComment.on().number(), issueComment.repo().owner(), issueComment.repo().name()).send()
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
