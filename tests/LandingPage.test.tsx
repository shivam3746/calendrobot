import { render, screen } from '@testing-library/react'
import LandingPage from '@/components/LandingPage'
import '@testing-library/jest-dom'

// Mocking next/image globally
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />
  }
}))

// Mock Clerk's SignIn
jest.mock('@clerk/nextjs', () => ({
  SignIn: () => <div data-testid="clerk-signin" />
}))

describe('LandingPage', () => {
  it('renders the heading and subheading', () => {
    render(<LandingPage />)

    expect(
      screen.getByRole('heading', { name: /welcome to calendrobot/i })
    ).toBeInTheDocument()

    expect(
      screen.getByText(/the only calendar app you'll ever need/i)
    ).toBeInTheDocument()
  })

  it('renders the images', () => {
    render(<LandingPage />)

    expect(screen.getAllByRole('img')).toHaveLength(2)

    const [logoImg, planningImg] = screen.getAllByRole('img')
    expect(logoImg).toHaveAttribute('alt', 'Logo')
    expect(planningImg).toHaveAttribute('alt', 'Landing Page Image')
  })

  it('renders the Clerk SignIn component', () => {
    render(<LandingPage />)
    expect(screen.getByTestId('clerk-signin')).toBeInTheDocument()
  })
})
