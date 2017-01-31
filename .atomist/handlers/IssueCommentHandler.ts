import {Atomist, MessageBuilder} from '@atomist/rug/operations/Handler'
import {TreeNode} from '@atomist/rug/tree/PathExpression'
declare var atomist: Atomist

atomist.on<TreeNode, TreeNode>("/comment", m => {
   let comment = m.root() as any
   let mb = atomist.messageBuilder()
   if (comment.on() != comment.by()) {
   sendDirectMessage(comment.on().by().person(),
     comment, `${comment.by().login()} commented on https://github.com/${comment.on().repo().owner()}/${comment.on().repo().name()}/issues/${comment.on().number()} ${comment.on().title()}\n> ${comment.body()}`, mb)
   }
})

function sendDirectMessage(who: any, comment: any, message: string, mb: MessageBuilder) {
  if (who != null) {
      mb.say(message).on(who.chatIdentity().chatId()).send()
  }
}
