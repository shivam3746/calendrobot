import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import PublicNavBar from '../components/PublicNavBar'
import { SignInButton, SignUpButton } from '@clerk/nextjs'

// Mocked Next.js components
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />
  }
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: any) => <a href={href}>{children}</a>,
}))

// Mocked Clerk buttons
jest.mock('@clerk/nextjs', () => ({
  SignInButton: ({ children }: any) => <div data-testid="sign-in-button">{children}</div>,
  SignUpButton: ({ children }: any) => <div data-testid="sign-up-button">{children}</div>,
}))

describe('PublicNavBar', () => {
  it('renders logo with link to login', () => {
    render(<PublicNavBar />)

    const logo = screen.getByAltText('Logo')
    expect(logo).toBeInTheDocument()
    expect(logo.closest('a')).toHaveAttribute('href', '/login')
  })

  it('renders LogIn button inside SignInButton', () => {
    render(<PublicNavBar />)

    const loginButton = screen.getByText(/login/i)
    expect(loginButton).toBeInTheDocument()
    expect(screen.getByTestId('sign-in-button')).toContainElement(loginButton)
  })

  it('renders Register button inside SignUpButton', () => {
    render(<PublicNavBar />)

    const registerButton = screen.getByText(/register/i)
    expect(registerButton).toBeInTheDocument()
    expect(screen.getByTestId('sign-up-button')).toContainElement(registerButton)
  })

  it('has expected structure and styling classes', () => {
    render(<PublicNavBar />)

    const nav = screen.getByRole('navigation', { hidden: true })
    expect(nav).toHaveClass('flex', 'justify-between', 'items-center', 'fixed')
  })
})
