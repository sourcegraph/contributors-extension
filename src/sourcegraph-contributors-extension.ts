import * as sourcegraph from 'sourcegraph'
import { getFileContributors } from './contributors'

export function activate(): void {
    const pv = sourcegraph.app.createPanelView('contributors.panel')
    pv.content = 'Contributors'
    pv.title = 'Contributors'

    sourcegraph.workspace.onDidOpenTextDocument.subscribe(doc => {
        pv.title = 'Contributors'

        getFileContributors(doc.uri).then(contributors => pv.content = JSON.stringify(contributors), err => console.log(err))
    })
}
