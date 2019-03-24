const { setupLog, getLog, clearLog } = require('./log')

describe('log', () => {
  describe('setupLog', () => {
    it('should return false if there is no globalSpace', () => {
      const setupResult = setupLog(null, 'mock-log')
      expect(setupResult).toBeFalsy()
    })

    it('should return an existing log if one already exists', () => {
      const mockLog = {}
      const mockSpace = {
        'mock-log': mockLog
      }
      const setupResult = setupLog(mockSpace, 'mock-log')
      expect(setupResult).toBe(mockSpace['mock-log'])
    })

    it('should create new log if none exists', () => {
      const mockSpace = {}
      const setupResult = setupLog(mockSpace, 'mock-log')
      expect(setupResult).toBeDefined()
    })
  })

  describe('getLog', () => {
    it('should return empty object if there is no globalSpace', () => {
      const getResult = getLog(null, 'mock-log')
      expect(getResult).toBeFalsy()
    })

    it('should return empty object if log is not setup', () => {
      const mockSpace = {}
      const getResult = getLog(mockSpace, 'mock-log')
      expect(getResult).toBeFalsy()
    })

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
