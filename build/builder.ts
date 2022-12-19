import { readFile, rename, copyFile } from 'fs';
import { resolve } from 'path';
import rcedit from 'rcedit';
import glob from 'glob';

// -------------------------------------------------- \\

process.env.PKG_CACHE_PATH = resolve(process.cwd(), 'build', '.pkg-cache');

const PKG_TARGET = 'node16-win-x64',
  PACKAGE_JSON = resolve(process.cwd(), 'package.json'),
  ICON = resolve(process.cwd(), 'build', 'resources', 'icon.ico'),
  ENTRY_POINT = resolve(process.cwd(), 'build', 'bundled.js'),
  OUTPUT_EXE = resolve(process.cwd(), 'build', 'release', 'gdrive-master.exe');

let fetchedBinariesPath = '',
  builtBinariesPath = '';

// -------------------------------------------------- \\

async function main(): Promise<void> {
  await downloadCache(PKG_TARGET);
  await editMetadata();
  await build();
}

// --------------- \\

async function downloadCache(pkgTarget: string): Promise<void> {
  const [nodeRange, platform, arch] = pkgTarget.split('-'),
    pkgFetch = await import('pkg-fetch');
  await pkgFetch.need({ nodeRange, platform, arch });

  const binariesPath = glob.sync(`${process.env.PKG_CACHE_PATH}/**/fetched*`);
  if (binariesPath.length < 1) throw new Error('Error downloading PKG cache');

  fetchedBinariesPath = binariesPath[0].replace('fetched', 'OLD');
  builtBinariesPath = binariesPath[0].replace('fetched', 'built');

  await new Promise((resolve) =>
    copyFile(binariesPath[0], builtBinariesPath, () => resolve(null))
  );
  await new Promise((resolve) =>
    rename(binariesPath[0], fetchedBinariesPath, () => {
      resolve(null);
    })
  );
}

// --------------- \\

async function editMetadata(): Promise<void> {
  const { version, description } = (await new Promise((resolve) => {
    readFile(PACKAGE_JSON, 'utf-8', (_, data) => resolve(JSON.parse(data)));
  })) as Record<string, string>;

  await rcedit(builtBinariesPath, {
    'product-version': version,
    'file-version': version,
    icon: ICON,
    'version-string': {
      CompanyName: 'rdx',
      FileDescription: description,
      ProductName: 'gdrive-master',
      OriginalFilename: 'gdrive-master.exe',
      LegalCopyright: `© 2022 rdx. All Rights Reserved.`
    }
  });
}

// --------------- \\

async function build(): Promise<void> {
  const pkg = await import('pkg');
  await pkg.exec([
    ENTRY_POINT,
    ...['--config', PACKAGE_JSON],
    ...['--compress', 'Brotli'],
    ...['--target', PKG_TARGET],
    ...['--output', OUTPUT_EXE],
    // '--debug',
    /**
     * Without this (no-bytecode), there will be alot of warnings
     * regarding node_modules. They can be ignore because it doesn't
     * matter as we bundle everytinhg into one file (bundled.js).
     */
    '--no-bytecode'
  ]);

  await new Promise((resolve) => {
    rename(
      fetchedBinariesPath,
      fetchedBinariesPath.replace('OLD', 'fetched'),
      () => resolve(null)
    );
  });
}

// -------------------------------------------------- \\

main();
