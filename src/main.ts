import * as core from "@actions/core";

import { parse, stringify } from "yaml";

import deepmerge from "deepmerge";
import { existsSync } from "fs";
import { logger } from "./logger";
import { readFile } from "fs/promises";
import { writeFile } from "fs/promises";

const getParsedContents = (rawContents: string) => {
  if (rawContents === "") {
    return {};
  }

  try {
    return parse(rawContents);
  } catch (error: any) {
    logger.error({
      msg: "failed to parse provided content - is the content in yaml format?",
      rawContents,
      ...error,
    });

    throw new Error("Invalid format for provided contents");
  }
};

const getExistingFileContents = async (
  fileLocation: string,
  fileExists: boolean
) => {
  if (!fileExists) {
    logger.debug({
      msg: "file doesn't exist so starting with a blank object",
    });

    return {};
  }

  const rawFileContents = await readFile(fileLocation, "utf8");

  logger.debug({
    msg: "loaded file contents",
    rawFileContents,
  });

  try {
    return parse(rawFileContents);
  } catch (error: any) {
    logger.error({
      msg: "failed to parse supplied yaml file contents",
      rawFileContents,
      ...error,
    });
  }
};

const generateFinalContents = (yamlSchema: string, mergedContents: any) => {
  return yamlSchema !== ""
    ? `# yaml-language-server: $schema=${yamlSchema}\n\n`
    : "" + stringify(mergedContents);
};

const _run = async () => {
  logger.debug({
    msg: "action starting",
  });

  const fileLocation = core.getInput("file-location", {
    required: true,
  });

  const createIfDoesNotExist = core.getBooleanInput("create-if-does-not-exist");

  const fileExists = existsSync(fileLocation);

  const yamlSchema = core.getInput("yaml-schema");

  if (!createIfDoesNotExist && !fileExists) {
    throw new Error("File doesn't exist and flag to create file is not true");
  }

  const rawContents = core.getInput("content");

  logger.debug({
    msg: "parameters determined",
    fileLocation,
    createIfDoesNotExist,
    rawContents,
    fileExists,
    yamlSchema,
  });

  const parsedContents = getParsedContents(rawContents);

  logger.debug({
    msg: "parsed provided contents",
    parsedContents,
  });

  const existingFileContents = await getExistingFileContents(
    fileLocation,
    fileExists
  );

  logger.debug({
    msg: "loaded existing file contents (if it existed)",
    existingFileContents,
  });

  const mergedContents = deepmerge(existingFileContents, parsedContents);

  logger.debug({
    msg: "merged contents of provided and existing file contents",
    mergedContents,
  });

  const finalContents = generateFinalContents(yamlSchema, mergedContents);

  logger.debug({
    msg: "generated file contents",
    finalContents,
  });

  try {
    await writeFile(fileLocation, finalContents);
  } catch (error: any) {
    logger.error({
      msg: "failed to write contents to file",
      finalContents,
      fileLocation,
      ...error
    });

    throw new Error("Failed to write merged content to file");
  }

  const fileCreated = !fileExists;

  logger.debug({
    msg: "finished processing action",
    finalContents,
    fileLocation,
    fileCreated,
  });

  core.setOutput("file-location", fileLocation);
  core.setOutput("file-created", fileCreated);
  core.setOutput("file-contents", finalContents);

  logger.debug({
    msg: "completed setting outputs - exiting",
  });
};

export const run = async () => {
  try {
    await _run();
  } catch (error: any) {
    core.setFailed(error.message ?? "action failed");
  }
};
