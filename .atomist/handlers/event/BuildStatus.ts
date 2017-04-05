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

function buildGood(status: string): boolean {
    if (status == "Passed" || status == "Fixed") {
        return true;
    } else if (status == "Failed" || status == "Broken" || status == "Still Failing") {
        return false;
    }
    return false; // I guess
}

function statusImagesUrl(status: string): string {
    const baseUrl = "https://s3.amazonaws.com/static-files-for-public-consumption/lists/";
    if (buildGood(status)) {
        return baseUrl + "wins.txt";
    }
    return baseUrl + "fails.txt";
}

@EventHandler("BuildStatusHandler", "Send build events to repo channel", "/Build()[]/on::Repo()/channel::ChatChannel()")
@Tags("ci")
export class BuildStatusHandler implements HandleEvent<Build, Build> {
    handle(event: Match<Build, Build>): Plan {
        let build: Build = event.root();
        let plan: Plan = new Plan();

        let repo = build.on();
        let messageText = `BuildStatusHandler: ${repo.name()}:${build.name()}:${build.status()}`;
        console.log(`BuildStatusHandler: messageText=${messageText}`);
        let channels = repo.channel();
        if (channels.length < 1) {
            console.log(`BuildStatusHandler: no channels associated with build repo: ${messageText}`);
        }
        for (let channel of channels) {
            console.log(`BuildStatusHandler: channel=${channel.name()}`);
            plan.add(new Message(messageText).withChannelId(channel.id()));
        }

        if (build.status() == "Pending") {
            console.log(`build ${build.name()} is ${build.status()}`);
            return plan;
        }

        let urlsUrl: string = statusImagesUrl(build.status());

        let execute: Respondable<Execute> = {
            instruction: {
                name: "http",
                kind: "execute",
                parameters: {
                    method: "get",
                    url: urlsUrl
                }
            },
            onSuccess: {
                kind: "respond",
                name: "SendWinsImage",
                parameters: {
                    buildName: build.name(),
                    buildStatus: build.status(),
                    channelId: channels[0].id()
                }
            },
            onError: {
                kind: "respond",
                name: "GetErrorMessage",
                parameters: { channelId: channels[0].id() }
            }
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
        let build: Build = event.root();
        let plan: Plan = new Plan();

        let message = new Message(`AllBuildStatusHandler: ${build.id()}:${build.name()}:${build.status()}`);
        console.log(`AllBuildStatusHandler: body=${message.body}`);
        const channelId = "C4UC96BK5";
        message.withChannelId(channelId);
        plan.add(message);

        if (build.status() == "Pending") {
            console.log(`build ${build.name()} is ${build.status()}`);
            return plan;
        }

        let urlsUrl: string = statusImagesUrl(build.status());

        let execute: Respondable<Execute> = {
            instruction: {
                name: "http",
                kind: "execute",
                parameters: {
                    method: "get",
                    url: urlsUrl
                }
            },
            onSuccess: {
                kind: "respond",
                name: "SendWinsImage",
                parameters: {
                    buildName: build.name(),
                    buildStatus: build.status(),
                    channelId: channelId
                }
            },
            onError: {
                kind: "respond",
                name: "GetErrorMessage",
                parameters: { channelId: channelId }
            }
        }
        plan.add(execute);

        return plan;
    }
}

export const allBuildStatusHandler = new AllBuildStatusHandler();

@ResponseHandler("SendWinsImage", "Sends a wins image")
export class SendWinsResponder implements HandleResponse<any> {

    @Parameter({
        pattern: "^\\w+$",
        minLength: 1,
        maxLength: 200,
        required: true
    })
    buildName: string;

    @Parameter({
        pattern: "^.+$",
        minLength: 1,
        maxLength: 200,
        required: true
    })
    buildStatus: string;

    @Parameter({
        pattern: "^\\w+$",
        minLength: 1,
        maxLength: 200,
        required: true
    })
    channelId: string;

    handle(response: Response<any>): Plan {
        let plan: Plan = new Plan();

        console.log(`SendWinsResponsder: this=${JSON.stringify(this)}`);
        let bodyText = response.body();
        let images = bodyText.split('\n');
        let image = images[Math.round(Math.random() * (images.length))];
        let fallback: string = `Oh no, build ${this.buildName} failed!`;
        let color: string = "#a63636";
        if (buildGood(this.buildStatus)) {
            fallback = `Yippee, build ${this.buildName} succeeded!!!`;
            color = "#36a64f";
        }

        let body = `{
  "attachments": [{
    "fallback": "${fallback}",
    "color": "${color}",
    "title": "${this.buildName} ${this.buildStatus}!",
    "image_url": "${image}"
  }]
}`;
        console.log(`SendWinsResponder: body=${body}`);
        let message = new Message(body);
        console.log(`SendWinsResponder: channelId=${this.channelId}`);
        message.withChannelId(this.channelId);
        plan.add(message);
        return plan;
    }
}

export const sendWinsImage = new SendWinsResponder();

@ResponseHandler("GetErrorMessage", "Sends an error message")
export class GetErrorMessage implements HandleResponse<any> {

    @Parameter({
        pattern: "^\\w+$",
        minLength: 1,
        maxLength: 200,
        required: true
    })
    channelId: string;

    handle(response: Response<any>): Plan {
        let plan: Plan = new Plan();

        console.log(`GetErrorMessage: channelId=${this.channelId}`);
        return Plan.ofMessage(new Message("failed to fetch success image URLs").withChannelId(this.channelId));
    }
}

export const getErrorMessage = new GetErrorMessage();
