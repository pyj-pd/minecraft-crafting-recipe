import { access, mkdir, readdir } from 'node:fs/promises'
import {
  LOG_SEPARATOR,
  PROCESSED_RENDER_IMAGES_FOLDER,
  RAW_RENDER_IMAGES_FOLDER,
} from '../common'
import sharp from 'sharp'
import path from 'node:path'

const RAW_RENDER_IMAGES_AVAILABLE_PREFIXES = ['minecraft_']

const getPureImageName = (fileName: string): string => {
  let pureName = fileName

  for (const prefix of RAW_RENDER_IMAGES_AVAILABLE_PREFIXES) {
    if (pureName.startsWith(prefix)) {
      pureName = pureName.slice(prefix.length)
      break
    }
  }

  return pureName
}

const getWebpImageName = (fileName: string): string => {
  const pureName = getPureImageName(fileName)
  return pureName.replace('.png', '.webp')
}

export async function processRawRenderImages(): Promise<void> {
  const rawRenderImages = await readdir(RAW_RENDER_IMAGES_FOLDER, {
    withFileTypes: true,
  })

  console.log(LOG_SEPARATOR)
  console.log('Processing render images...')

  // Make processed folder if not exists
  try {
    await access(PROCESSED_RENDER_IMAGES_FOLDER)
  } catch {
    await mkdir(PROCESSED_RENDER_IMAGES_FOLDER)
  }

  const failedFiles: string[] = []
  let processed: number = 0

  for (const rawImageFileName of rawRenderImages) {
    if (!rawImageFileName.isFile()) continue

    const pureImageName = getPureImageName(rawImageFileName.name)

    try {
      await sharp(path.join(RAW_RENDER_IMAGES_FOLDER, rawImageFileName.name))
        .webp({ lossless: true })
        .toFile(
          path.join(
            PROCESSED_RENDER_IMAGES_FOLDER,
            getWebpImageName(pureImageName)
          )
        )

      processed++
    } catch {
      failedFiles.push(rawImageFileName.name)
      continue
    }
  }

  console.log(`Processed render images: ${processed}`)
  console.log(`\nFiles failed to process: ${failedFiles.join(', ')}`)
}
