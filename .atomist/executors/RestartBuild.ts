import { Executor } from "@atomist/rug/operations/Executor"
import { Services } from "@atomist/rug/model/Core"
import { Result, Status, Parameter } from "@atomist/rug/operations/RugOperation"

import { TravisService } from "@atomist/travis/core/Core"

interface Parameters {
    build_id: number
    org: string
    token: string
}

var restartBuild: Executor = {
    description: "Restart a build on Travis CI",
    name: "RestartBuild",
    tags: ["atomist/intent=restart build"],
    parameters: [
        // TODO proper patterns and validation
        { name: "build_id", description: "Build Number", pattern: "^.*$", maxLength: 100, required: true },
        { name: "org", description: "Travis org", pattern: "^(.org|.com)$", maxLength: 100, required: false, default:".org" },
        // TODO marking it required: false will prevent the bot to ask for it
        { name: "token", description: "GitHub Token", pattern: "^.*$", maxLength: 100, required: false, displayable: false, tags: ["atomist/user_token"] }
    ],
    execute(services: Services, p: Parameters): Result {
        console.log(p)

        let _services: any = services
        let travisService = _services.travis() as TravisService
        let status = travisService.restartBuild(p.build_id, p.org, p.token)
        _services.messageBuilder().say(status.message()).send()
        if (status.success()) {
            return new Result(Status.Success, "OK")
        }
        else {
            return new Result(Status.Error, status.message())
        }
    }
}
