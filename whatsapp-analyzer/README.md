# 📱 WhatsApp Chat Analyzer - React App

A modern, interactive React application for analyzing WhatsApp chat exports with beautiful visualizations and real-time filtering.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Dashboard.tsx      # Main analytics dashboard with interactive charts
│   └── FileUpload.tsx     # Drag & drop file upload component
├── types/
│   └── chat.ts           # TypeScript interfaces for chat data
├── utils/
│   ├── chatParser.ts     # WhatsApp chat parsing and analysis logic
│   └── testParser.ts     # Parser testing utilities
├── App.tsx               # Main application component
├── App.css              # Custom CSS utilities and styling
└── index.tsx            # Application entry point
```

## 🛠️ Technologies Used

- **React 18.2.0** - Modern React with hooks
- **TypeScript 4.9.5** - Type-safe development
- **Lucide React** - Beautiful icon library
- **Date-fns** - Date manipulation utilities
- **Custom CSS** - Tailwind-inspired utility classes

## 📊 Features

### Interactive Dashboard
- Real-time filtering by participant and date range
- Hover effects and tooltips on all chart elements
- Click-to-filter functionality on participant bars
- Smooth animations and transitions

### Chart Types
- **Participant Analysis** - Interactive progress bars
- **Media Distribution** - Color-coded breakdown
- **Activity Patterns** - Hourly and daily charts
- **Message Length Analysis** - Character distribution
- **Activity Heatmap** - GitHub-style 30-day view
- **Monthly Trends** - Animated progress bars

### Data Processing
- Parses WhatsApp export format
- Handles all message types (text, media, system)
- Calculates comprehensive statistics
- Memory-efficient processing

## 🔧 Development

### Available Scripts
- `npm start` - Start development server on port 3000
- `npm run build` - Create production build
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App

### Key Components

#### Dashboard.tsx
Main analytics component featuring:
- State management for filters and interactions
- Real-time data filtering and recalculation
- Interactive chart rendering
- Hover effects and tooltips

#### FileUpload.tsx
File upload component with:
- Drag and drop functionality
- File validation
- Loading states
- Error handling

#### chatParser.ts
Core parsing logic including:
- WhatsApp message format parsing
- Statistics calculation
- Data transformation
- Type-safe processing

## 🎨 Styling

The app uses custom CSS utilities inspired by Tailwind CSS:
- Responsive grid layouts
- Color-coded charts
- Smooth animations
- Hover effects
- Focus states

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: 768px (md), 1024px (lg)
- Touch-friendly interactions
- Optimized for all screen sizes

## 🔍 Data Analysis

### Supported Message Types
- Text messages
- Images (JPG, PNG)
- Videos (MP4)
- Audio (OPUS)
- Stickers (WEBP)
- GIFs
- System messages
- Deleted messages

### Calculated Metrics
- Total message count
- Media file distribution
- Participant activity
- Time-based patterns
- Word frequency
- Emoji usage
- Message length distribution
- Activity streaks

## 🚀 Performance

- Client-side processing only
- Efficient memory usage
- Smooth animations (60fps)
- Fast filtering and updates
- Handles large datasets (50k+ messages)

## 🔒 Privacy

- 100% client-side processing
- No data sent to external servers
- Local storage only
- Complete privacy protection

## 📝 License

MIT License - see LICENSE file for details.
