# storyteller

Work in progress

## Available source locator types

Each source locator could have the form `<TYPE>:<QUERY>`. `<TYPE>` defaults to `github` if `<TYPE>:` is omitted.

### `github:<OWNER>/<NAME>[?<OPTIONS>]`

[GitHub CLI](https://github.com/cli/cli#installation) is required.

Treat the GitHub repository `<OWNER>/<NAME>` as a source. Each issue is considered a task, and the label named `sp:<STORY_POINT>` is considered a story point assignment. Closed issues are considered completed tasks.

`<OPTIONS>` consists of a sequence of options separated by `&`. Valid options are:

- `label=<LABEL>`: Only issues labeled with `<LABEL>` will be collected.

### `file:<PATH>`

Treat the JSON file `<PATH>` as a source. The input JSON must satisfy the `ProjectData` type defined in [src/source.ts](./src/source.ts).
