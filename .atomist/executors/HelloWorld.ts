import {Executor} from "@atomist/rug/operations/Executor"
import {Services} from "@atomist/rug/model/Core"
import {Result, Status} from "@atomist/rug/operations/RugOperation"

class HelloWorld implements Executor {
    description: string = "Executor that just sends a message straight back"
    name: string = "HelloWorld"
    execute(services: Services): Result {
        for (let s of services.services()) {
            s.service().messageBuilder().say(`Hello from ${s.service().project().name()}`).send()
        }
        return new Result(Status.Success, "OK")
    }
}

var helloWorld = new HelloWorld()
