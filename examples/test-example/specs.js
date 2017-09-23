// to run these specs, run `npm install` and `npm test` in this directory

const numberExample = require('./app')

describe('Number Example', () => {
  describe('home page', () => {
    it('should have some text', () => {
      const page = numberExample.pages.homePage()
      expect(page.toString()).toMatch('HOME')
    })
  })
  describe('number page', () => {
    it('should have some numbers', () => {
      const state = {url: {number: 2}}
      const page = numberExample.pages.numberPage(state)
      expect(page.toString()).toContain('2')
    })
  })
  describe('home route in the app', () => {
    it('should have some text', () => {
      const page = numberExample.app.toNode('/')
      expect(page.toString()).toMatch('HOME')
    })
  })
  describe('number route in the app', () => {
    it('should have some numbers', () => {
      const page = numberExample.app.toNode('/5')
      expect(page.toString()).toMatch('5')
    })
  })
})
