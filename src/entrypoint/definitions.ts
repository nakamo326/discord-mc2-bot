import { startEC2, stopEC2, statusServer } from "./commands.js";

export const commandMap = {
  start: async (payload) => {
    return await startEC2(payload);
  },
  stop: async (payload) => {
    return await stopEC2(payload);
  },
  status: async (payload) => {
    return await statusServer(payload);
  },
  test: async (payload) => {
    return "ﾎﾟﾝ";
  },
} as const;

export const isCommand = (command: string): command is keyof typeof commandMap => {
  return command in commandMap;
};
