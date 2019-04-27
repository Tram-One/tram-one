const useUrlParams = require('./useUrlParams')

describe('useUrlParams', () => {
  describe('with mock getPath function', () => {
    it('should match with matching path from function', () => {
      const mockGetPath = () => '/fake-id/list'
      const useUrlParamsWithMock = useUrlParams(mockGetPath)
      const params = useUrlParamsWithMock('/:account/list')
      expect(params).toEqual(
        expect.objectContaining({account: 'fake-id'})
      )
    })

    it('should not match with non-matching path from function', () => {
      const mockGetPath = () => '/fake-id/list'
      const useUrlParamsWithMock = useUrlParams(mockGetPath)
      const params = useUrlParamsWithMock('/:account/page')
      expect(params).toBeFalsy()
    })

    it('should match with matching path with no variables from function', () => {
      const mockGetPath = () => '/list'
      const useUrlParamsWithMock = useUrlParams(mockGetPath)
      const params = useUrlParamsWithMock('/list')
      expect(params).toEqual({})
    })

    it('should not match with non-matching path with no variables from function', () => {
      const mockGetPath = () => '/list'
      const useUrlParamsWithMock = useUrlParams(mockGetPath)
      const params = useUrlParamsWithMock('/page')
      expect(params).toBeFalsy()
    })
  })
})
