## Inputs

### `ACCESS_TOKEN`

The [GitLab pipeline access token](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html)
to access the pipeline via the API. You need the `read_api` and `read_repository` scopes with `Guest` role for this token.

For public projects you don't need to provide an access token.

## Outputs

### `status`

The last status of the pipeline. See [GitLab project pipelines](https://docs.gitlab.com/ee/api/pipelines.html#list-project-pipelines)
for more information about which status values there are.
