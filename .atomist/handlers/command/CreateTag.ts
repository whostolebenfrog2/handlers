import { HandleCommand, HandlerContext, Message, Plan } from '@atomist/rug/operations/Handlers';
import { CommandHandler, Parameter, Tags, Intent } from '@atomist/rug/operations/Decorators';
import { Pattern } from '@atomist/rug/operations/RugOperation';

import { Tag } from '@atomist/cortex/Tag'

/**
 * A Simple command to tag a sha in GitHub.
 */
@CommandHandler("CreateTag", "Simple command to tag a sha in GitHub")
@Tags("handlers", "demo")
@Intent("create tag")
export class CreateTag implements HandleCommand {

    @Parameter({
        displayName: "Some Input",
        description: "example of how to specify a parameter using decorators",
        pattern: Pattern.any,
        validInput: "a description of the valid input",
        minLength: 1,
        maxLength: 100,
        required: false
    })
    inputParameter: string = "default value";

    handle(command: HandlerContext): Plan {
        let plan: Plan = new Plan();
        let message: Message = new Message(`Successfully ran Tag: ${this.inputParameter}`);
        return plan.add(message);
    }
}

export const tag = new CreateTag();
