atomist.on("/push", function (m) {
    var push = m.root();
    atomist.messageBuilder().regarding(push).send();
});
