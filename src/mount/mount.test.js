/* eslint-disable max-nested-callbacks */
const { registerHtml } = require('../dom')
const { setupEffectStore } = require('../effect-store')
const { useEffect } = require('../hooks')
const { setupWorkingKey } = require('../working-key')
const { setupRenderLock } = require('../render-lock')
const { mount } = require('./mount')

const html = registerHtml()()

describe('mount', () => {
  describe('with element as a selector', () => {
    describe('without globalSpace', () => {
      describe('without existing element', () => {
        it('should create new element', () => {
          const target = document.createElement('div')
          const mountNoGlobal = mount(null, 'mock-store', 'mock-working-key')
          const mockComponent = () => {
            return html`<div><h1>Mock Component</h1></div>`
          }

          mountNoGlobal(target, mockComponent)
          expect(target.outerHTML).toEqual('<div><div><h1>Mock Component</h1></div></div>')
        })

        it('should call start effects', () => {
          const target = document.createElement('div')
          const mountNoGlobal = mount(null, 'mock-store', 'mock-working-key')
          const mockStartEffect = jest.fn()
          const mockEffect = () => {
            mockStartEffect()
          }

          const mockComponent = () => {
            useEffect(null, 'mock-queue', 'mock-working-key')(mockEffect)
            return html`<div><h1>Mock Component</h1></div>`
          }

          mountNoGlobal(target, mockComponent)
          expect(mockStartEffect).toHaveBeenCalled()
        })

        it('should call cleanup effects', () => {
          const target = document.createElement('div')
          const mountNoGlobal = mount(null, 'mock-store', 'mock-working-key')
          const mockCleanupEffect = jest.fn()
          const mockEffect = () => {
            return mockCleanupEffect
          }

          const mockComponent = () => {
            useEffect(null, 'mock-queue', 'mock-working-key')(mockEffect)
            return html`<div><h1>Mock Component</h1></div>`
          }

          mountNoGlobal(target, mockComponent)
          expect(mockCleanupEffect).toHaveBeenCalled()
        })
      })

      describe('with existing element', () => {
        it('should update existing element', () => {
          const target = document.createElement('div')
          const mountNoGlobal = mount(null, 'mock-store', 'mock-working-key')
          const mockComponent = () => {
            return html`<div><h1>Mock Component</h1></div>`
          }

          mountNoGlobal(target, mockComponent)
          const mockComponentUpdate = () => html`<div><h1>Mock Updated Component</h1></div>`
          mountNoGlobal(target, mockComponentUpdate)
          expect(target.outerHTML).toEqual('<div><div><h1>Mock Updated Component</h1></div></div>')
        })

        it('should call cleanup effect', () => {
          const target = document.createElement('div')
          const mountNoGlobal = mount(null, 'mock-store', 'mock-working-key')
          const mockCleanupEffect = jest.fn()
          const mockEffect = () => {
            return mockCleanupEffect
          }

          const mockComponent = () => {
            useEffect(null, 'mock-queue', 'mock-working-key')(mockEffect)
            return html`<div><h1>Mock Component</h1></div>`
          }

          mountNoGlobal(target, mockComponent)
          const mockComponentUpdate = () => html`<div><h1>Mock Updated Component</h1></div>`
          mountNoGlobal(target, mockComponentUpdate)
          expect(mockCleanupEffect).toHaveBeenCalled()
        })
      })
    })

    describe('with globalSpace', () => {
      describe('without existing element', () => {
        it('should create new element', () => {
          const target = document.createElement('div')
          const mockSpace = {}
          setupEffectStore(mockSpace, 'mock-store')
          setupEffectStore(mockSpace, 'mock-queue')
          setupWorkingKey(mockSpace, 'mock-working-key')
          setupRenderLock(mockSpace, 'mock-render-lock')
          const mountWithStore = mount(mockSpace, 'mock-store', 'mock-queue', 'mock-working-key', 'mock-render-lock')
          const mockComponent = () => {
            return html`<div><h1>Mock Component</h1></div>`
          }

          mountWithStore(target, mockComponent)
          expect(target.outerHTML).toEqual('<div><div><h1>Mock Component</h1></div></div>')
        })

        it('should call the start effect', () => {
          const target = document.createElement('div')
          const mockSpace = {}
          setupEffectStore(mockSpace, 'mock-store')
          setupEffectStore(mockSpace, 'mock-queue')
          setupWorkingKey(mockSpace, 'mock-working-key')
          setupRenderLock(mockSpace, 'mock-render-lock')
          const mountWithStore = mount(mockSpace, 'mock-store', 'mock-queue', 'mock-working-key', 'mock-render-lock')
          const mockStartEffect = jest.fn()
          const mockEffect = () => {
            mockStartEffect()
          }

          const mockComponent = () => {
            useEffect(mockSpace, 'mock-queue', 'mock-working-key')(mockEffect)
            return html`<div><h1>Mock Component</h1></div>`
          }

          mountWithStore(target, mockComponent)
          expect(mockStartEffect).toHaveBeenCalled()
        })

        it('should not call the cleanup effect', () => {
          const target = document.createElement('div')
          const mockSpace = {}
          setupEffectStore(mockSpace, 'mock-store')
          setupEffectStore(mockSpace, 'mock-queue')
          setupWorkingKey(mockSpace, 'mock-working-key')
          setupRenderLock(mockSpace, 'mock-render-lock')
          const mountWithStore = mount(mockSpace, 'mock-store', 'mock-queue', 'mock-working-key', 'mock-render-lock')
          const mockCleanupEffect = jest.fn()
          const mockEffect = () => {
            return mockCleanupEffect
          }

          const mockComponent = () => {
            useEffect(mockSpace, 'mock-queue', 'mock-working-key')(mockEffect)
            return html`<div><h1>Mock Component</h1></div>`
          }

          mountWithStore(target, mockComponent)
          expect(mockCleanupEffect).not.toHaveBeenCalled()
        })
      })

      describe('with existing element', () => {
        it('should update existing element', () => {
          const target = document.createElement('div')
          const mockSpace = {}
          setupEffectStore(mockSpace, 'mock-store')
          setupEffectStore(mockSpace, 'mock-queue')
          setupWorkingKey(mockSpace, 'mock-working-key')
          setupRenderLock(mockSpace, 'mock-render-lock')
          const mountWithStore = mount(mockSpace, 'mock-store', 'mock-queue', 'mock-working-key', 'mock-render-lock')
          const mockComponent = () => {
            return html`<div><h1>Mock Component</h1></div>`
          }

          mountWithStore(target, mockComponent)
          const mockComponentUpdate = () => html`<div><h1>Mock Updated Component</h1></div>`
          mountWithStore(target, mockComponentUpdate)
          expect(target.outerHTML).toEqual('<div><div><h1>Mock Updated Component</h1></div></div>')
        })

        it('should not call effects on second mount (when same)', () => {
          const target = document.createElement('div')
          const mockSpace = {}
          setupEffectStore(mockSpace, 'mock-store')
          setupEffectStore(mockSpace, 'mock-queue')
          setupWorkingKey(mockSpace, 'mock-working-key')
          setupRenderLock(mockSpace, 'mock-render-lock')
          const mountWithStore = mount(mockSpace, 'mock-store', 'mock-queue', 'mock-working-key', 'mock-render-lock')
          const mockStartEffect = jest.fn()
          const mockCleanupEffect = jest.fn()
          const mockEffect = () => {
            mockStartEffect()
            return mockCleanupEffect
          }

          const mockComponent = () => {
            useEffect(mockSpace, 'mock-queue', 'mock-working-key')(mockEffect)
            return html`<div><h1>Mock Component</h1></div>`
          }

          mountWithStore(target, mockComponent)
          expect(mockStartEffect).toHaveBeenCalled()
          expect(mockCleanupEffect).not.toHaveBeenCalled()
          mockStartEffect.mockClear()
          mockCleanupEffect.mockClear()
          mountWithStore(target, mockComponent)
          expect(mockStartEffect).not.toHaveBeenCalled()
          expect(mockCleanupEffect).not.toHaveBeenCalled()
        })

        it('should call cleanup effect on second mount (when different)', () => {
          const target = document.createElement('div')
          const mockSpace = {}
          setupEffectStore(mockSpace, 'mock-store')
          setupEffectStore(mockSpace, 'mock-queue')
          setupWorkingKey(mockSpace, 'mock-working-key')
          setupRenderLock(mockSpace, 'mock-render-lock')
          const mountWithStore = mount(mockSpace, 'mock-store', 'mock-queue', 'mock-working-key', 'mock-render-lock')
          const mockStartEffect = jest.fn()
          const mockCleanupEffect = jest.fn()
          const mockEffect = () => {
            mockStartEffect()
            return mockCleanupEffect
          }

          const mockComponent = () => {
            useEffect(mockSpace, 'mock-queue', 'mock-working-key')(mockEffect)
            return html`<div><h1>Mock Component</h1></div>`
          }

          mountWithStore(target, mockComponent)
          const mockComponentUpdate = () => html`<div><h1>Mock Updated Component</h1></div>`
          mountWithStore(target, mockComponent)
          expect(mockStartEffect).toHaveBeenCalled()
          expect(mockCleanupEffect).not.toHaveBeenCalled()
          mockStartEffect.mockClear()
          mockCleanupEffect.mockClear()
          mountWithStore(target, mockComponentUpdate)
          expect(mockStartEffect).not.toHaveBeenCalled()
          expect(mockCleanupEffect).toHaveBeenCalled()
        })

        it('should call effects on second mount with updated triggers', () => {
          const target = document.createElement('div')
          const mockSpace = {}
          setupEffectStore(mockSpace, 'mock-store')
          setupEffectStore(mockSpace, 'mock-queue')
          setupWorkingKey(mockSpace, 'mock-working-key')
          setupRenderLock(mockSpace, 'mock-render-lock')
          const mountWithStore = mount(mockSpace, 'mock-store', 'mock-queue', 'mock-working-key', 'mock-render-lock')
          const mockStartEffect = jest.fn()
          const mockCleanupEffect = jest.fn()
          const mockEffect = () => {
            mockStartEffect()
            return mockCleanupEffect
          }

          const mockComponent = () => {
            useEffect(mockSpace, 'mock-queue', 'mock-working-key')(mockEffect, [0])
            return html`<div><h1>Mock Component</h1></div>`
          }

          mountWithStore(target, mockComponent)
          const mockComponentUpdate = () => {
            useEffect(mockSpace, 'mock-queue', 'mock-working-key')(mockEffect, [1])
            return html`<div><h1>Mock Component</h1></div>`
          }

          mountWithStore(target, mockComponent)
          expect(mockStartEffect).toHaveBeenCalled()
          expect(mockCleanupEffect).not.toHaveBeenCalled()
          mockStartEffect.mockClear()
          mockCleanupEffect.mockClear()
          mountWithStore(target, mockComponentUpdate)
          expect(mockCleanupEffect).toHaveBeenCalled()
          expect(mockStartEffect).toHaveBeenCalled()
        })

        it('should not call effects on second mount with same triggers', () => {
          const target = document.createElement('div')
          const mockSpace = {}
          setupEffectStore(mockSpace, 'mock-store')
          setupEffectStore(mockSpace, 'mock-queue')
          setupWorkingKey(mockSpace, 'mock-working-key')
          setupRenderLock(mockSpace, 'mock-render-lock')
          const mountWithStore = mount(mockSpace, 'mock-store', 'mock-queue', 'mock-working-key', 'mock-render-lock')
          const mockStartEffect = jest.fn()
          const mockCleanupEffect = jest.fn()
          const mockEffect = () => {
            mockStartEffect()
            return mockCleanupEffect
          }

          const mockComponent = () => {
            useEffect(mockSpace, 'mock-queue', 'mock-working-key')(mockEffect, [0])
            return html`<div><h1>Mock Component</h1></div>`
          }

          mountWithStore(target, mockComponent)
          const mockComponentUpdate = () => {
            useEffect(mockSpace, 'mock-queue', 'mock-working-key')(mockEffect, [0])
            return html`<div><h1>Mock Component</h1></div>`
          }

          mountWithStore(target, mockComponent)
          expect(mockStartEffect).toHaveBeenCalled()
          expect(mockCleanupEffect).not.toHaveBeenCalled()
          mockStartEffect.mockClear()
          mockCleanupEffect.mockClear()
          mountWithStore(target, mockComponentUpdate)
          expect(mockCleanupEffect).not.toHaveBeenCalled()
          expect(mockStartEffect).not.toHaveBeenCalled()
        })
      })
    })
  })
})
