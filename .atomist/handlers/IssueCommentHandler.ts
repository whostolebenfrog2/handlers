import {Atomist, MessageBuilder} from '@atomist/rug/operations/Handler'
import {TreeNode} from '@atomist/rug/tree/PathExpression'
declare var atomist: Atomist

atomist.on<TreeNode, TreeNode>("/comment", m => {
   let comment = m.root() as any
   let mb = atomist.messageBuilder()
   sendDirectMessage(
     comment, `${comment.by().login()} commented on https://github.com/${comment.on().repo().owner()}/${comment.on().repo().name()}/issues/${comment.on().number()} ${comment.on().title()}\n> ${comment.body()}`, mb)
})

function sendDirectMessage(comment: any, message: string, mb: MessageBuilder) {
  let who = comment.on().by().person()
  if (who != null) {
      mb.say(message).on(who.chatIdentity().chatId()).send()
  }
}
