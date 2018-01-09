import { expect } from 'chai'
import resolvePaths from './index'

describe('Resolve paths', () => {
  it('should return original paths', () => {
    const { paths } = resolvePaths({ paths: 'hello' })
    const expected = 'hello'
    expect(paths).to.equal(expected)
  })

  it('should return modified paths if function', () => {
    const { paths } = resolvePaths({
      paths: params => `hello ${params}`,
      params: 'world'
    })
    const expected = 'hello world'
    expect(paths).to.equal(expected)
  })

  it('should run callback method if passed', () => {
    const { paths, result } = resolvePaths({
      paths: 'hello',
      cb: () => 'world'
    })
    expect(paths).to.equal('hello')
    expect(result).to.equal('world')
  })
})
