# GitLab CD Pipeline trigger

Github Action to trigger Gitlab CD pipeline

[GitHub](https://github.com/mb-wali/gitlab-cd-trigger) |
[GitHub Marketplace](https://github.com/marketplace/actions/trigger-gitlab-pipeline)

[![Test action](https://github.com/mb-wali/gitlab-cd-trigger/actions/workflows/test.yml/badge.svg)](https://github.com/mb-wali/gitlab-cd-trigger/actions/workflows/test.yml)

This GitHub action triggers and waits for a [GitLab pipeline](https://docs.gitlab.com/ee/ci/pipelines/) to complete.

You can for example use this action in your GitHub workflow to trigger a deployment pipeline on a private
GitLab server after a successful build pipeline and wait for the deployment (with possible End2End tests)
to finish, so you would get a notification if the deployment failed.

## Inputs

### `URL`

The GitLab URL to trigger the pipeline on. Default `gitlab.com`.

### `PROJECT_ID`

**Required** The ID or path of the project owned by the authenticated user.
You will find the *Project ID* in the *General Settings* of your GitLab project.

### `REF_NAME`

**Required** The branch or tag to run the pipeline on.

### `GITLB_TRIGGER_TOKEN`

**Required** The [GitLab pipeline trigger token](https://docs.gitlab.com/ee/ci/triggers/index.html#create-a-trigger-token)
to trigger the pipeline.

### `PIPELINE_VARIABLES`

A map of key-valued strings containing the pipeline variables. For example: `{ VAR1: "value1", VAR2: "value2" }`.. Default `"World"`.

## Outputs

### `web_url`

The URL of the pipeline, for example `https://gitlab.com/foo/bar/pipelines/47`.

## Example usage

```yaml
uses: mb-wali/gitlab-cd-trigger@v1.0.0
with:
  URL: 'gitlab.example.com'
  GITLB_TRIGGER_TOKEN: ${{ secrets.DEPLOY_TRIGGER_TOKEN }}
  PROJECT_ID: '123'
  REF_NAME: 'main'
  PIPELINE_VARIABLES: '{"VAR1":"value1","VAR2":"value2"}'
```
