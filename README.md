# PT Task Manager

![PT Task Manager](https://img.shields.io/badge/PT-Task%20Manager-0ea5e9)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.1.6-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green)

A modern, responsive task management application built with React, featuring drag-and-drop functionality, local storage persistence, and a beautiful UI/UX design.

## 🚀 Features

- **Drag & Drop**: Intuitive drag-and-drop interface for task management
- **Local Storage**: Automatic persistence of tasks in browser's local storage
- **Responsive Design**: Mobile-first design that works on all devices
- **Task Management**: Create, edit, delete, and organize tasks
- **Priority Levels**: Low, Medium, and High priority with visual indicators
- **Due Dates**: Set and track due dates with overdue indicators
- **Search & Filter**: Search tasks and filter by status and priority
- **Status Tracking**: Three-column layout (To Do, In Progress, Completed)
- **Real-time Updates**: Instant updates with smooth animations
- **Accessibility**: WCAG compliant with keyboard navigation support

## 🛠️ Tech Stack

- **Frontend**: React 18, Tailwind CSS
- **Drag & Drop**: @hello-pangea/dnd
- **Icons**: Lucide React
- **Storage**: Local Storage API
- **Build Tools**: Create React App, PostCSS

## 📱 Screenshots

### Desktop View
Clean, modern interface with three-column layout for efficient task management.

### Mobile View
Responsive design that adapts to mobile screens with touch-friendly interface.

## 🎨 Design Features

- **PT Branding**: Custom PT logo and consistent branding throughout
- **Color Coded**: Different colors for task statuses and priorities
- **Smooth Animations**: Fade-in effects and smooth transitions
- **Visual Feedback**: Hover effects and drag indicators
- **Professional UI**: Clean, modern design with attention to detail

## 💾 Data Persistence

Tasks are automatically saved to browser's local storage with the following data structure:
- Task ID (timestamp-based)
- Title and description
- Priority level (Low, Medium, High)
- Status (To Do, In Progress, Completed)
- Due date (optional)
- Creation and update timestamps

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Prem-Thakur786/task-manager.git
cd task-manager
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 📋 Usage Guide

### Creating Tasks
1. Click the "Add Task" button in the header
2. Fill in the task details (title, description, priority, due date)
3. Click "Add Task" to create

### Managing Tasks
- **Edit**: Click the edit icon on any task card
- **Delete**: Click the trash icon to remove a task
- **Complete**: Click the circle icon to toggle completion status
- **Move**: Drag tasks between columns to change status

### Organizing Tasks
- **Search**: Use the search bar to find specific tasks
- **Filter**: Filter tasks by status and priority
- **Drag & Drop**: Move tasks between columns to update their status

### Task Information
- **Priority Badges**: Visual indicators for task priority
- **Due Dates**: Calendar icon shows due dates
- **Overdue Indicator**: Red text for overdue tasks
- **High Priority Star**: Star icon for high-priority tasks

## 🌐 Deployment

This project is configured for easy deployment to Vercel. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Prem Thakur**
- Portfolio: [https://prem-thakur1618.vercel.app/](https://prem-thakur1618.vercel.app/)
- GitHub: [https://github.com/Prem-Thakur786](https://github.com/Prem-Thakur786)
- LinkedIn: [https://www.linkedin.com/in/prem-chand-411aab211/](https://www.linkedin.com/in/prem-chand-411aab211/)

## 🙏 Acknowledgments

- Icons provided by [Lucide](https://lucide.dev/)
- Drag and drop functionality by @hello-pangea/dnd
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Font from [Google Fonts](https://fonts.google.com/)

## 🔮 Future Enhancements

- [ ] Dark mode support
- [ ] Task categories/tags
- [ ] Task time tracking
- [ ] Export/import functionality
- [ ] Collaboration features
- [ ] Cloud synchronization
- [ ] Mobile app version
- [ ] Task templates
- [ ] Notification system
- [ ] Analytics dashboard

---

**© 2025 PT Task Manager by Prem Thakur** - Built with ❤️ using React and Tailwind CSS
