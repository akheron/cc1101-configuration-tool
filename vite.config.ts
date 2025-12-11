import { defineConfig } from 'vite';

const isGitHubPages = process.env.GITHUB_REPOSITORY?.endsWith(
  '/cc1101-configuration-tool',
);

export default defineConfig({
  // Use a prefixed base path only for GitHub Pages builds.
  base: isGitHubPages ? '/cc1101-configuration-tool/' : '/',
});
