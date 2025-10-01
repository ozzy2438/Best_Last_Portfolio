const API_BASE_URL = 'https://best-last-portfolio-2.onrender.com/api';

let projectDetails = {};

async function loadProjectsFromAPI() {
    try {
        console.log('🔄 Loading projects from API...');
        console.log('🌐 API URL:', `${API_BASE_URL}/projects`);
        const response = await fetch(`${API_BASE_URL}/projects`, {
            cache: 'no-cache',
            headers: {
                'Cache-Control': 'no-cache'
            }
        });
        console.log('📡 API response status:', response.status);

        if (response.ok) {
            const projects = await response.json();
            console.log('✅ Loaded', projects.length, 'projects from database');
            console.log('📋 Project titles:', projects.map(p => p.title));
            return projects;
        } else {
            console.error('❌ Failed to load projects from API, status:', response.status);
            return [];
        }
    } catch (error) {
        console.error('💥 Error loading projects:', error);
        return [];
    }
}

function createProjectCard(project) {
    const technologies = project.technologies ? project.technologies.split(',').map(tech => tech.trim()) : [];
    const impactMetrics = project.impact_metrics ? project.impact_metrics.split(',').map(metric => metric.trim()) : [];

    const techTags = technologies.map(tech => `<span class="tag">${tech}</span>`).join('');

    // Format impact metrics exactly like the original with proper key-value formatting
    const impactList = impactMetrics.length > 0 ?
        impactMetrics.map(metric => {
            if (metric.includes(':')) {
                const [key, value] = metric.split(':').map(s => s.trim());
                return `<li><strong>${key}:</strong> ${value}</li>`;
            }
            return `<li><strong>Impact:</strong> ${metric}</li>`;
        }).join('') :
        '<li>No metrics available</li>';

    // Default images based on category - matching original exactly
    const defaultImages = {
        'Data Analytics': 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&auto=format&fit=crop',
        'Machine Learning': 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&auto=format&fit=crop',
        'Web Development': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop'
    };

    const defaultImage = defaultImages[project.category] || defaultImages['Data Analytics'];

    // Use cover_image_path first, then fallback to image_path, then default
    const imageUrl = project.cover_image_path ?
        `https://best-last-portfolio-2.onrender.com/${encodeURI(project.cover_image_path)}` :
        (project.image_path ? `https://best-last-portfolio-2.onrender.com/${encodeURI(project.image_path)}` : defaultImage);

    // Get appropriate alt text based on category
    const altTexts = {
        'Data Analytics': 'Data Analytics',
        'Machine Learning': 'Machine Learning',
        'Web Development': 'Web Development'
    };
    const altText = altTexts[project.category] || project.title;

    return `
        <div class="project-card">
            <div class="project-image">
                <img src="${imageUrl}" alt="${altText}" loading="lazy" onerror="this.src='${defaultImage}'">
            </div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <div class="project-tags">
                    ${techTags}
                </div>
                <p>${project.short_description || 'No description available'}</p>

                <div class="project-highlights">
                    <ul>
                        ${impactList}
                    </ul>
                </div>

                <div class="project-links">
                    ${project.github_url ? `
                        <a href="${project.github_url}" target="_blank" class="btn-link">
                            <i class="fab fa-github"></i> View Code
                        </a>
                    ` : ''}
                    ${project.live_demo_url ? `
                        <a href="${project.live_demo_url}" target="_blank" class="btn-link">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>
                    ` : ''}
                    <button class="btn-link read-more-btn" data-project="project-${project.id}">
                        <i class="fas fa-info-circle"></i> Read More
                    </button>
                </div>
            </div>
        </div>
    `;
}

