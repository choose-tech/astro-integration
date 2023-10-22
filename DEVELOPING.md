## Publishing to NPM

- Go to the right directory
- Update the version in `package.json`
- Commit and push `git add . && git commit -m "<scope>@<version>" && git push`
- Publish to NPM `pnpm publish --tag <scope>@<version>`
- Publish git tag `git push origin --tags`
- Create release on GitHub at https://github.com/choose-tech/astro-integration/releases/new