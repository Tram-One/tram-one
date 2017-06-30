const numberExample = require('./app')

describe('Number Example', () => {
  describe('reducer', () => {
    it('should increment the current value', () => {
      const state = 2
      const nextState = numberExample.reducer(state, {type: 'INCREMENT'})
      expect(nextState).toEqual(3)
    })
    it('should decrement the current value', () => {
      const state = 2
      const nextState = numberExample.reducer(state, {type: 'DECREMENT'})
      expect(nextState).toEqual(1)
    })
  })
  describe('home page', () => {
    it('should have some text', () => {
      const page = numberExample.pages.homePage()
      expect(page.innerHTML).toEqual('HOME')
    })
  })
  describe('number page', () => {
    it('should have some numbers', () => {
      const state = {number: 2}
      const page = numberExample.pages.numberPage(state)
      expect(page.innerHTML).toContain('2')
    })
  })
})
