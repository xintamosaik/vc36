# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
npx sv@1.3.0 create --template minimal --types ts --add prettier eslint vitest="usages:unit,component" tailwindcss="plugins:typography,forms" --no-install vc36
```

## Adding features

Add features to your project with `sv add`:

```sh
npx sv add
```

For example, to add Tailwind CSS:

```sh
npx sv add tailwindcss
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

The CV editor loads its initial content from `src/lib/data/cv` and saves edits as JSON files in `data/cv` at the project root. The `data/cv` folder is created on the first save and can be version-controlled or synced with Git. The save API only accepts requests from the local machine; run the app locally rather than exposing it to a network.

Additional CVs are managed from the Documents mode. Each variant stores only differences from the main CV and inherits other content. The variant editor uses the same six emoji section buttons as the main editor. Identity, impact, job details, skills, and education remain factual and read-only; variants can tailor the header role and introduction, summary paragraphs, and experience wording. Variants can also hide sections, jobs, or skill rows and override section titles. Job and skill-row IDs are persisted so variants keep pointing at the same entries if their order changes. Existing saved entries receive IDs automatically when read.

For bold text in supported CV copy fields, use the sparse FAT syntax `##bold text##`. Other Markdown syntax is displayed as plain text.

Jobs and skill groups cannot be removed while a variant explicitly references them through hidden-item settings, tailored job wording, or skill overrides. The editor checks current variants and shows which ones prevent removal. Remove those references or delete the dependent variant first, then choose “Check references again”. Saving also checks references before writing, so edits in another tab cannot leave dangling references.

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
