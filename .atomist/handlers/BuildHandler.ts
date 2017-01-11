import {Atomist} from '@atomist/rug/operations/Handler'
import {TreeNode} from '@atomist/rug/tree/PathExpression'
declare var atomist: Atomist

atomist.on<TreeNode, TreeNode>("/build", m => {
   let build = m.root() as any
   let mb = atomist.messageBuilder()
   let message = mb.regarding(build)
   let repo = "`" + build.repo().owner() + "/" + build.repo().name() + "`"

   if (build.status() == "Passed" || build.status() == "Fixed") {
     message.withAction(message.actionRegistry().findByName("CreateRelease"))
     if (build.status() == "Fixed" && build.commit().committer().person() != null) {
        mb.say(`CI build of repo ${repo} is now fixed`).on(build.commit().committer().person().chatIdentity().chatId()).send()
     }
   }
   else if (build.status() == "Failed" || build.status() == "Broken" || build.status() == "Still Failing") {
     if (build.commit().committer().person() != null) {
        let repo = "`" + build.repo().owner() + "/" + build.repo().name() + "`"
        let commit = "`" + build.commit().sha() + "`"
        atomist.messageBuilder().say(`CI build of repo ${repo} failed after your last commit ${commit}: ${build.build_url()}`).on(build.commit().committer().person().chatIdentity().chatId()).send()
     }
   }

   message.send()
})
