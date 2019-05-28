const { setupLog, getLog, clearLog } = require('./log')

describe('log', () => {
  describe('setupLog', () => {
    it('should create new log if none exists', () => {
      const mockSpace = {}
      const setupResult = setupLog(mockSpace, 'mock-log')
      expect(setupResult).toBeDefined()
    })
  })

  describe('getLog', () => {
    it('should return log if it has been setup', () => {
      const mockSpace = {}
      const log = setupLog(mockSpace, 'mock-log')
      const getResult = getLog(mockSpace, 'mock-log')
      expect(getResult).toBe(log)
    })
  })

  describe('clearLog', () => {
    it('should return an empty object if there is no globalSpace', () => {
      const clearResult = clearLog(null, 'mock-log')
      expect(clearResult).toEqual({})
    })

    it('should return an empty object if there is no log', () => {
      const mockSpace = {}
      const clearResult = clearLog(mockSpace, 'mock-log')
      expect(clearResult).toEqual({})
    })

    it('should clear existing log if one exists', () => {
      const mockSpace = {}
      const log = setupLog(mockSpace, 'mock-log')
      log['mock-value'] = 10
      const clearResult = clearLog(mockSpace, 'mock-log')
      expect(clearResult).toEqual({})
      expect(log['mock-value']).toBeUndefined()
    })
  })
})
