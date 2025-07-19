import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function timeToFloat(time: string): number {
  // Split the time string by ":" into [hours, minutes] and convert both to numbers
  const [hours, minutes] = time.split(":").map(Number)
  // Note: .map(Number) is a shorthand way to convert an array of strings to numbers.

  // Convert minutes into a fraction of an hour and add it to the hour
  return hours + minutes / 60
}


export function extractRelevantEventMarkdown(markdown: string): string {
  const sections: Record<string, string> = {};

  // // Extract Title (first H1 or H2)
  // const titleMatch = markdown.match(/^#\s+(.*)/m) || markdown.match(/^##\s+(.*)/m);
  // if (titleMatch) sections["Title"] = titleMatch[1];

  // // Extract Date & Time
  // const dateMatch = markdown.match(/##\s+Date and time\s+([\s\S]+?)\n{2,}/i);
  // if (dateMatch) sections["Date and Time"] = dateMatch[1].trim();

  // // Extract Location
  // const locationMatch = markdown.match(/##\s+Location\s+([\s\S]+?)\n{2,}/i);
  // if (locationMatch) sections["Location"] = locationMatch[1].trim();

  // Extract About section
  const aboutMatch = markdown.match(/##\s+About this event\s+([\s\S]+?)\n{2,}/i);
  if (aboutMatch) {
    const paragraphs = aboutMatch[1].split('\n').filter(p => p.trim() !== '');
    sections["About"] = paragraphs.slice(0, 2).join('\n\n'); // Only first 2 paragraphs
  }

  // // Extract Organizer
  // const orgMatch = markdown.match(/##\s+Organized by\s+([\s\S]+?)\n{2,}/i);
  // if (orgMatch) sections["Organizer"] = orgMatch[1].trim();

  // // Optional: Tags
  // const tagMatch = markdown.match(/###\s+Tags\s+([\s\S]+?)\n{2,}/i);
  // if (tagMatch) sections["Tags"] = tagMatch[1].trim();

  // Compose output
  return Object.entries(sections)
    .map(([key, val]) => `### ${key}\n${val}`)
    .join('\n\n');
}


export function extractJsonFromCodeBlock(text: string): string {
  // This regex handles ```json\n...\n``` or ```\n...\n``` styles
  const match = text.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
  return (match ? match[1] : text).trim();
}
