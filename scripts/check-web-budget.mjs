import {readdirSync, statSync} from "node:fs";
import {join} from "node:path";

const assetsDir = "dist/assets";
const files = readdirSync(assetsDir);

function totalFor(extension) {
  return files
    .filter((file) => file.endsWith(extension))
    .reduce((total, file) => total + statSync(join(assetsDir, file)).size, 0);
}

const jsBytes = totalFor(".js");
const cssBytes = totalFor(".css");

const budgets = {
  js: 350 * 1024,
  css: 250 * 1024
};

const format = (bytes) => `${(bytes / 1024).toFixed(1)} KiB`;

console.log(`[budget] JS: ${format(jsBytes)} / ${format(budgets.js)}`);
console.log(`[budget] CSS: ${format(cssBytes)} / ${format(budgets.css)}`);

const failures = [];

if (jsBytes > budgets.js) {
  failures.push(`JS budget exceeded: ${format(jsBytes)} > ${format(budgets.js)}`);
}

if (cssBytes > budgets.css) {
  failures.push(`CSS budget exceeded: ${format(cssBytes)} > ${format(budgets.css)}`);
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error("[budget] " + failure);
  }

  process.exitCode = 1;
}
