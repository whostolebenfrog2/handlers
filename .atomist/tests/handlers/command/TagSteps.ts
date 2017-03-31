import { Given, When, Then, HandlerScenarioWorld, CommandHandlerScenarioWorld } from "@atomist/rug/test/handler/Core"

Given("nothing", f => { });

When("the Tag is invoked", (world: HandlerScenarioWorld) => {
    let w: CommandHandlerScenarioWorld = world as CommandHandlerScenarioWorld;
    let handler = w.commandHandler("Tag");
    w.invokeHandler(handler, {});
});

Then("you get the right response", (world: HandlerScenarioWorld) => {
    let w: CommandHandlerScenarioWorld = world as CommandHandlerScenarioWorld;
    const expected = "Successfully ran Tag: default value";
    const message = w.plan().messages[0].body;
    return message == expected;
});
