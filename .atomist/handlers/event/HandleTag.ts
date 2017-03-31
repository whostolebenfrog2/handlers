import { HandleEvent, Message, Plan } from '@atomist/rug/operations/Handlers';
import { GraphNode, Match } from '@atomist/rug/tree/PathExpression';
import { EventHandler, Tags } from '@atomist/rug/operations/Decorators';
import { Tag } from "@atomist/cortex/Tag";

/**
 * A Simple handler to catch any Tag event.
 */
@EventHandler("Tag", "Simple handler to catch any Tag event", "/Tag()")
@Tags("documentation")
export class CreateTag implements HandleEvent<Tag, GraphNode> {
    handle(event: Match<Tag, GraphNode>): Plan {
        let root: Tag = event.root();
        let plan: Plan = new Plan();
        let message = new Message(`${root.nodeName()} event: ${root.name()}`);
        message.withNode(root)
        return plan.add(message);
    }
}

export const tag = new CreateTag();
