/* eslint-disable dot-notation */
const { setupWorkingKey, getWorkingKey, getWorkingBranch, pushWorkingKeyBranch, popWorkingKeyBranch, incrementWorkingKeyBranch, getWorkingKeyValue, resetIndices, restoreIndices, copyWorkingKey } = require('./working-key')

describe('working-key', () => {
  describe('setupWorkingKey', () => {
    it('should create key if none exists', () => {
      const mockSpace = {}
      const result = setupWorkingKey(mockSpace, 'mock-key')
      expect(result).toBeDefined()
      expect(mockSpace['mock-key']).toBe(result)
    })
  })

  describe('getWorkingKey', () => {
    it('should return workingKey if it has been setup', () => {
      const mockSpace = {}
      const workingKey = setupWorkingKey(mockSpace, 'mock-key')
      const getResult = getWorkingKey(mockSpace, 'mock-key')
      expect(getResult).toBe(workingKey)
    })
  })

  describe('getWorkingBranch', () => {
    it('should return empty on new key', () => {
      const mockSpace = {}
      setupWorkingKey(mockSpace, 'mock-key')
      const mockWorkingKeyBranch = getWorkingBranch(mockSpace, 'mock-key')

      expect(mockWorkingKeyBranch).toEqual('')
    })

    it('should return latest branch', () => {
      const mockSpace = {}
      setupWorkingKey(mockSpace, 'mock-key')
      const pushMockKeyBranch = pushWorkingKeyBranch(mockSpace, 'mock-key')
      pushMockKeyBranch('branch1')
      const mockWorkingKeyBranch = getWorkingBranch(mockSpace, 'mock-key')

      expect(mockWorkingKeyBranch).toEqual('branch1')
    })

    it('should return a combination of branches after multiple pushes', () => {
      const mockSpace = {}
      setupWorkingKey(mockSpace, 'mock-key')
      const pushMockKeyBranch = pushWorkingKeyBranch(mockSpace, 'mock-key')
      pushMockKeyBranch('branch1')
      pushMockKeyBranch('branch2')
      const mockWorkingKeyBranch = getWorkingBranch(mockSpace, 'mock-key')

      expect(mockWorkingKeyBranch).toEqual('branch1/branch2')
    })
  })

  describe('pushWorkingKeyBranch', () => {
    it('should add a new branch to the working key', () => {
      const mockSpace = {}
      const workingKey = setupWorkingKey(mockSpace, 'mock-key')
      const pushMockKeyBranch = pushWorkingKeyBranch(mockSpace, 'mock-key')
      pushMockKeyBranch('mock-branch')

      expect(workingKey.branch.length).toEqual(1)
      expect(workingKey.branch.slice(-1)[0]).toEqual('mock-branch')
      expect(workingKey.branchIndices['mock-branch']).toEqual(0)
    })
  })

  describe('pushWorkingKeyBranch', () => {
    it('should add a new branch to the working key', () => {
      const mockSpace = {}
      const workingKey = setupWorkingKey(mockSpace, 'mock-key')
      const pushMockKeyBranch = pushWorkingKeyBranch(mockSpace, 'mock-key')
      pushMockKeyBranch('mock-branch')

      expect(workingKey.branch.length).toEqual(1)
      expect(workingKey.branch.slice(-1)[0]).toEqual('mock-branch')
      expect(workingKey.branchIndices['mock-branch']).toEqual(0)
    })
  })

  describe('popWorkingKeyBranch', () => {
    it('should remove the latest branch', () => {
      const mockSpace = {}
      const workingKey = setupWorkingKey(mockSpace, 'mock-key')
      const pushMockKeyBranch = pushWorkingKeyBranch(mockSpace, 'mock-key')
      const popMockKeyBranch = popWorkingKeyBranch(mockSpace, 'mock-key')

      pushMockKeyBranch('mock-branch')
      popMockKeyBranch()

      expect(workingKey.branch.length).toEqual(0)
      expect(workingKey.branchIndices['mock-branch']).toEqual(0)
    })

    it('should not change the latest branch value', () => {
      const mockSpace = {}
      const workingKey = setupWorkingKey(mockSpace, 'mock-key')
      const pushMockKeyBranch = pushWorkingKeyBranch(mockSpace, 'mock-key')
      const popMockKeyBranch = popWorkingKeyBranch(mockSpace, 'mock-key')

      pushMockKeyBranch('mock-branch')
      incrementWorkingKeyBranch(mockSpace, 'mock-key')
      popMockKeyBranch()

      expect(workingKey.branch.length).toEqual(0)
      expect(workingKey.branchIndices['mock-branch']).toEqual(1)
    })
  })

  describe('incrementWorkingKeyBranch', () => {
    it('should update the latest branch value', () => {
      const mockSpace = {}
      const workingKey = setupWorkingKey(mockSpace, 'mock-key')
      const pushMockKeyBranch = pushWorkingKeyBranch(mockSpace, 'mock-key')

      pushMockKeyBranch('mock-branch')
      incrementWorkingKeyBranch(mockSpace, 'mock-key')

      expect(workingKey.branchIndices['mock-branch']).toEqual(1)
    })

    it('should not change other branch values', () => {
      const mockSpace = {}
      const workingKey = setupWorkingKey(mockSpace, 'mock-key')
      const pushMockKeyBranch = pushWorkingKeyBranch(mockSpace, 'mock-key')

      pushMockKeyBranch('branch1')
      pushMockKeyBranch('branch2')
      incrementWorkingKeyBranch(mockSpace, 'mock-key')

      expect(workingKey.branchIndices['branch1']).toEqual(0)
      expect(workingKey.branchIndices['branch1/branch2']).toEqual(1)
    })

    it('should work on a brand new key', () => {
      const mockSpace = {}
      const workingKey = setupWorkingKey(mockSpace, 'mock-key')

      incrementWorkingKeyBranch(mockSpace, 'mock-key')

      expect(workingKey.branchIndices['']).toEqual(1)
    })
  })

  describe('getWorkingKeyValue', () => {
    it('should return a value on a new key', () => {
      const mockSpace = {}
      setupWorkingKey(mockSpace, 'mock-key')

      const keyValue = getWorkingKeyValue(mockSpace, 'mock-key')
      expect(keyValue).toEqual('[0]')
    })

    it('should return the latest branch and that branch\'s value', () => {
      const mockSpace = {}
      setupWorkingKey(mockSpace, 'mock-key')
      const pushMockKeyBranch = pushWorkingKeyBranch(mockSpace, 'mock-key')

      pushMockKeyBranch('branch1')
      pushMockKeyBranch('branch2')
      incrementWorkingKeyBranch(mockSpace, 'mock-key')

      const keyValue = getWorkingKeyValue(mockSpace, 'mock-key')
      expect(keyValue).toEqual('branch1/branch2[1]')
    })
  })

  describe('resetIndices', () => {
    it('should reset all indices to 0', () => {
      const mockSpace = {}
      const workingKey = setupWorkingKey(mockSpace, 'mock-key')
      const pushMockKeyBranch = pushWorkingKeyBranch(mockSpace, 'mock-key')

      incrementWorkingKeyBranch(mockSpace, 'mock-key')
      incrementWorkingKeyBranch(mockSpace, 'mock-key')
      incrementWorkingKeyBranch(mockSpace, 'mock-key')
      pushMockKeyBranch('branch1')
      incrementWorkingKeyBranch(mockSpace, 'mock-key')
      pushMockKeyBranch('branch2')
      incrementWorkingKeyBranch(mockSpace, 'mock-key')
      incrementWorkingKeyBranch(mockSpace, 'mock-key')

      expect(workingKey.branchIndices['']).toEqual(3)
      expect(workingKey.branchIndices['branch1']).toEqual(1)
      expect(workingKey.branchIndices['branch1/branch2']).toEqual(2)

      resetIndices(mockSpace, 'mock-key')

      expect(workingKey.branchIndices['']).toEqual(0)
      expect(workingKey.branchIndices['branch1']).toEqual(0)
      expect(workingKey.branchIndices['branch1/branch2']).toEqual(0)
    })
  })

  describe('copyWorkingKey', () => {
    it('should keep copied working key from being modified', () => {
      const mockSpace = {}
      const workingKey = setupWorkingKey(mockSpace, 'mock-key')
      const pushMockKeyBranch = pushWorkingKeyBranch(mockSpace, 'mock-key')

      incrementWorkingKeyBranch(mockSpace, 'mock-key')
      incrementWorkingKeyBranch(mockSpace, 'mock-key')
      incrementWorkingKeyBranch(mockSpace, 'mock-key')
      pushMockKeyBranch('branch1')
      incrementWorkingKeyBranch(mockSpace, 'mock-key')
      pushMockKeyBranch('branch2')
      incrementWorkingKeyBranch(mockSpace, 'mock-key')
      incrementWorkingKeyBranch(mockSpace, 'mock-key')

      expect(workingKey.branchIndices['']).toEqual(3)
      expect(workingKey.branchIndices['branch1']).toEqual(1)
      expect(workingKey.branchIndices['branch1/branch2']).toEqual(2)

      const workingKeyCopy = copyWorkingKey(mockSpace, 'mock-key');

      incrementWorkingKeyBranch(mockSpace, 'mock-key')
      incrementWorkingKeyBranch(mockSpace, 'mock-key')

      expect(workingKeyCopy.branchIndices['']).toEqual(3)
      expect(workingKeyCopy.branchIndices['branch1']).toEqual(1)
      expect(workingKeyCopy.branchIndices['branch1/branch2']).toEqual(2)
    })
  })

  describe('restoreIndices', () => {
    it('should restore all indices to the existing key value', () => {
      const mockSpace = {}
      const workingKey = setupWorkingKey(mockSpace, 'mock-key')
      const pushMockKeyBranch = pushWorkingKeyBranch(mockSpace, 'mock-key')

      incrementWorkingKeyBranch(mockSpace, 'mock-key')
      incrementWorkingKeyBranch(mockSpace, 'mock-key')
      incrementWorkingKeyBranch(mockSpace, 'mock-key')
      pushMockKeyBranch('branch1')
      incrementWorkingKeyBranch(mockSpace, 'mock-key')
      pushMockKeyBranch('branch2')
      incrementWorkingKeyBranch(mockSpace, 'mock-key')
      incrementWorkingKeyBranch(mockSpace, 'mock-key')

      expect(workingKey.branchIndices['']).toEqual(3)
      expect(workingKey.branchIndices['branch1']).toEqual(1)
      expect(workingKey.branchIndices['branch1/branch2']).toEqual(2)

      const workingKeyCopy = copyWorkingKey(mockSpace, 'mock-key');
      resetIndices(mockSpace, 'mock-key')
      restoreIndices(mockSpace, 'mock-key', workingKeyCopy)

      expect(workingKey.branchIndices['']).toEqual(3)
      expect(workingKey.branchIndices['branch1']).toEqual(1)
      expect(workingKey.branchIndices['branch1/branch2']).toEqual(2)
    })
  })
})
