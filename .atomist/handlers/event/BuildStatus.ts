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
import { ResponseHandler, EventHandler, Tags, Parameter } from "@atomist/rug/operations/Decorators";
import { Build } from "@atomist/cortex/stub/Build";
import * as mustache from "mustache";

@EventHandler("BuildStatusHandler", "Send build events to repo channel", "/Build()")
@Tags("ci")
export class BuildStatusHandler implements HandleEvent<Build, Build> {
    handle(event: Match<Build, Build>): Plan {
        let root: Build = event.root();
        let plan: Plan = new Plan();

        let message;
        message = new Message(`new build? ${root.id()}:${root.name()}:${root.status()}`);
        console.log(`BuildStatusHandler: ${message.body}`);
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

@EventHandler("AllBuildStatusHandler", "Send all build events to a single channel", "/Build()")
@Tags("ci")
export class AllBuildStatusHandler implements HandleEvent<Build, Build> {
    handle(event: Match<Build, Build>): Plan {
        let root: Build = event.root();
        let plan: Plan = new Plan();

        let message = new Message(`new build? ${root.id()}:${root.name()}:${root.status()}`);
        console.log(`AllBuildStatusHandler: ${message.body}`);
        const channelId = "C4UC96BK5";
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
            onSuccess: {
                kind: "respond",
                name: "SendWinsImage",
                parameters: { channelId: channelId }
            }
        }
        plan.add(execute);

        return plan;
    }
}

export const allBuildStatusHandler = new AllBuildStatusHandler();

@ResponseHandler("SendWinsImage", "Sends a wins image")
class SendWinsResponder implements HandleResponse<any> {

    @Parameter({
        pattern: "^\\w+$",
        minLength: 1,
        maxLength: 200,
        required: false
    })
    channelId: string;

    handle(response: Response<any>): Plan {
        let plan: Plan = new Plan();

        console.log(`SendWinsReponsder: this=${JSON.stringify(this)}`);
        let bodyText = response.body();
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
        console.log(`SendWinsResponder: body=${body}`);
        let message = new Message(body);
        if (this.channelId) {
            console.log(`SendWinsResponder: channelId=${this.channelId}`);
            message.withChannelId(this.channelId);
        }
        plan.add(message);
        return plan;
    }
}

export let sendWinsImage = new SendWinsResponder();
