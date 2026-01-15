# Minecraft Crafting Recipe

<img width="2485" height="1687" alt="image" src="https://github.com/user-attachments/assets/67164f77-c14e-4897-80dc-41f36ca25b2d" />

**Minecraft Crafting Recipe** is a web app for searching crafting recipes of Minecraft items, created with Vue on Vite.

## Development

```bash
pnpm install
pnpm run dev
```

## Building

```bash
pnpm run build
```

Static site generating is powered by [Vite SSG](https://github.com/antfu-collective/vite-ssg). The output will be on `dist` folder.

## How to process raw data

Follow these instructions in order to process your own data(for example when updating versions).

1. Empty all the folders/files inside `public/assets/data` folder unless you want to merge into the existing data.
1. Download Minecraft assets files.
1. Copy `data/minecraft/recipe` folder entirely inside that JAR file into `data/raw_data` folder in project directory.
1. Copy `data/minecraft/tags` folder entirely inside that JAR file into `data/raw_data` folder in project directory.
1. Copy language files you want to use from `assets/minecraft/lang` to `data/raw_data/lang` folder in project directory. **`en_us.json` file is necessary.**
1. Put item render images into `data/raw_data/renders` folder. You can use mods like [Isometric Render](https://modrinth.com/mod/isometric-renders), [BlockExporter](https://modrinth.com/mod/blockexporter), or [Icon Exporter](https://modrinth.com/mod/icon-exporter).
1. Run `pnpm run process` command.
1. Edit `minecraftVersion` variable in `shared/constants/minecraft.ts` file.
