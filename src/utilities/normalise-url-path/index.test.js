import { expect } from 'chai'
import normaliseUrlPath from './index'

describe('Normalise URL Path', () => {
  it('should remove double slashes', () => {
    const actual = normaliseUrlPath('//testing///something//')
    const expected = 'testing/something'
    expect(actual).to.equal(expected)
  })

  it('should not remove protocol double slash', () => {
    expect(normaliseUrlPath('http://testing.com///something//')).to.equal(
      'http://testing.com/something'
    )
    expect(normaliseUrlPath('https://testing.com///something//')).to.equal(
      'https://testing.com/something'
    )
  })

  it('should remove the leading and trailing slashes', () => {
    const actual = normaliseUrlPath('/testing/something/')
    const expected = 'testing/something'
    expect(actual).to.equal(expected)
  })

  it("should not touch '/'", () => {
    const actual = normaliseUrlPath('/')
    const expected = '/'
    expect(actual).to.equal(expected)
  })
})
