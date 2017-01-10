import {Atomist} from '@atomist/rug/operations/Handler'
import {TreeNode} from '@atomist/rug/tree/PathExpression'
declare var atomist: Atomist

atomist.on<TreeNode, TreeNode>("/pullRequest", m => {
   let pr = m.root() as any
   let message = atomist.messageBuilder().regarding(pr)

   let merge = message.actionRegistry().findByName("MergePullRequest")
   merge = message.actionRegistry().bindParameter(merge, "number", pr.number())
   message.withAction(merge)

   message.send()
})
