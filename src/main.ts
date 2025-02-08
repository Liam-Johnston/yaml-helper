import * as core from '@actions/core'

export const run = async () => {
  const ms: string = core.getInput('milliseconds')
  console.log(ms)
}
