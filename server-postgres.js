const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static('uploads'));
app.use(express.static('.'));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// PostgreSQL connection with SSL configuration for Aiven
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test database connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Error connecting to PostgreSQL database:', err.stack);
    } else {
        console.log('✅ Connected to PostgreSQL database');
        release();
    }
});

// Create tables if they don't exist
async function initDatabase() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS projects (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            short_description TEXT,
            full_description TEXT,
            technologies VARCHAR(500),
            github_url VARCHAR(500),
            live_demo_url VARCHAR(500),
            category VARCHAR(100),
            status VARCHAR(50),
            image_path VARCHAR(500),
            demo_video_path VARCHAR(500),
            impact_metrics TEXT,
            created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            cover_image_path VARCHAR(500),
            additional_images_paths TEXT
        );
    `;

    try {
        await pool.query(createTableQuery);
        console.log('✅ Database tables initialized');
    } catch (err) {
        console.error('❌ Error creating tables:', err);
    }
}

initDatabase();

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + file.originalname;
        cb(null, uniqueSuffix);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Get all projects
app.get('/api/projects', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM projects ORDER BY created_date DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// Get single project
app.get('/api/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching project:', err);
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});

// Create new project
app.post('/api/projects', upload.fields([
    { name: 'cover_image', maxCount: 1 },
    { name: 'additional_images', maxCount: 10 },
    { name: 'demo_video', maxCount: 1 }
]), async (req, res) => {
    try {
        const {
            title,
            short_description,
            full_description,
            technologies,
            github_url,
            live_demo_url,
            category,
            status,
            impact_metrics
        } = req.body;

        const coverImagePath = req.files.cover_image ? req.files.cover_image[0].path : null;
        const additionalImagesPaths = req.files.additional_images ?
            req.files.additional_images.map(file => file.path).join(',') : null;
        const demoVideoPath = req.files.demo_video ? req.files.demo_video[0].path : null;

        const query = `
            INSERT INTO projects (
                title, short_description, full_description, technologies,
                github_url, live_demo_url, category, status, impact_metrics,
                cover_image_path, additional_images_paths, demo_video_path
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *
        `;

        const values = [
            title, short_description, full_description, technologies,
            github_url, live_demo_url, category, status || 'active', impact_metrics,
            coverImagePath, additionalImagesPaths, demoVideoPath
        ];

        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating project:', err);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// Update project
app.put('/api/projects/:id', upload.fields([
    { name: 'cover_image', maxCount: 1 },
    { name: 'additional_images', maxCount: 10 },
    { name: 'demo_video', maxCount: 1 }
]), async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            short_description,
            full_description,
            technologies,
            github_url,
            live_demo_url,
            category,
            status,
            impact_metrics
        } = req.body;

        // Build dynamic update query
        let queryParts = [
            'title = $1',
            'short_description = $2',
            'full_description = $3',
            'technologies = $4',
            'github_url = $5',
            'live_demo_url = $6',
            'category = $7',
            'status = $8',
            'impact_metrics = $9',
            'updated_date = CURRENT_TIMESTAMP'
        ];

        let values = [
            title, short_description, full_description, technologies,
            github_url, live_demo_url, category, status, impact_metrics
        ];

        let paramCount = 10;

        if (req.files.cover_image) {
            queryParts.push(`cover_image_path = $${paramCount}`);
            values.push(req.files.cover_image[0].path);
            paramCount++;
        }

        if (req.files.additional_images) {
            queryParts.push(`additional_images_paths = $${paramCount}`);
            values.push(req.files.additional_images.map(file => file.path).join(','));
            paramCount++;
        }

        if (req.files.demo_video) {
            queryParts.push(`demo_video_path = $${paramCount}`);
            values.push(req.files.demo_video[0].path);
            paramCount++;
        }

        values.push(id);

        const query = `UPDATE projects SET ${queryParts.join(', ')} WHERE id = $${paramCount} RETURNING *`;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json({ message: 'Project updated successfully', project: result.rows[0] });
    } catch (err) {
        console.error('Error updating project:', err);
        res.status(500).json({ error: 'Failed to update project' });
    }
});

// Delete project
app.delete('/api/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json({ message: 'Project deleted successfully' });
    } catch (err) {
        console.error('Error deleting project:', err);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});