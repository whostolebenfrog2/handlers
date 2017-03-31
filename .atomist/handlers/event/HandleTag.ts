import { HandleEvent, Message, Plan } from '@atomist/rug/operations/Handlers';
import { GraphNode, Match } from '@atomist/rug/tree/PathExpression';
import { EventHandler, Tags } from '@atomist/rug/operations/Decorators';
import { Tag } from "@atomist/cortex/Tag";

/**
 * A Simple handler to catch any Tag event.
 */
@EventHandler("Tag", "Simple handler to catch any Tag event", "/Tag()")
@Tags("handlers", "demo")
export class CreateTag implements HandleEvent<Tag, GraphNode> {
    handle(event: Match<Tag, GraphNode>): Plan {
        let root: Tag = event.root();
        let plan: Plan = new Plan();
        let message = new Message(`New Tag \`${root.name()}\` detected`);
        message.channelId = "handlers";
        return plan.add(message);
    }
}

export const tag = new CreateTag();
