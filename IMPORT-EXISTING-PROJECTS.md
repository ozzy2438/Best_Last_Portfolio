# 📥 Import Existing Projects to PostgreSQL

After deploying to Railway, you'll need to import your 5 existing projects from SQL Server.

## Option 1: Using Railway Dashboard (Easiest)

### Step 1: Connect to PostgreSQL
1. Go to Railway dashboard
2. Click on PostgreSQL database
3. Click "Data" tab
4. You'll see a query editor

### Step 2: Insert Projects One by One
Copy and run these SQL commands in Railway's query editor:

```sql
-- Project 1: Manchester City
INSERT INTO projects (title, short_description, full_description, technologies, github_url, live_demo_url, category, status, impact_metrics, cover_image_path)
VALUES (
  'Manchester City WSL Championship Analytics',
  'Converting £2.5M transfer budget into measurable competitive advantage through advanced predictive analytics.',
  'Critical challenge solved: Converting £2.5M transfer budget into measurable competitive advantage for Manchester City Women''s championship pursuit through advanced predictive analytics. Increased championship probability from 5.2% to 79.7% through strategic transfers.',
  'SQL, Python, Power BI, RandomForest, GradientBoosting',
  'https://github.com/ozzy2438/MoneyBall-Manchester-City',
  'https://www.canva.com/design/DAGzxo8J3VM/4UN-WJI8tbTppTjsJeVMiw/edit',
  'Data Analytics',
  'active',
  'Impact: +8.5 league points improvement potential, ROI: 47% improvement in transfer efficiency, Methodology: SQL data modeling + Python ML + Power BI dashboards, Championship Probability: Increased from 5.2% to 79.7%',
  'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=800&auto=format&fit=crop'
);

-- Project 2: Energy Operations
INSERT INTO projects (title, short_description, full_description, technologies, github_url, live_demo_url, category, status, impact_metrics, cover_image_path)
VALUES (
  'Energy Operations Forecast Platform',
  'End-to-end energy market intelligence platform that automates forecasting for power trading operations.',
  'Advanced Energy Market Forecasting Platform: End-to-end energy market intelligence platform that automates forecasting for power trading operations, enabling teams to predict price volatility and demand fluctuations with 95%+ reliability.',
  'Python, Pandas, NumPy, Streamlit, Plotly, OAuth2, SMTP',
  'https://github.com/ozzy2438/Energy-Operations-Forecast',
  'https://www.canva.com/design/DAGzxJJLMEc/YlcBw7gUbsZXJF7ZRqudXA/watch',
  'Machine Learning',
  'active',
  'Annual Profits: $500K-$5M, Forecast Accuracy: 95%+, Automation: 8-10 hours/week to 30 minutes, Risk Management: Proactive trading vs reactive losses',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop'
);

-- Project 3: Weather Energy Analysis
INSERT INTO projects (title, short_description, full_description, technologies, github_url, live_demo_url, category, status, impact_metrics, cover_image_path)
VALUES (
  'Weather-Driven Energy Demand Analysis & Risk Optimization | Australian Energy Market',
  'Australian energy market analysis identifying weather-driven correlations across 9,000+ trading intervals.',
  'Executive Summary: Australian energy retailers face $50M+ annual losses from weather-driven price volatility. This analysis developed predictive models identifying critical weather-market correlations across 9,000+ trading intervals, enabling $8-12M in annual portfolio optimization.',
  'SQL Server, Python, Power BI, Statistical Analysis, Time Series',
  'https://github.com/ozzy2438/energy_weather_price_forecast',
  'https://www.canva.com/design/DAGz8viPYlM/Vw4Jbiq0ytMKiNwHjXuQug/watch',
  'Data Analytics',
  'active',
  'Improved customer retention by 15% through data-driven email marketing campaigns,Enabled $8-12M annual portfolio optimization through strategic load shifting,Identified compound weather events causing 65% of volatility losses',
  'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&auto=format&fit=crop'
);

-- Project 4: Business USA
INSERT INTO projects (title, short_description, full_description, technologies, github_url, live_demo_url, category, status, impact_metrics, cover_image_path)
VALUES (
  'Business Readiness USA - County Expansion Analytics',
  'Ranking system for 3,181 US counties using growth, structure, and specialization signals to support strategic business expansion.',
  'Comprehensive US County Analysis: Ranking system for 3,181 US counties using growth, structure, and specialization signals to support strategic business expansion planning with transparent "Opportunity Score" methodology.',
  'SQL, Python, Power BI, Statistical Analysis, Geographic Analysis',
  'https://github.com/ozzy2438/Business_Analysis_USA',
  'https://www.canva.com/design/DAGz8viPYlM/Vw4Jbiq0ytMKiNwHjXuQug/watch',
  'Data Analytics',
  'active',
  'County Analysis: 3,181 US counties ranked, Opportunity Score methodology developed, Strategic expansion planning support',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop'
);
```

