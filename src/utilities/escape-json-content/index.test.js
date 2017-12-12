/* eslint-disable no-useless-escape */
import { expect } from 'chai'
import escapeJsonContent from './index'

describe('Escape JSON content', () => {

  it('should escape all forward slashes', () => {
    const actual = escapeJsonContent({ test: 'test/test' })
    const expected = '{"test":"test\\/test"}'
    expect(actual).to.equal(expected)
  })

  it('should escape line terminator characters', () => {
    const actual = escapeJsonContent({ test: '\u2028' })
    const expected = '{"test":"\\u2028"}'
    expect(actual).to.equal(expected)
  })
})
