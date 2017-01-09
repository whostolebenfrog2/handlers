import {Executor} from "@atomist/rug/operations/Executor"
import {Services} from "@atomist/rug/model/Core"
import {Result, Status, Parameter} from "@atomist/rug/operations/RugOperation"

interface Parameters {
    number: number
    assignee: string
    owner: string
    repo: string
    token: string
}

var assignIssue: Executor = {
    description: "Assign a GitHub issue",
    name: "AssignIssue",
    parameters: [
        // TODO proper patterns and validation
        { name: "number", description: "Issue Number", pattern: "^.*$", maxLength: 100, required: true },
        { name: "assignee", description: "Assignee", pattern: "^.*$", maxLength: 100, required: true },
        { name: "owner", description: "GitHub Owner", pattern: "^.*$", maxLength: 100, required: true },
        { name: "repo", description: "GitHub Repo", pattern: "^.*$", maxLength: 100, required: true },
        { name: "token", description: "GitHub Token", pattern: "^.*$", maxLength: 100, required: true }
    ],
    execute(services: Services, p: Parameters): Result {
        /*
        let issue: Issue = pxe.match(`/Issue[.number() = ${p.number}]`).scalar()
        issue.assign(p.assignee)
        */

        let _services: any = services
        if (_services.github().assignIssue(p.number, p.assignee, p.owner, p.repo, p.token).success()) {
            _services.messageBuilder().say(`Successfully assigned issue ${p.number} to ${p.assignee}`).send()
        }
        return new Result(Status.Success, "OK")
    }
}
