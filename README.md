# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

# How to process raw data

1. Empty all the folders/files inside `public/assets/data` folder unless you want to merge into the existing data.
1. Download Minecraft client `.jar` file.
1. Copy `data/minecraft/recipe` folder entirely inside that JAR file into `data/raw_data` folder in project directory.
1. Copy `data/minecraft/tags` folder entirely inside that JAR file into `data/raw_data` folder in project directory.
1. Copy language files you want to use from `assets/minecraft/lang` to `data/raw_data/lang` folder in project directory. **`en_us.json` file is necessary.**
1. Put isometric item render images into `public/assets/data/renders` folder. Use [Isometric Render](https://github.com/gliscowo/isometric-renders) mod for rendering.
1. Run `pnpm run process` command.
1. Edit `minecraftVersion` variable in `shared/constants/minecraft.ts` file.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
