declare var atomist

atomist.on("/push", m => {
   let push = m.root()
   atomist.messageBuilder().regarding(push).send()
})
