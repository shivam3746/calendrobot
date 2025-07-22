import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CopyEventButton } from '@/components/CopyEventButton'
import '@testing-library/jest-dom'

// Mock the toast function from 'sonner'
jest.mock('sonner', () => ({
  toast: jest.fn()
}))

const mockWriteText = jest.fn()

// Mock the clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText
  }
})

describe('CopyEventButton', () => {
  const clerkUserId = 'test-user'
  const eventId = 'event-123'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the initial button state', () => {
    render(<CopyEventButton clerkUserId={clerkUserId} eventId={eventId} />)
    expect(screen.getByText('Copy Link')).toBeInTheDocument()
  })

  it('copies the link and shows "Copied!" on success', async () => {
    mockWriteText.mockResolvedValueOnce(undefined)

    render(<CopyEventButton clerkUserId={clerkUserId} eventId={eventId} />)

    const button = screen.getByRole('button', { name: /copy link/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith(
        `${location.origin}/book/${clerkUserId}/${eventId}`
      )
    })

    expect(await screen.findByText('Copied!')).toBeInTheDocument()
  })

  it('shows "Error" when copying fails', async () => {
    mockWriteText.mockRejectedValueOnce(new Error('Copy failed'))

    render(<CopyEventButton clerkUserId={clerkUserId} eventId={eventId} />)

    const button = screen.getByRole('button', { name: /copy link/i })
    fireEvent.click(button)

    expect(await screen.findByText('Error')).toBeInTheDocument()
  })
})
