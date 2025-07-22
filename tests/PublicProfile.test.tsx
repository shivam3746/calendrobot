import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import PublicProfile from "@/components/PublicProfile"
import { useUser } from "@clerk/nextjs"
import { getPublicEvents } from "@/server/actions/events"
import { toast } from "sonner"

// Mock Clerk
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
}))

// Mock getPublicEvents action
jest.mock("../server/actions/events", () => ({
  getPublicEvents: jest.fn(),
}))

// Mock toast
jest.mock("sonner", () => ({
  toast: jest.fn(),
}))

// Setup clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
})

describe("PublicProfile Component", () => {
  const mockUserId = "user_123"
  const mockFullName = "Shivam Srivastava"

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders loading initially", async () => {
    (getPublicEvents as jest.Mock).mockReturnValueOnce(new Promise(() => {}))
    ;(useUser as jest.Mock).mockReturnValue({ user: { id: mockUserId } })

    render(<PublicProfile userId={mockUserId} fullName={mockFullName} />)

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it("renders empty event message when no events", async () => {
    ;(getPublicEvents as jest.Mock).mockResolvedValueOnce([])
    ;(useUser as jest.Mock).mockReturnValue({ user: { id: mockUserId } })

    render(<PublicProfile userId={mockUserId} fullName={mockFullName} />)

    await waitFor(() =>
      expect(screen.getByText(/no events available/i)).toBeInTheDocument()
    )
    expect(screen.getByText(mockFullName)).toBeInTheDocument()
  })

  it("renders event cards when events are returned", async () => {
    const mockEvents = [
      {
        id: "1",
        name: "Event One",
        clerkUserId: mockUserId,
        description: "Description 1",
        durationInMinutes: 30,
      },
      {
        id: "2",
        name: "Event Two",
        clerkUserId: mockUserId,
        description: null,
        durationInMinutes: 45,
      },
    ]
    ;(getPublicEvents as jest.Mock).mockResolvedValueOnce(mockEvents)
    ;(useUser as jest.Mock).mockReturnValue({ user: { id: mockUserId } })

    render(<PublicProfile userId={mockUserId} fullName={mockFullName} />)

    await waitFor(() =>
      expect(screen.getByText("Event One")).toBeInTheDocument()
    )
    expect(screen.getByText("Event Two")).toBeInTheDocument()
    expect(screen.getAllByText(/select/i)).toHaveLength(2)
  })

  it("copies profile URL to clipboard", async () => {
    ;(getPublicEvents as jest.Mock).mockResolvedValueOnce([])
    ;(useUser as jest.Mock).mockReturnValue({ user: { id: mockUserId } })

    render(<PublicProfile userId={mockUserId} fullName={mockFullName} />)

    const button = await screen.findByRole("button", {
      name: /copy public profile url/i,
    })

    fireEvent.click(button)

    await waitFor(() =>
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        `${window.location.origin}/book/${mockUserId}`
      )
    )

    expect(toast).toHaveBeenCalledWith("Profile URL copied to clipboard!")
  })
})
