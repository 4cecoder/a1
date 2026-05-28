#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

const CONFIG_PATH = resolve(process.cwd(), "tools/lane-boundaries.json");

function escapeRegex(input) {
  return input.replace(/[|\\{}()[\]^$+?.]/g, "\\$&");
}

function globToRegex(glob) {
  let out = "^";

  for (let i = 0; i < glob.length; i += 1) {
    const char = glob[i];
    const next = glob[i + 1];

    if (char === "*") {
      if (next === "*") {
        out += ".*";
        i += 1;
      } else {
        out += "[^/]*";
      }
      continue;
    }

    if (char === "?") {
      out += "[^/]";
      continue;
    }

    out += escapeRegex(char);
  }

  out += "$";
  return new RegExp(out);
}

function loadConfig() {
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
  } catch (error) {
    console.error(`✖ Failed to read config: ${CONFIG_PATH}`);
    console.error(String(error?.message || error));
    process.exit(2);
  }

  if (!parsed || !Array.isArray(parsed.lanes)) {
    console.error('✖ Invalid config: "lanes" must be an array.');
    process.exit(2);
  }

  const lanes = parsed.lanes.map((lane, index) => {
    if (!lane || typeof lane.name !== "string" || !Array.isArray(lane.globs)) {
      console.error(`✖ Invalid lane at index ${index}: expected { name, globs[] }.`);
      process.exit(2);
    }

    return {
      name: lane.name,
      globs: lane.globs,
      matchers: lane.globs.map(globToRegex),
      files: [],
    };
  });

  const sharedGlobs = Array.isArray(parsed.sharedPaths) ? parsed.sharedPaths : [];
  const sharedMatchers = sharedGlobs.map(globToRegex);

  return { lanes, sharedMatchers };
}

function getStagedFiles() {
  try {
    const output = execFileSync(
      "git",
      ["diff", "--cached", "--name-only", "--diff-filter=ACMRD"],
      { encoding: "utf8" }
    );

    return output
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  } catch (error) {
    console.error("✖ Failed to read staged files from git index.");
    console.error(String(error?.message || error));
    process.exit(2);
  }
}

function matchesAny(path, matchers) {
  return matchers.some((matcher) => matcher.test(path));
}

function printList(title, items) {
  if (items.length === 0) return;
  console.log(`\n${title}`);
  for (const item of items) {
    console.log(`  - ${item}`);
  }
}

function main() {
  const { lanes, sharedMatchers } = loadConfig();
  const stagedFiles = getStagedFiles();

  if (stagedFiles.length === 0) {
    console.log("✔ No staged files. Lane boundary check passed.");
    process.exit(0);
  }

  const sharedFiles = [];
  const unownedFiles = [];
  const conflicts = [];

  for (const file of stagedFiles) {
    if (matchesAny(file, sharedMatchers)) {
      sharedFiles.push(file);
      continue;
    }

    const owners = lanes.filter((lane) => matchesAny(file, lane.matchers));

    if (owners.length === 0) {
      unownedFiles.push(file);
      continue;
    }

    if (owners.length > 1) {
      conflicts.push({ file, owners: owners.map((owner) => owner.name) });
      continue;
    }

    owners[0].files.push(file);
  }

  console.log("Lane Boundary Report");
  console.log("====================");
  console.log(`Staged files: ${stagedFiles.length}`);

  for (const lane of lanes) {
    if (lane.files.length === 0) continue;
    printList(lane.name, lane.files);
  }

  printList("Shared path edits (allowed)", sharedFiles);
  printList("Unowned staged files (warning)", unownedFiles);

  if (conflicts.length > 0) {
    console.log("\nConflicting ownership (blocked)");
    for (const conflict of conflicts) {
      console.log(`  - ${conflict.file}`);
      console.log(`    owners: ${conflict.owners.join(", ")}`);
    }

    console.log("\n✖ Lane boundary check failed: conflicting ownership detected.");
    process.exit(1);
  }

  console.log("\n✔ Lane boundary check passed.");
  process.exit(0);
}

main();
