import * as sourcegraph from 'sourcegraph'
import { Contributor, getFileContributors } from './contributors'

export function activate(): void {
    const pv = sourcegraph.app.createPanelView('contributors.panel')
    pv.content = 'Contributors'
    pv.title = 'Contributors'

    sourcegraph.workspace.onDidOpenTextDocument.subscribe(doc => {
        pv.title = 'Contributors'

        getFileContributors(doc.uri).then(contributors => {
            console.log('file contributors received', contributors)
            pv.content = generateChart(contributors)
            console.log(pv.content)
        }, err => console.log(err))
    })
}

function generateChart(contributors: Contributor[]): string {
    const data = contributors.map(c =>
        (`{ key: "${c.person.name}", value: ${c.count} },\n`)
    ).join('').slice(0, -1)

    return `# Top contributors (commits)\n\`\`\`vis\nresponsive: true\nheight: 400\nwidth: 800\ndata: [\n${data}\n]\`\`\``
}
