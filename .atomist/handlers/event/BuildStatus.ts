import {
    HandleEvent,
    Response,
    HandleResponse,
    Execute,
    Message,
    Plan,
    Respondable
} from "@atomist/rug/operations/Handlers";
import { Match } from "@atomist/rug/tree/PathExpression";
import { ResponseHandler, EventHandler, Tags } from "@atomist/rug/operations/Decorators";
import { Build } from "@atomist/cortex/stub/Build";
import * as mustache from "mustache";

const channelId = "C4UC96BK5";

@EventHandler("BuildStatusHandler", "Handle", "/Build()")
@Tags("ci")
export class BuildStatusHandler implements HandleEvent<Build, Build> {
    handle(event: Match<Build, Build>): Plan {
        let root = event.root();
        let plan: Plan = new Plan();

        let message;
        message = new Message(`new build? ${root.status()}`);
        message.withChannelId(channelId);
        plan.add(message);
        let execute: Respondable<Execute> = {
            instruction: {
                name: "http",
                kind: "execute",
                parameters: {
                    method: "get",
                    url: `https://s3.amazonaws.com/static-files-for-public-consumption/lists/wins.txt`
                }
            },
            onSuccess: { kind: "respond", name: "SendWinsImage" }
        }
        plan.add(execute);

        return plan;
    }
}

export const buildStatusHandler = new BuildStatusHandler();

@ResponseHandler("SendWinsImage", "Sends a wins image")
class SendWinsResponder implements HandleResponse<any> {

    handle(response: Response<any>): Plan {
        let plan: Plan = new Plan();

        let bodyText = response.body();
        console.log(bodyText);
        let images = bodyText.split('\n');
        let image = images[Math.round(Math.random() * (images.length))];
        let body =
            mustache.render(`{
  "attachments": [{
    "fallback": "Yipee!!!",
    "color": "#36a64f",
    "title": "Success!",
    "image_url": "{{{image}}}",
    "ts": "{{{timestamp}}}"
  }]
}`, { image: image, timestamp: new Date() });
        let message = new Message(body);
        message.withChannelId(channelId);
        plan.add(message);
        return plan;
    }
}

export let sendWinsImage = new SendWinsResponder();
