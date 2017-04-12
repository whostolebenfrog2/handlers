import { Given, When, Then, HandlerScenarioWorld, CommandHandlerScenarioWorld } from "@atomist/rug/test/handler/Core"
import { DirectedMessage } from '@atomist/rug/operations/Handlers'

Given("nothing", f => { });

When("the Tag is invoked", (world: HandlerScenarioWorld) => {
    let w: CommandHandlerScenarioWorld = world as CommandHandlerScenarioWorld;
    let handler = w.commandHandler("CreateTag");
    w.invokeHandler(handler, {});
});

Then("you get the right response", (world: HandlerScenarioWorld) => {
    let w: CommandHandlerScenarioWorld = world as CommandHandlerScenarioWorld;
    const expected = "Successfully ran Tag: default value";
    const message = (w.plan().messages[0] as DirectedMessage).body;
    return message == expected;
});
