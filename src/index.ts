import commander from 'commander'
import path from 'path'
import fs from 'fs'
import { release, ReleaseOption } from './release'
import { fsRequest } from './utils'

export interface UserOption {
  release?: ReleaseOption
}

const program = commander

function version() {
  return fsRequest(path.join(__dirname, '../package.json')).version
}

program
  .version(version())
  .command('release')
  .option('-b, --beta', 'Release a new beta version')
  .option('-a, --alpha', 'Release a new alpha version')
  .option('-p, --prerelease', 'Release a new alpha version')
  .description('Release a new version.')
  .action(releaseAction)

program.parse(process.argv)

function releaseAction(params: any) {
  const opt: UserOption = getConfig()

  release(opt.release, {
    beta: params.beta,
    alpha: params.alpha,
    prerelease: params.prerelease
  })
}

function getConfig() {
  const cwd = process.cwd()
  const confPath = path.join(cwd, 'glib.config.js')
  if (!fs.existsSync(confPath)) {
    return {}
  }

  return require(confPath)
}
