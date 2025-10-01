# 📝 How to Add a New Project

## Super Simple Workflow:

1. **Open `projects.json`**
2. **Add your project** (copy template below)
3. **Save file**
4. **Push to GitHub:**
   ```bash
   git add projects.json
   git commit -m "Add new project: [Project Name]"
   git push
   ```
5. **Done!** Netlify auto-deploys → Live on osmanorka.com

---

## 📋 Project Template

Copy this template and fill in your project details:

```json
{
  "id": 999,
  "title": "Your Project Title",
  "short_description": "Brief description for the project card (1-2 sentences, max 200 chars)",
  "full_description": "## Project Overview\nDetailed description with markdown formatting.\n\n### Key Features\n- Feature 1\n- Feature 2",
  "technologies": "Python, React, Node.js, PostgreSQL",
  "github_url": "https://github.com/yourusername/your-repo",
  "live_demo_url": "https://your-demo-url.com",
  "category": "Data Analytics",
  "status": "active",
  "impact_metrics": "Impact 1: Description,Impact 2: Description,Impact 3: Description",
  "cover_image_path": "https://images.unsplash.com/photo-XXXXX?w=800&auto=format&fit=crop",
  "additional_images_paths": "https://example.com/img1.png,https://example.com/img2.png",
  "demo_video_path": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

---

## 🎨 Field Explanations:

| Field | Required? | Description | Example |
|-------|-----------|-------------|---------|
| `id` | ✅ Yes | Unique number (use next available number) | `7` |
| `title` | ✅ Yes | Project name | `"NYC Delivery Analytics"` |
| `short_description` | ✅ Yes | Brief summary for card | `"ML model reducing delivery delays by 40%"` |
| `full_description` | ❌ Optional | Full markdown description | `"## Overview\nThis project..."` |
| `technologies` | ✅ Yes | Comma-separated tech stack | `"Python, SQL, React"` |
| `github_url` | ✅ Yes | GitHub repo link | `"https://github.com/..."` |
| `live_demo_url` | ❌ Optional | Demo link (Canva, deployed site, etc.) | `"https://demo.com"` |
| `category` | ✅ Yes | One of: `Data Analytics`, `Machine Learning`, `Web Development` | `"Data Analytics"` |
| `status` | ❌ Optional | `active`, `archived`, or `draft` | `"active"` |
| `impact_metrics` | ❌ Optional | Comma-separated achievements | `"Revenue: +$2M,Users: 10K+"` |
| `cover_image_path` | ❌ Optional | Image URL (Unsplash, Imgur, etc.) | `"https://images.unsplash.com/..."` |
| `additional_images_paths` | ❌ Optional | Comma-separated image URLs | `"https://i.imgur.com/1.png,https://i.imgur.com/2.png"` |
| `demo_video_path` | ❌ Optional | YouTube URL or direct video link | `"https://youtube.com/watch?v=xyz"` |

---

## 🖼️ Image Guidelines:

### Cover Image:
- **Recommended:** Use Unsplash for professional stock photos
- **URL Format:** `https://images.unsplash.com/photo-XXXXX?w=800&auto=format&fit=crop`
- **Size:** ~800x600px works best
- **Or:** Upload to Imgur.com and use direct link

### Additional Images:
- Upload screenshots to [Imgur](https://imgur.com)
- Get direct image link (ends with `.png` or `.jpg`)
- Separate multiple URLs with commas (NO spaces!)

### Demo Video:
- **YouTube:** Just paste the watch URL: `https://www.youtube.com/watch?v=VIDEO_ID`
- **Direct video:** Upload to file hosting and use direct `.mp4` link

---

## ✅ Categories Available:

- `Data Analytics`
- `Machine Learning`
- `Web Development`
- `Mobile Development`
- `Cloud Computing`
- `Other`

---

## 💡 Tips:

1. **ID Numbers:** Use the next available number (check existing projects)
2. **Commas in Arrays:** NO spaces after commas in `technologies`, `impact_metrics`, etc.
   - ✅ `"Python,SQL,React"`
   - ❌ `"Python, SQL, React"`
3. **Markdown:** `full_description` supports markdown (`##` for headers, `-` for bullets, etc.)
4. **Image Sources:**
   - [Unsplash](https://unsplash.com) - Free professional photos
   - [Imgur](https://imgur.com) - Free image hosting
5. **Test Locally:** Open `index.html` in browser before pushing

---

## 🚀 Example: Adding "Smart Parking System"

1. Open `projects.json`
2. Add comma after last project `}`
3. Paste this:

```json
{
  "id": 7,
  "title": "Smart Parking System with IoT Sensors",
  "short_description": "IoT-based parking management reducing search time by 65% using real-time occupancy tracking",
  "full_description": "## Overview\nSmart parking solution using IoT sensors and ML to predict parking availability.\n\n## Key Features\n- Real-time occupancy tracking\n- Mobile app integration\n- Predictive analytics",
  "technologies": "Python,IoT,React Native,PostgreSQL",
  "github_url": "https://github.com/ozzy2438/smart-parking",
  "live_demo_url": "https://smart-parking-demo.netlify.app",
  "category": "Machine Learning",
  "status": "active",
  "impact_metrics": "Search Time: -65%,Revenue: +$1.2M annually,User Satisfaction: 94%",
  "cover_image_path": "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop",
  "additional_images_paths": "https://i.imgur.com/dashboard.png,https://i.imgur.com/mobile.png",
  "demo_video_path": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

4. Save, commit, push → Live in 2 minutes! 🎉

---

## 🔥 That's It!

No backend, no database, no admin panel. Just JSON → GitHub → Live! ✨
