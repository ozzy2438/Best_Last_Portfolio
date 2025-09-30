const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

const dbConfig = {
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

let pool;

async function connectDB() {
    try {
        pool = await sql.connect(dbConfig);
        console.log('Connected to SQL Server database');
    } catch (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
}

app.get('/api/projects', async (req, res) => {
    try {
        const result = await pool.request().query('SELECT * FROM Projects ORDER BY created_date DESC');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

app.get('/api/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Projects WHERE id = @id');

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error fetching project:', err);
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});

app.post('/api/projects', upload.fields([
    { name: 'cover_image', maxCount: 1 },
    { name: 'additional_images', maxCount: 10 },
    { name: 'demo_video', maxCount: 1 }
]), async (req, res) => {
    try {
        console.log('📝 Received project data:', req.body);
        console.log('📁 Received files:', req.files);

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

        // Validate required fields
        if (!title || !short_description) {
            console.error('❌ Missing required fields:', { title, short_description });
            return res.status(400).json({ error: 'Title and short description are required' });
        }

        console.log('✅ Parsed data:', {
            title: title ? title.substring(0, 50) + '...' : null,
            short_description: short_description ? short_description.substring(0, 50) + '...' : null,
            category,
            status
        });

        const cover_image_path = req.files.cover_image ? req.files.cover_image[0].path : null;
        const additional_images_paths = req.files.additional_images ?
            req.files.additional_images.map(file => file.path).join(',') : null;
        const demo_video_path = req.files.demo_video ? req.files.demo_video[0].path : null;

        console.log('🔄 Preparing SQL parameters...');

        // Truncate short_description if it's too long for better UX
        const truncatedShortDesc = short_description && short_description.length > 1000 ?
            short_description.substring(0, 997) + '...' :
            short_description || '';

        console.log(`📏 Short description length: ${truncatedShortDesc.length} characters`);

        const result = await pool.request()
            .input('title', sql.NVarChar(255), title || '')
            .input('short_description', sql.NVarChar(1000), truncatedShortDesc)
            .input('full_description', sql.NText, full_description || null)
            .input('technologies', sql.NVarChar(500), technologies || null)
            .input('github_url', sql.NVarChar(500), github_url || null)
            .input('live_demo_url', sql.NVarChar(500), live_demo_url || null)
            .input('category', sql.NVarChar(100), category || null)
            .input('status', sql.NVarChar(50), status || 'active')
            .input('cover_image_path', sql.NVarChar(500), cover_image_path || null)
            .input('additional_images_paths', sql.NText, additional_images_paths || null)
            .input('demo_video_path', sql.NVarChar(500), demo_video_path || null)
            .input('impact_metrics', sql.NText, impact_metrics || null)
            .query(`
                INSERT INTO Projects (
                    title, short_description, full_description, technologies,
                    github_url, live_demo_url, category, status, cover_image_path,
                    additional_images_paths, demo_video_path, impact_metrics, created_date
                )
                OUTPUT INSERTED.id
                VALUES (
                    @title, @short_description, @full_description, @technologies,
                    @github_url, @live_demo_url, @category, @status, @cover_image_path,
                    @additional_images_paths, @demo_video_path, @impact_metrics, GETDATE()
                )
            `);

        console.log('✅ Project created successfully! ID:', result.recordset[0].id);

        res.status(201).json({
            message: 'Project created successfully',
            id: result.recordset[0].id
        });
    } catch (err) {
        console.error('Error creating project:', err);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

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

        let updateQuery = `
            UPDATE Projects SET
                title = @title,
                short_description = @short_description,
                full_description = @full_description,
                technologies = @technologies,
                github_url = @github_url,
                live_demo_url = @live_demo_url,
                category = @category,
                status = @status,
                impact_metrics = @impact_metrics,
                updated_date = GETDATE()
        `;

        const request = pool.request()
            .input('id', sql.Int, id)
            .input('title', sql.NVarChar(255), title)
            .input('short_description', sql.NVarChar(500), short_description)
            .input('full_description', sql.NText, full_description)
            .input('technologies', sql.NVarChar(500), technologies)
            .input('github_url', sql.NVarChar(500), github_url)
            .input('live_demo_url', sql.NVarChar(500), live_demo_url)
            .input('category', sql.NVarChar(100), category)
            .input('status', sql.NVarChar(50), status)
            .input('impact_metrics', sql.NText, impact_metrics);

        if (req.files.cover_image) {
            updateQuery += ', cover_image_path = @cover_image_path';
            request.input('cover_image_path', sql.NVarChar(500), req.files.cover_image[0].path);
        }

        if (req.files.additional_images) {
            updateQuery += ', additional_images_paths = @additional_images_paths';
            request.input('additional_images_paths', sql.NText,
                req.files.additional_images.map(file => file.path).join(','));
        }

        if (req.files.demo_video) {
            updateQuery += ', demo_video_path = @demo_video_path';
            request.input('demo_video_path', sql.NVarChar(500), req.files.demo_video[0].path);
        }

        updateQuery += ' WHERE id = @id';

        await request.query(updateQuery);
        res.json({ message: 'Project updated successfully' });
    } catch (err) {
        console.error('Error updating project:', err);
        res.status(500).json({ error: 'Failed to update project' });
    }
});

app.delete('/api/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Projects WHERE id = @id');

        res.json({ message: 'Project deleted successfully' });
    } catch (err) {
        console.error('Error deleting project:', err);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await sql.close();
    process.exit(0);
});