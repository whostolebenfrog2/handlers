import { HandleEvent, DirectedMessage, ChannelAddress, Plan } from '@atomist/rug/operations/Handlers';
import { GraphNode, Match } from '@atomist/rug/tree/PathExpression';
import { EventHandler, Tags } from '@atomist/rug/operations/Decorators';
import { Tag } from "@atomist/cortex/Tag";

/**
 * A Simple handler to catch any Tag event.
 */
@EventHandler("HandleTag", "Simple handler to catch any Tag event", "/Tag()")
@Tags("handlers", "demo")
export class HandleTag implements HandleEvent<Tag, GraphNode> {
    handle(event: Match<Tag, GraphNode>): Plan {
        let root: Tag = event.root();
        let message = new DirectedMessage(`New Tag \`${root.name}\` detected`, new ChannelAddress("general"));
        return Plan.ofMessage(message);
    }
}

export const tag = new HandleTag();
