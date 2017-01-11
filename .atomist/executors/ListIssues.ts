import {Executor} from "@atomist/rug/operations/Executor"
import {Services} from "@atomist/rug/model/Core"
import {Result, Status, Parameter} from "@atomist/rug/operations/RugOperation"

import {GitHubService, Issue} from "@atomist/github/core/Core"

interface Parameters {
    days: number
    token: string
}

var listIssues: Executor = {
    description: "Close a GitHub issue",
    name: "ListIssues",
    tags: ["atomist/intent=list issues"],
    parameters: [
        // TODO proper patterns and validation
        { name: "days", description: "Days", pattern: "^.*$", maxLength: 100, required: false, default: "1" },
        // TODO marking it required: false will prevent the bot to ask for it
        { name: "token", description: "GitHub Token", pattern: "^.*$", maxLength: 100, required: false, displayable: false, tags: ["atomist/user_token"] }
    ],
    execute(services: Services, p: Parameters): Result {

        let _services: any = services
        let githubService = _services.github() as GitHubService
        let issues: Issue[] = githubService.listIssues(p.days, p.token)

        if (issues.length > 0) {
            let attachments = `{"attachments": [` + issues.map(i => {
                if (i.state() == "closed") {
                    return `{
                  "fallback": "#${i.number()}: ${i.title()}",
                  "author_icon": "http://images.atomist.com/rug/issue-closed.png",
                  "color": "#bd2c00",
                  "author_link": "${i.issueUrl()}",
                  "author_name": "#${i.number()}: ${i.title()}"
               }`
                }
                else {
                    return `{
                "fallback": "#${i.number()}: ${i.title()}",
                "author_icon": "http://images.atomist.com/rug/issue-open.png",
                "color": "#6cc644",
                "author_link": "${i.issueUrl()}",
                "author_name": "#${i.number()}: ${i.title()}"
             }`
                }
            }).join(",") + "]}"
            _services.messageBuilder().say(attachments).send()
        }
        else {
          _services.messageBuilder().say(`No issues found for the last ${p.days} day(s)`).send()
        }
        return new Result(Status.Success, "OK")
    }
}
