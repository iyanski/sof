// Jest DOM matchers type definitions
import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveStyle(style: Record<string, any>): R
      toBeDisabled(): R
      toHaveFocus(): R
      toBeEnabled(): R
      toHaveClass(className: string): R
      toHaveAttribute(attribute: string, value?: string): R
      toHaveTextContent(text: string | RegExp): R
      toBeVisible(): R
      toBeHidden(): R
    }
  }
}
