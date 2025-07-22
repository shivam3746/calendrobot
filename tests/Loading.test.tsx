import { render, screen } from '@testing-library/react'
import Loading from '@/components/Loading'
import '@testing-library/jest-dom'

jest.mock('react-loading-indicators', () => ({
  Mosaic: ({ text }: { text: string }) => <div data-testid="mosaic">{text}</div>
}))

describe('Loading component', () => {
  it('renders without crashing and shows loading text', () => {
    render(<Loading />)

    expect(screen.getByTestId('mosaic')).toBeInTheDocument()
    expect(screen.getByText(/loading\.\.\./i)).toBeInTheDocument()
  })
})
