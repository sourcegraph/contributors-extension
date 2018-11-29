import * as sourcegraph from 'sourcegraph'
import { resolveURI } from './uri'
import { memoizeAsync } from './util/memoizeAsync'

export interface Contributor {
    name: string
    displayName: string
}

export const getFileContributors = memoizeAsync(
    async (uri: string): Promise<Contributor[]> => await queryFileContributors(uri),
    uri => uri
)

async function queryFileContributors(uri: string): Promise<Contributor[]> {
    const { repo, path } = resolveURI(uri)
    const { data, errors } = await sourcegraph.commands.executeCommand(
        'queryGraphQL',
        `
query GitContributors($repo: String!) {
	repository(name: $repo) {
        contributors(path: $path) {
            nodes {
                person {
                    name
                    displayName
                }
            }
		}
	}
}
	`,
        { repo, path }
    )
    if (errors && errors.length > 0) {
        throw new Error(errors.join('\n'))
    }
    if (!data || !data.repository || !data.repository.contributors || !data.repository.contributors.nodes) {
        throw new Error('no contributor data is available (repository or path not found)')
    }
    return data.repository.contributors.nodes
}
