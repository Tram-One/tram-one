const { setupWorkingKey } = require('./working-key')

describe('working-key', () => {
  describe('setupWorkingKey', () => {
    it('should return false if there is no global space', () => {
      const result = setupWorkingKey(null, 'mock-key')
      expect(result).toBeFalsy()
    })

    it('should return existing key if one exists', () => {
      const mockKey = {}
      const mockSpace = {
        'mock-key': mockKey
      }
      const result = setupWorkingKey(mockSpace, 'mock-key')
      expect(result).toBe(mockKey)
      expect(mockSpace['mock-key']).toBe(mockKey)
    })

    it('should create key if none exists', () => {
      const mockSpace = {}
      const result = setupWorkingKey(mockSpace, 'mock-key')
      expect(result).toBeDefined()
      expect(mockSpace['mock-key']).toBe(result)
    })
  })

  describe('getWorkingKey', () => {

  })
})
