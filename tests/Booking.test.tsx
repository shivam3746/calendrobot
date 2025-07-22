import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Booking from '@/components/Booking'

describe('Booking Component', () => {
  it('renders the loading text', () => {
    render(<Booking />)

    const loadingText = screen.getByText(/Booking Event, don't click on anything/i)
    expect(loadingText).toBeInTheDocument()
  })
})
