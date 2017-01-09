import {Executor} from "@atomist/rug/operations/Executor"
import {Services} from "@atomist/rug/model/Core"
import {Result, Status, Parameter} from "@atomist/rug/operations/RugOperation"

import {GitHubService} from "@atomist/github/core/Core"

interface Parameters {
    days: number
    token: string
}

var listIssues: Executor = {
    description: "Close a GitHub issue",
    name: "ListIssues",
    parameters: [
        // TODO proper patterns and validation
        { name: "days", description: "Days", pattern: "^.*$", maxLength: 100, required: false},
        { name: "token", description: "GitHub Token", pattern: "^.*$", maxLength: 100, required: true, displayable: false, tags: ["atomist/user_token"]}
    ],
    execute(services: Services, p: Parameters): Result {

        let _services: any = services
        let githubService = _services.github() as GitHubService
        let status = githubService.listIssues(p.days, p.token)
        _services.messageBuilder().say(status.message()).send()
        if (status.success()) {
            return new Result(Status.Success, "OK")
        }
        else {
          return new Result(Status.Error, status.message())
        }
    }
}
