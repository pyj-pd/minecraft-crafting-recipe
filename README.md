# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

# How to process raw data

1. Make sure you have deleted all the folders inside `public/data` folder for proper processing.
1. Download Minecraft client `.jar` file.
1. Copy `data/minecraft/recipe` folder entirely inside that JAR file into `data/raw_data` folder in project directory.
1. Copy `data/minecraft/tags` folder entirely inside that JAR file into `data/raw_data` folder in project directory.
1. Copy `assets/minecraft/lang` folder entirely inside that JAR file into `data/raw_data` folder in project directory.
1. Put isometric item render images into `public/assets/data/renders` folder. Use [Isometric Render](https://github.com/gliscowo/isometric-renders) mod for rendering.
1. Run `pnpm run process:recipe-data` command.
