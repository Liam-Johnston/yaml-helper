import * as core from "@actions/core";

import { COMMAND_START } from "./constants";
import pino from "pino";

const durationSinceStartInSeconds = () => {
  const now = new Date();

  const differenceInMilliseconds = now.getTime() - COMMAND_START.getTime();

  return differenceInMilliseconds / 1000;
};

export const logger = pino({
  timestamp: () => `,"time":"${durationSinceStartInSeconds()} s"`,
  formatters: {
    level: (label) => ({ level: label }),
  },
  transport: { target: "pino-pretty" },
  level: core.isDebug() ? 'debug' : 'info',
});
