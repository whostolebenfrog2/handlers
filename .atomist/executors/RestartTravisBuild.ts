import { Executor } from "@atomist/rug/operations/Executor"
import { Services } from "@atomist/rug/model/Core"
import { Result, Status, Parameter } from "@atomist/rug/operations/RugOperation"

class RestartTravisBuild implements Executor {
    description: string = "Executor that starts a build on Travis"
    name: string = "RestartTravisBuild"
    parameters: Parameter[] = [{ name: "build_id", description: "Build ID", pattern: "^.*$", maxLength: 100, required: true }]
    execute(services: Services, {build_id}: { build_id: string }): Result {
        let _services: any = services
        _services.travis().restart(build_id)

        return new Result(Status.Success, "OK")
    }
}

var restartBuild = new RestartTravisBuild()
