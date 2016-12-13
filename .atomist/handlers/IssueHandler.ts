declare var atomist

atomist.on("/issue", m => {
   let issue = m.root()
   atomist.messageBuilder().regarding(issue).send()
})

