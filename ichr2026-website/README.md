# ICHR2026 Conference Website

## Overview
This is the official website for the 2nd International Conference on Harmony & Reconciliation (ICHR2026), scheduled for January 28-29, 2026, at the University of Vavuniya.

## Features Implemented

### ✅ Navigation Improvements
- **White background header** for better visibility
- **Clear navigation menu** with all sections
- **Responsive mobile menu** with proper styling

### ✅ Hero Section Updates
- **Ceremony logo integration** - The ICHR2026 ceremony logo is now prominently displayed in the hero section
- **Functional CTA buttons** - "Register Now" and "Submit a Paper" buttons link to their respective sections
- **Maintained design theme** - Consistent with existing color scheme and styling

### ✅ Functional Registration System
- **Complete registration form** with validation
- **Multiple registration categories** (Presenting Author, Non-presenting Author, Spectator, University Student)
- **Real-time form handling** with loading states and success messages
- **Fee structure display** for both local (LKR) and international (USD) participants

### ✅ Paper Submission Portal
- **Comprehensive submission form** with all required fields
- **File upload functionality** for paper submissions
- **Paper categories** (Research Paper, Review Paper, Case Study, Position Paper)
- **Important dates and guidelines** clearly displayed
- **Submission portal access** for tracking submissions

### ✅ PDF Flipbook Integration
- **Interactive conference brochure** embedded in the Programme section
- **Responsive iframe** with proper styling
- **User-friendly instructions** for navigation

### ✅ Conference Tour Section
- **Support for multiple tour destinations** (Mannar and Trincomalee)
- **Comprehensive tour information** for each destination
- **Interactive destination selection** for users to switch between tours
- **Dynamic display** of activities, cultural sites, and package features based on selected destination
- **Visual galleries** with promotional images for both destinations
- **Responsive design** optimized for all devices

## Technical Stack
- **React 18** with Vite build system
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **Shadcn/UI** components

## Setup Instructions

### Prerequisites
- Node.js (version 16 or higher)
- npm or pnpm

### Installation
1. Extract the zip file
2. Navigate to the project directory:
   ```bash
   cd ichr2026-website
   ```

3. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5173`

### Building for Production
```bash
npm run build
```

The built files will be in the `dist` directory.

### Deployment
The website can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any web server

## Project Structure
```
ichr2026-website/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navigation header
│   │   ├── Hero.jsx            # Hero section with ceremony logo
│   │   ├── About.jsx           # About section
│   │   ├── CallForPapers.jsx   # Call for papers
│   │   ├── PaperSubmission.jsx # Paper submission form
│   │   ├── Registration.jsx    # Registration form
│   │   ├── Programme.jsx       # Programme with PDF flipbook
│   │   ├── ConferenceTour.jsx  # Conference tour information
│   │   ├── Contact.jsx         # Contact information
│   │   ├── Footer.jsx          # Footer
│   │   └── ui/                 # Reusable UI components
│   ├── assets/
│   │   ├── ceremony-logo.jpeg  # ICHR2026 ceremony logo
│   │   ├── hero-bg.jpg         # Hero background image
│   │   ├── tour-image-1.jpg    # Mannar tour promotional image 1
│   │   ├── tour-image-2.jpg    # Mannar tour promotional image 2
│   │   ├── tour-image-3.jpg    # Trincomalee tour promotional image 1
│   │   ├── tour-image-4.jpg    # Trincomalee tour promotional image 2
│   │   └── ichr2026_logo_placeholder.png
│   ├── App.jsx                 # Main app component
│   ├── App.css                 # Global styles
│   └── main.jsx                # Entry point
├── public/                     # Static assets
├── dist/                       # Built files (after npm run build)
└── package.json                # Dependencies and scripts
```

## Key Features Details

### Registration System
- **Form validation** with required field checking
- **Category selection** with different pricing tiers
- **Special requirements** field for dietary restrictions
- **Terms and conditions** acceptance
- **Loading states** during form submission
- **Success/error messaging**

### Paper Submission
- **Multi-field form** for comprehensive paper details
- **File upload** with drag-and-drop support
- **Paper categorization** system
- **Author information** collection
- **Submission tracking** capabilities

### PDF Flipbook
- **Interactive brochure** using Heyzine flipbook service
- **Responsive design** that works on all devices
- **Integrated seamlessly** into the Programme section

### Conference Tour
- **Multi-destination support** for Mannar and Trincomalee
- **Interactive destination selection** for users
- **Dynamic display** of activities, cultural sites, and package features per destination
- **Visual content** from promotional materials for both destinations
- **Contact information** for tour arrangements

## Color Scheme
- **Navy Blue**: #003366 (Primary brand color)
- **Blue**: #4A90E2 (Secondary brand color)
- **Gold**: #F5A623 (Accent color)
- **Light Gray**: #F8F9FA (Background color)

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contact
For technical support or questions about the website, please contact the development team.

---

**Conference Details:**
- **Event**: 2nd International Conference on Harmony & Reconciliation
- **Date**: January 28-29, 2026
- **Venue**: University of Vavuniya
- **Theme**: Fostering unity for social cohesion through adaptive digital landscapes
