# GitLab CD Pipeline trigger

Github Action to trigger Gitlab CD pipeline

Credit to [digital-blueprint](https://github.com/digital-blueprint/gitlab-pipeline-trigger-action), This clone is adapted to my usecase.

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

The branch or tag to run the pipeline on. Default `main`.

### `GITLB_TRIGGER_TOKEN`

**Required** The [GitLab pipeline trigger token](https://docs.gitlab.com/ee/ci/triggers/index.html#create-a-trigger-token)
to trigger the pipeline.

### `ACCESS_TOKEN` (optional)

An optional [GitLab access token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html) used to **retrieve pipeline status via the GitLab API**.

If you want to **poll your pipeline and get its status** (e.g. `pending`, `running`, `success`, `failed`) after triggering it, you'll need to provide a valid **Personal Access Token**, **Project Access Token**, or **CI Job Token** with the `read_api` scope.

If not provided, the pipeline will still be triggered, but its status will **not be tracked**.

> 💡 **Need help generating a token?**  
> See: [Creating a Personal Access Token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html)

---

### 🔐 Why use a separate token?

To **trigger a pipeline**, a token must have the `api` scope. This scope grants **full access to the GitLab API**, including write actions like modifying repository files, managing CI/CD settings, and more.

For security reasons, it's best **not to reuse the same token** for both triggering and polling the pipeline. By using a **dedicated token with only the `read_api` scope** for polling status, you:
- **Limit exposure** of elevated permissions,
- Follow the principle of **least privilege**,
- Reduce the risk in case the token is accidentally leaked.

Use separate tokens for triggering and polling when possible to ensure a more secure setup.

### `PIPELINE_VARIABLES`

A map of key-valued strings containing the pipeline variables. For example: `{ VAR1: "value1", VAR2: "value2" }`.. Default `"World"`.

## Outputs

### `web_url`

The URL of the pipeline, for example `https://gitlab.com/foo/bar/pipelines/47`.

## Example usage

```yaml
uses: mb-wali/gitlab-cd-trigger@main
with:
  URL: 'gitlab.example.com'
  GITLB_TRIGGER_TOKEN: ${{ secrets.DEPLOY_TRIGGER_TOKEN }}
  ACCESS_TOKEN: ${{ secrets.GITLAB_PROJECT_ACCESS_TOKEN }}
  PROJECT_ID: '123'
  REF_NAME: 'main'
  PIPELINE_VARIABLES: '{"VAR1":"value1","VAR2":"value2"}'
```

## Development

```bash
npm install
npm run build
```
