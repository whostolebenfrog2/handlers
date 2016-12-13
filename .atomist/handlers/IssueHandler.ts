declare var atomist

atomist.on("/issue[.state()='open']", m => {
   let issue = m.root()
   atomist.messageBuilder().regarding(issue).send()
})

atomist.on("/issue[.state()='closed']", m => {
   let issue = m.root()
   atomist.messageBuilder().say("this next message is for a closed event").send()
   atomist.messageBuilder().regarding(issue).send()
})
