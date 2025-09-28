# 📱 WhatsApp Chat Analyzer

A powerful, interactive web application that analyzes your WhatsApp chat exports and provides detailed insights, statistics, and beautiful visualizations of your conversations.

![WhatsApp Chat Analyzer](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ Features

### 📊 **Interactive Analytics Dashboard**
- **Message Statistics**: Total messages, media files, participants, and activity patterns
- **Real-time Filtering**: Filter by participant, date range, and message type
- **Beautiful Visualizations**: Custom-built charts with hover effects and animations
- **Activity Heatmap**: GitHub-style heatmap showing daily activity over the last 30 days

### 🎯 **Advanced Visualizations**
- **Participant Analysis**: Interactive progress bars showing message distribution
- **Media Distribution**: Color-coded breakdown of images, videos, audio, stickers, and GIFs
- **Time-based Patterns**: Hourly and daily activity charts with smooth animations
- **Message Length Analysis**: Distribution of message lengths and communication patterns
- **Monthly Trends**: Activity trends over time with animated progress bars

### 🔍 **Smart Insights**
- **Word Frequency**: Most used words and phrases in your conversations
- **Emoji Analysis**: Popular emojis and their usage patterns
- **Activity Insights**: Most active hours, days, and conversation streaks
- **Communication Patterns**: Analysis of when and how you communicate

### 🎨 **Modern UI/UX**
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Interactive Elements**: Hover effects, tooltips, and smooth transitions
- **Drag & Drop Upload**: Easy file upload with visual feedback
- **Real-time Updates**: All charts update instantly when filters change

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/chat-analyser.git
   cd chat-analyser
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 How to Use

### 1. Export Your WhatsApp Chat
1. Open WhatsApp on your phone
2. Go to the chat you want to analyze
3. Tap the three dots menu (⋮) in the top right
4. Select "More" → "Export chat"
5. Choose "Without Media" or "Include Media"
6. Send the file to yourself via email or save to cloud storage
7. Download the `_chat.txt` file to your computer

### 2. Upload and Analyze
1. Open the WhatsApp Chat Analyzer in your browser
2. Drag and drop your `_chat.txt` file or click to browse
3. Wait for the analysis to complete (usually takes a few seconds)
4. Explore the interactive dashboard and insights!

## 🛠️ Technical Details

### Built With
- **React 18.2.0** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development with excellent IDE support
- **Custom CSS** - Tailwind-inspired utility classes for consistent styling
- **Lucide React** - Beautiful, customizable icons
- **Date-fns** - Modern JavaScript date utility library

### Architecture
```
src/
├── components/
│   ├── Dashboard.tsx      # Main analytics dashboard
│   └── FileUpload.tsx     # File upload component
├── types/
│   └── chat.ts           # TypeScript type definitions
├── utils/
│   ├── chatParser.ts     # WhatsApp chat parsing logic
│   └── testParser.ts     # Parser testing utilities
├── App.tsx               # Main application component
└── App.css              # Custom CSS utilities
```

### Key Features
- **Client-side Processing**: All analysis happens in the browser - no data sent to servers
- **Memory Efficient**: Handles large chat files (50k+ messages) smoothly
- **Type Safe**: Full TypeScript coverage for reliable development
- **Responsive**: Mobile-first design that works on all devices

## 📊 Supported Data Types

The analyzer processes all WhatsApp message types:
- ✅ **Text Messages** - Regular text conversations
- ✅ **Images** - Photos and screenshots
- ✅ **Videos** - Video messages and recordings
- ✅ **Audio** - Voice messages
- ✅ **Stickers** - Animated and static stickers
- ✅ **GIFs** - Animated GIFs
- ✅ **System Messages** - Encryption notices, business account info
- ✅ **Deleted Messages** - Messages that were deleted

## 🎨 Screenshots

### Main Dashboard
![Dashboard](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Interactive+Dashboard+with+Charts+and+Analytics)

### Filtering Interface
![Filters](https://via.placeholder.com/800x300/10B981/FFFFFF?text=Advanced+Filtering+Controls)

### Activity Heatmap
![Heatmap](https://via.placeholder.com/800x200/F59E0B/FFFFFF?text=Activity+Heatmap+Last+30+Days)

## 🔧 Development

### Available Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Project Structure
```
whatsapp-analyzer/
├── public/                 # Static assets
├── src/                   # Source code
│   ├── components/        # React components
│   ├── types/            # TypeScript definitions
│   ├── utils/            # Utility functions
│   └── App.tsx           # Main app component
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write clean, readable code
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 📝 Roadmap

### Planned Features
- [ ] **Export Functionality** - Export charts and data as PDF/PNG
- [ ] **Sentiment Analysis** - Analyze emotional tone of conversations
- [ ] **Keyword Search** - Search through messages with advanced filters
- [ ] **Multiple Chat Support** - Analyze multiple chats simultaneously
- [ ] **Data Persistence** - Save analysis results locally
- [ ] **Advanced Charts** - More chart types and visualizations
- [ ] **Mobile App** - React Native version for mobile devices

### Known Issues
- Large files (>100k messages) may take longer to process
- Some special characters in messages may not display correctly
- Media files are not currently analyzed (only counted)

## 🔒 Privacy & Security

- **100% Client-side**: All processing happens in your browser
- **No Data Collection**: No data is sent to external servers
- **Local Storage**: Analysis results are stored locally in your browser
- **Open Source**: Full source code is available for review

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **WhatsApp** - For providing the chat export functionality
- **React Team** - For the amazing React framework
- **TypeScript Team** - For excellent type safety
- **Lucide** - For beautiful, consistent icons
- **Contributors** - Thanks to all contributors who help improve this project

## 📞 Support

Having issues? Here's how to get help:

1. **Check the Issues** - Look through existing GitHub issues
2. **Create an Issue** - Describe your problem with steps to reproduce
3. **Contact** - Reach out via email or social media

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/chat-analyser&type=Date)](https://star-history.com/#yourusername/chat-analyser&Date)

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/yourusername">Your Name</a></p>
  <p>
    <a href="#-features">Features</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-contributing">Contributing</a> •
    <a href="#-license">License</a>
  </p>
</div>