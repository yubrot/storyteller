import { print as gqlPrint } from 'graphql/language/printer';
import { promisify } from 'util';
import { exec as exec_ } from 'child_process';
import { ProjectData, registerType, SourceLoader } from '../source';
import { getSdk, IssueFilters, Sdk } from './github/sdk';

let sdkCache: Sdk | undefined;

function sdk(): Sdk {
  if (sdkCache) return sdkCache;

  const exec = promisify(exec_);

  sdkCache = getSdk(async (doc, vars) => {
    const input = JSON.stringify({ query: gqlPrint(doc), variables: { ...vars } });
    const { stdout } = await exec(`cat <<"INPUT" | gh api graphql --input -\n${input}\nINPUT`);
    const { data, errors } = JSON.parse(stdout);
    if (errors && errors.length) throw new Error(errors[0]);
    return data;
  });
  return sdkCache;
}

/**
 * Source implementation that considers GitHub issues as tasks. See top-level README.md.
 */
export class GitHubLoader implements SourceLoader {
  constructor(readonly owner: string, readonly name: string, readonly filters?: IssueFilters) {}

  async load(updatedAfter?: number): Promise<ProjectData> {
    console.log('Fetching GitHub repository issues updated after', updatedAfter);

    const result: ProjectData = {
      metadata: {
        url: `https://github.com/${this.owner}/${this.name}`,
      },
      tasks: {},
      assignees: {},
      labels: {},
    };

    let cursor: string | null | undefined;
    while (true) {
      const q = await sdk().repositoryIssues({
        owner: this.owner,
        name: this.name,
        count: 100,
        after: cursor,
        filters: {
          ...this.filters,
          since: updatedAfter ? new Date(updatedAfter).toISOString() : undefined,
        },
      });

      const issues = q.repository?.issues;
      if (!issues) break;
      console.log('Fetched', issues.edges?.length ?? 0, 'issues after', cursor);

      for (const edge of issues.edges ?? []) {
        if (!edge || !edge.node) break;
        const issue = edge.node;

        // Normalize issues into tasks, assignees, and labels
        let storyPoint: number | null = null;

        const assignees = (issue.assignees.nodes ?? []).flatMap(assignee => {
          if (!assignee) return [];
          if (!result.assignees[assignee.login]) {
            result.assignees[assignee.login] = {
              id: assignee.login,
              url: assignee.url,
              name: assignee.name ?? assignee.login,
              avatarUrl: assignee.avatarUrl,
            };
          }
          return [assignee.login];
        });

        const labels = (issue.labels?.nodes ?? []).flatMap(label => {
          if (!label) return [];
          const storyPointLabel = label.name.match(/^sp:(\d+(?:\.\d+)?)$/);
          if (storyPointLabel) {
            storyPoint = Number(storyPointLabel[1]);
            return [];
          }
          if (!result.labels[label.name]) {
            result.labels[label.name] = {
              name: label.name,
              color: '#' + label.color,
            };
          }
          return [label.name];
        });

        result.tasks[String(issue.number)] = {
          id: String(issue.number),
          url: issue.url,
          title: issue.title,
          createdAt: Date.parse(issue.createdAt),
          completedAt: issue.closedAt ? Date.parse(issue.closedAt) : null,
          storyPoint,
          assignees,
          labels,
        };
      }

      if (!issues.pageInfo.hasNextPage) break;
      cursor = issues.pageInfo.endCursor;
    }

    return result;
  }

  /**
   * Create a loader from a query string. See top-level README.md.
   */
  static fromQuery(q: string): GitHubLoader {
    const parts = q.match(/^([-\w]+)\/([-\w]+)(?:\?(.*))?$/);
    if (!parts) throw new Error(`Invalid GitHub query ${q}: must be <OWNER>/<NAME>[?<OPTIONS>]`);
    const owner = parts[1];
    const name = parts[2];
    const options = parts[3];

    let filters: IssueFilters | undefined;
    for (const option of options?.split(/&/) ?? []) {
      const [key, value] = option.split(/=/, 2);
      switch (key) {
        case 'label':
          if (!value) throw new Error(`Invalid GitHub query ${q}: label name unspecified`);
          filters = {
            ...filters,
            labels: [...(filters?.labels ?? []), value],
          };
          break;

        default:
          throw new Error(`Invalid GitHub query ${q}: unknown option ${key}`);
      }
    }

    return new GitHubLoader(owner, name, filters);
  }
}

if (typeof window === 'undefined') registerType('github', GitHubLoader.fromQuery);
