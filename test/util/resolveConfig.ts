import fs from 'fs'
import { resolveConfig } from '../../src/util/resolveConfig'
import exampleImport from '../../example/import'

jest.mock('../../src/util/import', () => ((module: string) => exampleImport(module)))

const exampleDir = fs.realpathSync(__dirname + '/../../example/')
const packageDirA = fs.realpathSync(exampleDir + '/node_modules/package-a')
const packageDirB = fs.realpathSync(exampleDir + '/node_modules/package-b')
const packageDirC = fs.realpathSync(exampleDir + '/node_modules/package-c')

beforeAll(() => {
    process.chdir(exampleDir)
})

it('resolve with empty object if config does not exist', () => {
    const config = resolveConfig('non-existent-config.js')

    return expect(config).resolves.toEqual({
        scripts: {},
    })
})

it('resolve extensions', () => {
    const config = resolveConfig('scripts.config.js')

    return expect(config).resolves.toEqual({
        scripts: {
            'baz0': 'package-a/baz',
            'echo': packageDirB + '/echo',
            'bar': 'package-a/bar',
            'baz': packageDirB + '/baz',
            'foo': packageDirA + '/foo',
            'foobar': packageDirC + '/foobar',
        },
    })
})
