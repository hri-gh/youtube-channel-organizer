# YouTube Channel Organizer

A simple web app to organize and categorize your YouTube channel subscriptions. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Tag-based Organization**: Categorize channels with multiple tags (Education, Science, Programming, etc.)
- **Smart Search**: Search channels by name, tags, or notes
- **Favorites**: Mark important channels as favorites
- **Tag Management**: Create, rename, and delete tags directly from the sidebar
- **Dual View Modes**: Switch between card and list views
- **Dark Mode**: Full dark mode support with system preference detection
- **Clean UI**: Modern interface with sidebar navigation
- **Local Storage**: All data persists locally in your browser
- **Responsive Design**: Works on desktop and mobile

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Add Channels**: Click "Add Channel" to add YouTube channel links
2. **Organize with Tags**: Add multiple tags like "Education", "Science", "Programming"
3. **Create Tags**: Use "Create Tag" in the sidebar or create them on-the-fly when adding channels
4. **Manage Tags**: Hover over tags in the sidebar to rename or delete them
5. **Filter by Tags**: Use the sidebar to filter channels by specific tags
6. **Search**: Use the search bar to find channels quickly
7. **Switch Views**: Toggle between card and list views using the view buttons
8. **Dark Mode**: Click the theme toggle in the sidebar to switch between light, dark, and system themes
9. **Edit/Delete**: Use the action buttons on each channel card

## Data Structure

Each channel contains:
- **Link**: YouTube channel URL (required)
- **Name**: Custom channel name (optional)
- **Tags**: Multiple category tags
- **Note**: Personal notes about the channel
- **Favourite**: Mark as favorite for quick access

## Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components
- **Lucide React** - Icons
- **Local Storage** - Data persistence

## Project Structure

```
components/
├── ui/             # Shadcn UI components
├── core/           # Reusable components (Card, Section, Container)
├── data-display/   # Domain-specific components (ChannelCard, ChannelForm)
├── layout/         # Layout components (Sidebar, PageContainer)
└── list/           # List components (ChannelList)
```

## Sample Data

The app comes with sample channels to demonstrate functionality:
- 3Blue1Brown (Math, Education, Animation)
- Veritasium (Science, Physics, Education)
- TechLead (Programming, Tech, Career)
- Crash Course (Education, History, Science, Literature)