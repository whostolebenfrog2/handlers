atomist.on("/issue[.number()=1]", function (m) {
    var issue = m.root();
    console.log("We got here! The issue is " + issue);
    atomist.messageBuilder().say("Nice, I don't know what I'm doing but it works").send();
    atomist.messageBuilder().regarding(issue).send();
    if (issue.resolvedBy() == null) {
        console.log("ResolvedBy is null");
    }
});
