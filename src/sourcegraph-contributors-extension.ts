import * as sourcegraph from 'sourcegraph'

export function activate(): void {
    const pv = sourcegraph.app.createPanelView('contributors.panel')
    pv.content = 'Contributors'
    pv.title = 'Open a file to see contributors'

    sourcegraph.workspace.onDidOpenTextDocument.subscribe(doc => {
        pv.content = doc.uri
    })
}

// Learn what else is possible by visiting the [Sourcegraph extension documentation](https://github.com/sourcegraph/sourcegraph-extension-docs)
