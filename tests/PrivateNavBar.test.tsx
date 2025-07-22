import { render, screen } from '@testing-library/react'
import PrivateNavBar from '@/components/PrivateNavBar'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

// ✅ Mock next/navigation BEFORE import
jest.mock('next/navigation', () => ({
  usePathname: jest.fn()
}))
import { usePathname } from 'next/navigation'

// Mock next/link
jest.mock('next/link', () => {
  return ({ href, children }: any) => <a href={href}>{children}</a>
})

// Mock Clerk SignedIn and UserButton
jest.mock('@clerk/nextjs', () => ({
  SignedIn: ({ children }: any) => <>{children}</>,
  UserButton: () => <div data-testid="user-button" />
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />
  }
}))

// Mock constants
jest.mock('../constants/', () => ({
  PrivateNavLinks: [
    {
      label: 'Dashboard',
      route: '/dashboard',
      imgURL: '/icons/dashboard.svg'
    },
    {
      label: 'Calendar',
      route: '/calendar',
      imgURL: '/icons/calendar.svg'
    }
  ]
}))

describe('PrivateNavBar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(usePathname as jest.Mock).mockReturnValue('/calendar')
  })

  it('renders the navigation logo', () => {
    render(<PrivateNavBar />)
    expect(screen.getByAltText('Lets Talk!')).toBeInTheDocument()
  })

  it('renders all nav links with icons and labels', () => {
    render(<PrivateNavBar />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Calendar')).toBeInTheDocument()

    expect(screen.getByAltText('Dashboard')).toBeInTheDocument()
    expect(screen.getByAltText('Calendar')).toBeInTheDocument()
  })


  it('renders the UserButton when signed in', () => {
    render(<PrivateNavBar />)
    expect(screen.getByTestId('user-button')).toBeInTheDocument()
  })
})
