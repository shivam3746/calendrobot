import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import PublicEventCard from '../components/PublicEventCard'

// Mocked formatEventDescription utility
jest.mock('../lib/formatters', () => ({
  formatEventDescription: jest.fn((mins: number) => `${mins} minutes`)
}))

// Mocked Next.js Link
jest.mock('next/link', () => {
  return ({ href, children }: any) => <a href={href}>{children}</a>
})

describe('PublicEventCard', () => {
  const baseProps = {
    id: 'event123',
    name: 'Test Event',
    description: 'This is a test event.',
    clerkUserId: 'user456',
    durationInMinutes: 45
  }

  it('renders event name and duration', () => {
    render(<PublicEventCard {...baseProps} />)

    expect(screen.getByText('Test Event')).toBeInTheDocument()
    expect(screen.getByText(/45 minutes/i)).toBeInTheDocument()
  })

  it('renders description if provided', () => {
    render(<PublicEventCard {...baseProps} />)

    expect(screen.getByText('This is a test event.')).toBeInTheDocument()
  })

  it('does not render description if null', () => {
    render(<PublicEventCard {...baseProps} description={null} />)

    expect(screen.queryByText('This is a test event.')).not.toBeInTheDocument()
  })

  it('has a working Select button with correct link', () => {
    render(<PublicEventCard {...baseProps} />)

    const link = screen.getByRole('link', { name: /select/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', `/book/${baseProps.clerkUserId}/${baseProps.id}`)
  })
})
