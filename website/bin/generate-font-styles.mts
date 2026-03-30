#!/usr/bin/env -S node --experimental-strip-types --disable-warning=ExperimentalWarning

import path from 'node:path';

import { globSync } from 'glob';

const fontFiles = globSync('public/fonts/*.ttf', {
  cwd: import.meta.dirname + '/..',
});

const styles = fontFiles
  .map((file) => path.basename(file))
  .map((file) => ({
    file,
    fontFamily: path.basename(file, '.ttf'),
  }))
  .map(
    ({ file, fontFamily }) => `
@font-face {
  font-family: '${fontFamily}';
  src: url('/fonts/${file}') format('truetype');
  font-display: swap;
}
`,
  )
  .join('\n');

process.stdout.write(styles);