### For NYC Delivery Project (with uploaded files):
This project has images and video in `uploads/` folder. You'll need to:

1. **Upload files to Cloudinary first:**
   - Go to https://cloudinary.com dashboard
   - Click "Media Library"
   - Upload these files from your local `uploads/` folder:
     - `1759225376611-Image 30-9-2025 at 6.15â¯PM.png`
     - `1759225376621-Image 30-9-2025 at 6.11â¯PM.png`
     - `1759225376621-Image 30-9-2025 at 6.09â¯PM.png`
     - `1759225376622-Image 30-9-2025 at 6.10â¯PM.png` (x3)
     - `1759225711904-new_recording_-_9_30_2025,_5_30_05_pm (720p).mp4`

2. **Get Cloudinary URLs:**
   After upload, Cloudinary will give you URLs like:
   `https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/filename.png`

3. **Insert project with Cloudinary URLs:**
```sql
INSERT INTO projects (
  title, short_description, full_description, technologies,
  github_url, category, status, impact_metrics,
  cover_image_path, additional_images_paths, demo_video_path
)
VALUES (
  'NYC Delivery Promise Engine',
  'Production-style ML prototype fusing 3.8M+ NYC trip records to predict reliable ETAs (P50/P90) and delay risk.',
  '## Project Overview...[full description from backup]',
  'Python,ML Tools,Regression,Random Forest,Basic Trees,Model Training,Scikit-learn',
  'https://github.com/ozzy2438/ClearPromise-NYC.git',
  'Machine Learning',
  'active',
  'Reduced late deliveries 50% → 10%, saving $4.1M annually; Increased revenue $2.3M/year via surge pricing',
  'YOUR_CLOUDINARY_URL_FOR_COVER_IMAGE',
  'CLOUDINARY_URL_1,CLOUDINARY_URL_2,CLOUDINARY_URL_3,CLOUDINARY_URL_4,CLOUDINARY_URL_5',
  'YOUR_CLOUDINARY_VIDEO_URL'
);
```

---

## Option 2: Use Admin Panel (After Deployment)

Once your site is live:

1. Go to `https://your-netlify-site.netlify.app/admin.html`
2. Add each project manually using the form
3. Upload images/videos through the interface
4. Cloudinary will handle everything automatically

**Pros:**
- No SQL needed
- Visual interface
- Automatic file upload to Cloudinary

**Cons:**
- Takes longer (but only 10-15 minutes for 5 projects)
- Need to re-enter all text content

---

## 💡 Recommendation

**Use Option 2 (Admin Panel)** because:
- ✅ Easier - no SQL knowledge needed
- ✅ Files automatically go to Cloudinary
- ✅ Visual confirmation everything works
- ✅ You can verify each project looks good before moving to next

Just copy-paste the content from `projects-backup.json` into the admin form fields!

---

## ⚠️ Important Note

After migration, you can delete:
- `server.js` (old SQL Server version)
- `.env` (old credentials - don't commit!)
- `projects-backup.json` (after confirming data is migrated)

Keep using `server-postgres.js` as your production backend.