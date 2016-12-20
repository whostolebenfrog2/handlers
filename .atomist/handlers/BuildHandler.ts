import {Atomist} from '@atomist/rug/operations/Handler'
import {TreeNode} from '@atomist/rug/tree/PathExpression'
declare var atomist: Atomist

atomist.on<TreeNode, TreeNode>("/push", m => {
   let push = m.root()
   let message = atomist.messageBuilder().regarding(push)
   message.withAction(message.actionRegistry().findByName("RestartTravisBuild"))
   message.send()
})

atomist.on<TreeNode, TreeNode>("/commit", m => {
   let push = m.root()
   atomist.messageBuilder().regarding(push).send()
})
