import {Atomist} from '@atomist/rug/operations/Handler'
import {TreeNode} from '@atomist/rug/tree/PathExpression'
declare var atomist: Atomist

atomist.on<TreeNode, TreeNode>("/build", m => {
   let build = m.root() as any
   let message = atomist.messageBuilder().regarding(build)
   if (build.status() == "Passed" || build.status() == "Fixed") {
     message.withAction(message.actionRegistry().findByName("CreateRelease"))
   }
   else if (build.status() == "Failed" || build.status() == "Broken") {
     let repo = build.repo().owner() + "/" + build.repo().name()
     if (build.commit().committer().person() != null) {
        build.commit().committer().person().chatIdentity().directMessage(`Build on ${repo} broke after your last commit: ${build.build_url()}`)
     }
   }
   message.send()
})
