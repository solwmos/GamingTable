# The Gaming Table 🎲

A board game meetup app to find players, organize gaming sessions, and connect with the board gaming community.

## Features

- 🎮 User registration with preferences and profile information
- 📅 Create and manage gaming sessions
- 🎯 Browse and join upcoming game sessions
- 🖼️ Beautiful board game cover art from BoardGameGeek
- 💾 Persistent data storage with localStorage
- 📱 Responsive design with playful, vibrant colors

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Extract the project files to a directory
2. Open a terminal in the project directory
3. Install dependencies:

```bash
npm install
```

### Running the App

Start the development server:

```bash
npm start
```

The app will open in your browser at [http://localhost:3000](http://localhost:3000)

### Building for Production

Create an optimized production build:

```bash
npm run build
```

The build files will be in the `build` folder.

## Usage

1. **Register/Login**: Create a new account with your gaming preferences
2. **Create Sessions**: Click "Host a Game" to create a new gaming session
3. **Join Sessions**: Browse upcoming sessions and join ones that interest you
4. **Manage**: View all your gaming sessions in one place

## Tech Stack

- React 18
- Lucide React (icons)
- localStorage (data persistence)
- BoardGameGeek (game images)

## Project Structure

```
gaming-table/
├── public/
│   └── index.html
├── src/
│   ├── App.js          # Main application component
│   ├── storage.js      # localStorage wrapper
│   ├── index.js        # Entry point
│   └── index.css       # Global styles
├── package.json
└── README.md
```

## Data Storage

The app uses browser localStorage to persist:
- User accounts and profiles
- Gaming sessions
- Current user session

## Customization

You can easily add more board games by editing the `BOARD_GAMES` array in `src/App.js`:

```javascript
{
  id: 9,
  name: 'Your Game',
  category: 'Strategy',
  image: '🎮',
  bggId: 123456,
  imageUrl: 'https://...'
}
```

## License

This project is open source and available for personal and educational use.

## Support

For issues or questions, please create an issue in the project repository.

---

Made with ❤️ for board game enthusiasts
