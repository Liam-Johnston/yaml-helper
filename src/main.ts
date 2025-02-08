import * as core from "@actions/core";

import { logger } from "./logger";
import { parse } from "yaml";

export const run = async () => {
  const fileLocation = core.getInput("file-location");
  const createIfDoesNotExist =
    core.getInput("create-if-does-not-exist") === "true";
  const contents = parse(core.getInput("contents"));

  logger.info({
    msg: "inputs",
    fileLocation,
    createIfDoesNotExist,
    contents
  });

  // const parsed = parse(contents)

  // core.

  // core.info({
  //   'msg'
  // })
};