function prepareProjectDetails(projects) {
    projects.forEach(project => {
        const projectKey = `project-${project.id}`;

        let fullContent = `
            <h2>Project Overview</h2>
            <p><strong>${project.title}</strong></p>
            <p>${project.full_description || project.short_description || 'No detailed description available'}</p>
        `;

        if (project.demo_video_path) {
            const videoUrl = `https://best-last-portfolio-2.onrender.com/${encodeURI(project.demo_video_path)}`;
            fullContent = `
                <div class="video-demo-section">
                    <h3>🎥 Project Demo</h3>
                    <div class="video-container">
                        <video controls style="width: 100%; max-width: 800px;">
                            <source src="${videoUrl}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            ` + fullContent;
        }

        if (project.additional_images_paths) {
            const additionalImages = project.additional_images_paths.split(',').filter(path => path.trim());
            if (additionalImages.length > 0) {
                fullContent += `
                    <h3>📸 Additional Images</h3>
                    <div class="dashboard-gallery">
                        <div class="dashboard-row">
                            ${additionalImages.map(imagePath => {
                                const imageUrl = `https://best-last-portfolio-2.onrender.com/${encodeURI(imagePath.trim())}`;
                                return `<img src="${imageUrl}" alt="Project Screenshot" style="width: 48%; margin-right: 2%; margin-bottom: 1rem;">`;
                            }).join('')}
                        </div>
                    </div>
                `;
            }
        }

        if (project.technologies) {
            fullContent += `
                <h3>🛠️ Technologies Used</h3>
                <ul>
                    ${project.technologies.split(',').map(tech => `<li><strong>${tech.trim()}</strong></li>`).join('')}
                </ul>
            `;
        }

        if (project.impact_metrics) {
            fullContent += `
                <h3>📈 Key Achievements</h3>
                <ul>
                    ${project.impact_metrics.split(',').map(metric => `<li>${metric.trim()}</li>`).join('')}
                </ul>
            `;
        }

        if (project.github_url || project.live_demo_url) {
            fullContent += `
                <h3>🔗 Project Links</h3>
                <ul>
                    ${project.github_url ? `<li><a href="${project.github_url}" target="_blank">💻 GitHub Repository</a></li>` : ''}
                    ${project.live_demo_url ? `<li><a href="${project.live_demo_url}" target="_blank">🌐 Live Demo</a></li>` : ''}
                </ul>
            `;
        }

        projectDetails[projectKey] = {
            title: project.title,
            content: fullContent
        };
    });
}

async function renderProjects() {
    console.log('🎯 renderProjects() called');
    const projectsContainer = document.querySelector('#projects .container');

    if (!projectsContainer) {
        console.error('❌ Projects container not found');
        return;
    }

    console.log('✅ Projects container found:', projectsContainer);

    const projects = await loadProjectsFromAPI();
    console.log('📊 Projects received in renderProjects():', projects.length);

    if (projects.length === 0) {
        projectsContainer.innerHTML = `
            <h2 class="section-title">Projects</h2>
            <div class="project-card">
                <div class="project-content">
                    <h3>No Projects Available</h3>
                    <p>Projects are currently being loaded. Please check back later or contact the administrator.</p>
                    <div class="project-links">
                        <a href="admin.html" class="btn-link">
                            <i class="fas fa-plus"></i> Add New Project
                        </a>
                    </div>
                </div>
            </div>
        `;
        return;
    }

    prepareProjectDetails(projects);

    const projectsHTML = projects.map(project => createProjectCard(project)).join('');

    projectsContainer.innerHTML = `
        <h2 class="section-title">Projects</h2>
        ${projectsHTML}
        <div style="text-align: center; margin-top: 2rem;">
            <a href="admin.html" class="btn-primary">
                <i class="fas fa-plus"></i> Add New Project
            </a>
        </div>
    `;

    setupReadMoreButtons();
}

function setupReadMoreButtons() {
    const readMoreBtns = document.querySelectorAll('.read-more-btn');
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');

    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const projectKey = btn.getAttribute('data-project');
            const project = projectDetails[projectKey];

            if (project && modal && modalBody) {
                modalBody.innerHTML = `
                    <h2>${project.title}</h2>
                    ${project.content}
                `;
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Content Loaded - dynamic-projects.js starting...');
    renderProjects();
});