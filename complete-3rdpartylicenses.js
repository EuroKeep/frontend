/*
 * Completes the 3rdpartylicenses.txt written by `ng build` and copies it next to the served app.
 *
 * Angular's license extraction only sees packages imported from TypeScript. Missing are:
 *  - packages that are only pulled in through SCSS/CSS imports (stylesheets, fonts),
 *  - NOTICE files and embedded subcomponent licenses (Apache-2.0 §4d, e.g. ECharts),
 *  - third-party code that lives in this repository (src/assets).
 *
 * Usage: node complete-3rdpartylicenses.js [dist/frontend-angular]
 * Idempotent: entries already present in the file are not added again.
 */
const fs = require('fs');
const path = require('path');

const distDir = process.argv[2] || 'dist/frontend-angular';
const licenseFile = path.join(distDir, '3rdpartylicenses.txt');
const servedFile = path.join(distDir, 'browser', '3rdpartylicenses.txt');

// Shipped through SCSS/CSS imports (src/styles.css, src/material.scss, src/assets/coreui/*.scss).
const STYLE_PACKAGES = [
    '@angular/material',
    '@coreui/coreui',
    '@fortawesome/fontawesome-free',
];

const MIT_TEXT = `Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

// Third-party code kept in this repository.
const IN_TREE = [
    {
        name: 'Adminator (src/assets/login/adminator.min.css)',
        license: 'MIT',
        text: `MIT License\n\nCopyright (c) 2018 Aigars Silkalns\nhttps://github.com/puikinsh/Adminator-admin-dashboard\n\n${MIT_TEXT}`,
    },
    {
        name: 'Nestable (src/assets/coreui/nestable.scss)',
        license: 'MIT',
        text: `Nestable jQuery Plugin - Copyright (c) 2012 David Bushell - http://dbushell.com/\n` +
            `Dual-licensed under the BSD or MIT licenses, used here under the MIT License.\n` +
            `https://github.com/dbushell/Nestable\n\n${MIT_TEXT}`,
    },
];

const SEPARATOR = '\n--------------------------------------------------------------------------------\n';

/**
 * I will return the full text of the first file in the package directory whose name starts with one of the prefixes.
 */
function readFirst(dir, prefixes) {
    if (!fs.existsSync(dir)) {
        return null;
    }
    const file = fs.readdirSync(dir).sort()
        .find(f => prefixes.some(p => f.toUpperCase().startsWith(p)) && fs.statSync(path.join(dir, f)).isFile());
    return file ? fs.readFileSync(path.join(dir, file), 'utf8').trim() : null;
}

function entry(name, license, text) {
    return `Package: ${name}\nLicense: ${JSON.stringify(license)}\n\n${text}\n${SEPARATOR}`;
}

if (!fs.existsSync(licenseFile)) {
    console.error(`${licenseFile} not found - run the production build first.`);
    process.exit(1);
}

let content = fs.readFileSync(licenseFile, 'utf8');
const present = new Set([...content.matchAll(/^Package: (.+)$/gm)].map(m => m[1].trim()));
const added = [];

function add(name, license, text) {
    if (present.has(name)) {
        return;
    }
    if (!content.endsWith('\n')) {
        content += '\n';
    }
    content += entry(name, license, text);
    present.add(name);
    added.push(name);
}

for (const pkg of STYLE_PACKAGES) {
    const dir = path.join('node_modules', pkg);
    const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
    const text = readFirst(dir, ['LICENSE', 'LICENCE']);
    if (!text) {
        console.error(`No license file found for ${pkg}.`);
        process.exit(1);
    }
    add(pkg, manifest.license, text);
}

// NOTICE files and embedded subcomponent licenses of everything that is shipped.
for (const pkg of [...present]) {
    const dir = path.join('node_modules', pkg);
    if (!fs.existsSync(path.join(dir, 'package.json'))) {
        continue;
    }
    const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
    const notice = readFirst(dir, ['NOTICE']);
    if (notice) {
        add(`${pkg} (NOTICE)`, manifest.license, notice);
    }
    const subDir = path.join(dir, 'licenses');
    if (fs.existsSync(subDir) && fs.statSync(subDir).isDirectory()) {
        for (const file of fs.readdirSync(subDir).sort()) {
            add(`${pkg} (licenses/${file})`, manifest.license, fs.readFileSync(path.join(subDir, file), 'utf8').trim());
        }
    }
}

for (const item of IN_TREE) {
    add(item.name, item.license, item.text);
}

fs.writeFileSync(licenseFile, content);
fs.mkdirSync(path.dirname(servedFile), {recursive: true});
fs.copyFileSync(licenseFile, servedFile);
console.log(`3rdpartylicenses.txt: ${added.length} entries added${added.length ? ` (${added.join(', ')})` : ''}, copied to ${servedFile}`);
