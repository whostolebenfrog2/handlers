import {Atomist} from '@atomist/rug/operations/Handler'
import {TreeNode} from '@atomist/rug/tree/PathExpression'
declare var atomist: Atomist

  atomist.on<TreeNode, TreeNode>("/issue[.state()='open']", m => {
   let issue = m.root()
   let message = atomist.messageBuilder().regarding(issue)
   let assign = message.actionRegistry().findByName("Assign")
   assign.parameters().push()
   message.withAction(assign)
   message.send()
})

atomist.on<TreeNode, TreeNode>("/issue[.state()='closed']", m => {
   let issue = m.root()
   let message = atomist.messageBuilder().regarding(issue)
   //message.withAction(message.actionRegistry().findByName("Reopen"))
   message.send()
})
