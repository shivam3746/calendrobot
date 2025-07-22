import { render, screen } from '@testing-library/react'
import NoTimeSlots from '@/components/NoTimeSlots'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

jest.mock('next/link', () => {
  return ({ href, children }: any) => <a href={href}>{children}</a>
})

describe('NoTimeSlots component', () => {
  const mockEvent = {
    name: 'Design Meeting',
    description: 'Discuss UI/UX flows'
  }

  const mockUser = {
    id: 'user-123',
    fullName: 'Jane Doe'
  }

  it('renders the title with event and user name', () => {
    render(<NoTimeSlots event={mockEvent} calendarUser={mockUser} />)

    expect(
      screen.getByText(/Book Design Meeting with Jane Doe/i)
    ).toBeInTheDocument()
  })

  it('renders the event description if available', () => {
    render(<NoTimeSlots event={mockEvent} calendarUser={mockUser} />)

    expect(screen.getByText(/Discuss UI\/UX flows/i)).toBeInTheDocument()
  })

  it('renders the fallback message', () => {
    render(<NoTimeSlots event={mockEvent} calendarUser={mockUser} />)

    expect(
      screen.getByText(/currently booked up.*check back later/i)
    ).toBeInTheDocument()
  })

  it('renders a link to choose another event', async () => {
    render(<NoTimeSlots event={mockEvent} calendarUser={mockUser} />)

    const linkButton = screen.getByRole('link', { name: /choose another event/i })
    expect(linkButton).toHaveAttribute('href', '/book/user-123')

    // Simulate click in case if needed
    await userEvent.click(linkButton)
  })

  it('does not render description when event.description is null', () => {
    render(
      <NoTimeSlots
        event={{ name: 'Quick Sync', description: null }}
        calendarUser={mockUser}
      />
    )

    expect(screen.queryByText(/Discuss UI\/UX flows/i)).not.toBeInTheDocument()
  })
})
