# 🚀 Osman Orka - Data Analyst Portfolio

Professional portfolio website showcasing data analytics and machine learning projects with a full-featured admin panel for dynamic content management.

## ✨ Features

- **Dynamic Project Management**: Add, edit, and delete projects through admin interface
- **Rich Content**: Support for markdown descriptions, images, and demo videos
- **Responsive Design**: Mobile-friendly interface with modern UI
- **Real-time Updates**: Changes reflect immediately on the portfolio
- **Secure Admin Panel**: Protected project management system
- **Cloud Storage**: Integrated with Cloudinary for image/video hosting
- **Production Ready**: Deployed on Railway (backend) + Netlify (frontend)

## 🛠️ Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Responsive design with modern CSS
- Font Awesome icons
- Google Fonts (Inter)

### Backend
- Node.js + Express
- PostgreSQL database
- Multer for file uploads
- Cloudinary for cloud storage
- CORS enabled API

### Deployment
- **Frontend**: Netlify (Static hosting)
- **Backend**: Railway (Node.js + PostgreSQL)
- **Storage**: Cloudinary (Images + Videos)

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (for local development)
- Cloudinary account (free tier)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/portfolio.git
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
DATABASE_URL=your_postgresql_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=3000
```

4. Start the server:
```bash
npm start
```

5. Open `http://localhost:3000` in your browser

## 🚀 Deployment

**See [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md) for detailed deployment instructions.**

Quick overview:
1. Set up Cloudinary account
2. Push to GitHub
3. Deploy backend to Railway
4. Deploy frontend to Netlify
5. Update API URLs
6. Import existing projects (see [IMPORT-EXISTING-PROJECTS.md](IMPORT-EXISTING-PROJECTS.md))

**Total time: ~25 minutes**
**Cost: $0/month** (using free tiers)

## 📁 Project Structure

```
portfolio/
├── index.html              # Main portfolio page
├── admin.html             # Admin panel for project management
├── styles.css             # Global styles
├── simple-projects.js     # Frontend project display logic
├── admin.js              # Admin panel logic
├── server-postgres.js    # Production backend (PostgreSQL)
├── server.js            # Development backend (SQL Server)
├── package.json         # Node dependencies
├── railway.json         # Railway deployment config
├── netlify.toml         # Netlify deployment config
├── .env.example         # Environment variables template
├── .gitignore          # Git ignore rules
└── uploads/            # Local file storage (dev only)
```

## 🎯 Usage

### Adding a New Project

1. Go to `/admin.html`
2. Fill in project details:
   - Title, descriptions, technologies
   - GitHub and demo URLs
   - Impact metrics
3. Upload cover image (required)
4. Upload additional charts/images (optional)
5. Upload demo video (optional)
6. Click "Add Project"

### Editing Projects

1. Go to `/admin.html`
2. Click "Edit" on any project
3. Modify fields as needed
4. Leave file inputs empty to keep existing files
5. Upload new files only if you want to replace them
6. Click "Update Project"

## 🔒 Security

- Environment variables for sensitive data
- `.gitignore` protects credentials
- CORS configured for specific origins
- SQL injection prevention with parameterized queries
- File upload validation

## 📊 Database Schema

```sql
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  short_description TEXT,
  full_description TEXT,
  technologies VARCHAR(500),
  github_url VARCHAR(500),
  live_demo_url VARCHAR(500),
  category VARCHAR(100),
  status VARCHAR(50),
  impact_metrics TEXT,
  cover_image_path VARCHAR(500),
  additional_images_paths TEXT,
  demo_video_path VARCHAR(500),
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎨 Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #1a1a2e;
    --secondary-color: #16213e;
    --accent-color: #2563eb;
    --text-primary: #e0e0e0;
    --text-secondary: #b0b0b0;
}
```

### Content
- Hero section: Edit `index.html` (lines 35-97)
- About section: Edit `index.html` (lines 99-223)
- Skills section: Edit `index.html` (lines 234-280)

## 📝 License

MIT License - feel free to use this for your own portfolio!

## 🤝 Contributing

This is a personal portfolio, but suggestions and bug reports are welcome!

## 📧 Contact

- **Email**: osmanorka@gmail.com
- **LinkedIn**: [linkedin.com/in/osmanorka](https://linkedin.com/in/osmanorka)
- **GitHub**: [github.com/ozzy2438](https://github.com/ozzy2438)

---

**Built with ❤️ by Osman Orka**

🌟 **Live Demo**: [Coming Soon After Deployment]