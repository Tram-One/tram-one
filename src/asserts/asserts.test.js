const asserts = require('./asserts')

describe('asserts', () => {
  describe('assertIsObject', () => {
    describe('with undefined', () => {
      it('should not throw error if undefined is allowed', () => {
        const check = () => asserts.assertIsObject(undefined, 'test-object', true)
        expect(check).not.toThrow()
      })

      it('should throw error if undefined is not allowed', () => {
        const check = () => asserts.assertIsObject(undefined, 'test-object', false)
        expect(check).toThrow()
      })

      it('should throw error by default', () => {
        const check = () => asserts.assertIsObject(undefined, 'test-object')
        expect(check).toThrow()
      })
    })

    describe('with value', () => {
      it('should not throw if value is an object', () => {
        const check = () => asserts.assertIsObject({}, 'test-object', true)
        expect(check).not.toThrow()
      })

      it('should throw if value is an array', () => {
        const check = () => asserts.assertIsObject([], 'test-object', true)
        expect(check).toThrow()
      })

      it('should throw if value is a string', () => {
        const check = () => asserts.assertIsObject('', 'test-object', true)
        expect(check).toThrow()
      })

      it('should throw if value is a number', () => {
        const check = () => asserts.assertIsObject(10, 'test-object', true)
        expect(check).toThrow()
      })

      it('should throw if value is a function', () => {
        const check = () => asserts.assertIsObject(() => {}, 'test-object', true)
        expect(check).toThrow()
      })
    })

    describe('throw message', () => {
      it('should include variable name', () => {
        const check = () => asserts.assertIsObject(() => {}, 'test-object', true)
        expect(check).toThrow(expect.objectContaining({
          message: expect.stringMatching(/test-object/)
        }))
      })

      it('should include shape', () => {
        const check = () => asserts.assertIsObject(() => {}, 'test-object', true, 'some kinda object')
        expect(check).toThrow(expect.objectContaining({
          message: expect.stringMatching(/some kinda object/)
        }))
      })

      it('should include `an object` by default', () => {
        const check = () => asserts.assertIsObject(() => {}, 'test-object', true)
        expect(check).toThrow(expect.objectContaining({
          message: expect.stringMatching(/an object/)
        }))
      })
    })
  })

  describe('assertIsString', () => {
    describe('with undefined', () => {
      it('should not throw error if undefined is allowed', () => {
        const check = () => asserts.assertIsString(undefined, 'test-string', true)
        expect(check).not.toThrow()
      })

      it('should throw error if undefined is not allowed', () => {
        const check = () => asserts.assertIsString(undefined, 'test-string', false)
        expect(check).toThrow()
      })

      it('should throw error by default', () => {
        const check = () => asserts.assertIsString(undefined, 'test-string')
        expect(check).toThrow()
      })
    })

    describe('with value', () => {
      it('should throw if value is an object', () => {
        const check = () => asserts.assertIsString({}, 'test-string', true)
        expect(check).toThrow()
      })

      it('should throw if value is an array', () => {
        const check = () => asserts.assertIsString([], 'test-string', true)
        expect(check).toThrow()
      })

      it('should not throw if value is a string', () => {
        const check = () => asserts.assertIsString('', 'test-string', true)
        expect(check).not.toThrow()
      })

      it('should throw if value is a number', () => {
        const check = () => asserts.assertIsString(10, 'test-string', true)
        expect(check).toThrow()
      })

      it('should throw if value is a function', () => {
        const check = () => asserts.assertIsString(() => {}, 'test-string', true)
        expect(check).toThrow()
      })
    })

    describe('throw message', () => {
      it('should include variable name', () => {
        const check = () => asserts.assertIsString(() => {}, 'test-string', true)
        expect(check).toThrow(expect.objectContaining({
          message: expect.stringMatching(/test-string/)
        }))
      })

      it('should include shape', () => {
        const check = () => asserts.assertIsString(() => {}, 'test-string', true, 'some kinda string')
        expect(check).toThrow(expect.objectContaining({
          message: expect.stringMatching(/some kinda string/)
        }))
      })

      it('should include `a string` by default', () => {
        const check = () => asserts.assertIsString(() => {}, 'test-string', true)
        expect(check).toThrow(expect.objectContaining({
          message: expect.stringMatching(/a string/)
        }))
      })
    })
  })

  describe('assertIsDefined', () => {
    describe('with value', () => {
      it('should throw if value is undefined', () => {
        const check = () => asserts.assertIsDefined(undefined, 'test-defined')
        expect(check).toThrow()
      })

      it('should not throw if value is defined (an array)', () => {
        const check = () => asserts.assertIsDefined([], 'test-defined')
        expect(check).not.toThrow()
      })
    })

    describe('throw message', () => {
      it('should include variable name', () => {
        const check = () => asserts.assertIsDefined(undefined, 'test-defined')
        expect(check).toThrow(expect.objectContaining({
          message: expect.stringMatching(/test-defined/)
        }))
      })

      it('should include shape', () => {
        const check = () => asserts.assertIsDefined(undefined, 'test-defined', 'some kinda defined value')
        expect(check).toThrow(expect.objectContaining({
          message: expect.stringMatching(/some kinda defined value/)
        }))
      })

      it('should include `defined` by default', () => {
        const check = () => asserts.assertIsDefined(undefined, 'test-defined')
        expect(check).toThrow(expect.objectContaining({
          message: expect.stringMatching(/defined/)
        }))
      })
    })
  })

  describe('assertGlobalSpaceAndEngine', () => {
    it('should throw if globalSpace is not an object', () => {
      const check = () => asserts.assertGlobalSpaceAndEngine('test-engine-name', 'not-a-valid-global-space', 'engine-value')
      expect(check).toThrow(expect.objectContaining({
        message: expect.stringMatching(/globalSpace/)
      }))
    })
    it('should throw if engineValue is not a string', () => {
      const check = () => asserts.assertGlobalSpaceAndEngine('test-engine-name', undefined, null)
      expect(check).toThrow(expect.objectContaining({
        message: expect.stringMatching(/test-engine-name/)
      }))
    })
  })
})
