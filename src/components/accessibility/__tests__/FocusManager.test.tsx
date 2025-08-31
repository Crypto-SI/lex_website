import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@/test/utils'
import { FocusManager } from '../FocusManager'

describe('FocusManager', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
    vi.clearAllMocks()
  })

  it('should render children correctly', () => {
    render(
      <FocusManager>
        <button>Test Button</button>
      </FocusManager>
    )

    expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument()
  })

  it('should trap focus when trapFocus is enabled', () => {
    render(
      <FocusManager trapFocus>
        <button>First Button</button>
        <button>Second Button</button>
      </FocusManager>
    )

    const firstButton = screen.getByRole('button', { name: 'First Button' })
    const secondButton = screen.getByRole('button', { name: 'Second Button' })

    firstButton.focus()
    expect(document.activeElement).toBe(firstButton)

    // Simulate Tab key to move to next element
    fireEvent.keyDown(firstButton, { key: 'Tab' })
    expect(document.activeElement).toBe(secondButton)

    // Simulate Tab key at last element should cycle back to first
    fireEvent.keyDown(secondButton, { key: 'Tab' })
    expect(document.activeElement).toBe(firstButton)
  })

  it('should handle Shift+Tab for reverse focus navigation', () => {
    render(
      <FocusManager trapFocus>
        <button>First Button</button>
        <button>Second Button</button>
      </FocusManager>
    )

    const firstButton = screen.getByRole('button', { name: 'First Button' })
    const secondButton = screen.getByRole('button', { name: 'Second Button' })

    firstButton.focus()
    
    // Simulate Shift+Tab at first element should cycle to last
    fireEvent.keyDown(firstButton, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(secondButton)
  })

  it('should focus initial element when specified', () => {
    const TestComponent = () => {
      const initialRef = React.useRef<HTMLButtonElement>(null)
      
      return (
        <FocusManager initialFocus={initialRef}>
          <button>First Button</button>
          <button ref={initialRef}>Initial Focus Button</button>
        </FocusManager>
      )
    }

    render(<TestComponent />)
    
    const initialButton = screen.getByRole('button', { name: 'Initial Focus Button' })
    expect(document.activeElement).toBe(initialButton)
  })

  it('should restore focus when component unmounts', () => {
    const previousElement = document.createElement('button')
    previousElement.textContent = 'Previous Element'
    document.body.appendChild(previousElement)
    previousElement.focus()

    const { unmount } = render(
      <FocusManager restoreFocus>
        <button>Test Button</button>
      </FocusManager>
    )

    const testButton = screen.getByRole('button', { name: 'Test Button' })
    testButton.focus()

    unmount()

    expect(document.activeElement).toBe(previousElement)
    
    document.body.removeChild(previousElement)
  })

  it('should handle escape key to exit focus trap', () => {
    const onEscape = vi.fn()
    
    render(
      <FocusManager trapFocus onEscape={onEscape}>
        <button>Test Button</button>
      </FocusManager>
    )

    const testButton = screen.getByRole('button', { name: 'Test Button' })
    testButton.focus()

    fireEvent.keyDown(testButton, { key: 'Escape' })
    expect(onEscape).toHaveBeenCalledTimes(1)
  })

  it('should not trap focus when trapFocus is disabled', () => {
    render(
      <FocusManager trapFocus={false}>
        <button>Test Button</button>
      </FocusManager>
    )

    const testButton = screen.getByRole('button', { name: 'Test Button' })
    testButton.focus()

    // Tab should not be intercepted
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' })
    const preventDefault = vi.spyOn(tabEvent, 'preventDefault')
    
    fireEvent(testButton, tabEvent)
    expect(preventDefault).not.toHaveBeenCalled()
  })
})