console.log('🚀 Simple projects script loaded');

// API configuration
const API_BASE_URL = 'https://best-last-portfolio-2.onrender.com/api';

// Simple markdown to HTML converter for project descriptions
function markdownToHTML(text) {
    if (!text) return '';

    let html = text;

    // Convert headers
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Convert lists
    html = html.replace(/^[\-\*] (.+)$/gm, '<li>$1</li>');

    // Wrap consecutive list items in ul tags
    html = html.replace(/(<li>.*<\/li>(\n<li>.*<\/li>)*)/gm, '<ul>$1</ul>');

    // Fix multiple ul tags
    html = html.replace(/<\/ul>\s*<ul>/gm, '');

    // Convert bold text
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Convert italic text
    html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');

    // Convert inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Convert line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');

    // Wrap in paragraphs
    if (!html.includes('<h') && !html.includes('<ul>')) {
        html = '<p>' + html + '</p>';
    }

    // Clean up
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>\s*<\/p>/g, '');
    html = html.replace(/<br><h/g, '<h');
    html = html.replace(/<\/h([1-6])><br>/g, '</h$1>');

    return html;
}

// SIMPLIFIED: Always truncate text SHORT to ensure Read More is needed
function truncateForCard(text) {
    if (!text) return 'Project description available...';

    let cleanText = text;

    // Remove markdown formatting for cleaner display
    cleanText = cleanText
        .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove bold markdown
        .replace(/\*(.*?)\*/g, '$1')      // Remove italic markdown
        .replace(/`(.*?)`/g, '$1')        // Remove code markdown
        .replace(/#{1,6}\s/g, '')         // Remove headers
        .replace(/^[-\*]\s/gm, '')        // Remove bullet points
        .replace(/\r?\n/g, ' ')           // Replace newlines with spaces
        .replace(/\s+/g, ' ')             // Normalize whitespace
        .trim();

    // FORCE SHORT TEXT - always truncate to ensure Read More is valuable
    const maxLength = 80; // Very short to force Read More

    if (cleanText.length > maxLength) {
        // Find a good break point
        let truncated = cleanText.substring(0, maxLength);
        const lastSpace = truncated.lastIndexOf(' ');
        if (lastSpace > 30) {
            truncated = truncated.substring(0, lastSpace);
        }
        return truncated + '...';
    }

    // Even if text is short, add ellipsis to indicate more content
    return cleanText + '...';
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', async function() {
    console.log('📄 DOM loaded - starting simple project loading...');

    try {
        await loadAndDisplayProjects();
    } catch (error) {
        console.error('💥 Error in main function:', error);
        showError(error.message);
    }
});

// CRITICAL: Also ensure buttons are visible after everything loads
window.addEventListener('load', function() {
    console.log('🌟 Window fully loaded - ensuring Read More buttons are visible...');
    
    setTimeout(() => {
        if (typeof forceShowAllReadMoreButtons === 'function') {
            forceShowAllReadMoreButtons();
        }
        if (typeof checkTextOverflow === 'function') {
            checkTextOverflow();
        }
    }, 1000);
    
    // ULTIMATE FALLBACK: Keep checking every few seconds
    setInterval(() => {
        const hiddenButtons = document.querySelectorAll(`
            button[data-read-more="true"][style*="display: none"],
            button[onclick*="openProjectModal"][style*="display: none"],
            button[data-read-more="true"][style*="visibility: hidden"],
            button[onclick*="openProjectModal"][style*="visibility: hidden"]
        `);
        
        if (hiddenButtons.length > 0) {
            console.warn(`⚠️ Found ${hiddenButtons.length} hidden Read More buttons - forcing visibility...`);
            if (typeof forceShowAllReadMoreButtons === 'function') {
                forceShowAllReadMoreButtons();
            }
        }
    }, 3000);
});

// Main function to load and display projects
async function loadAndDisplayProjects() {
    const projectsContainer = document.querySelector('#projects .container');

    if (!projectsContainer) {
        console.error('❌ Projects container not found');
        return;
    }

    console.log('✅ Projects container found');

    try {
        // Show loading state
        projectsContainer.innerHTML = `
            <h2 class="section-title">Projects</h2>
            <div style="text-align: center; padding: 2rem;">
                <p style="color: #666;">🔄 Loading projects...</p>
            </div>
        `;

        // Fetch projects
        console.log('🌐 Fetching from:', `${API_BASE_URL}/projects`);
        const response = await fetch(`${API_BASE_URL}/projects`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });

        console.log('📡 Response status:', response.status);

        if (!response.ok) {
            throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }

        const projects = await response.json();
        console.log('✅ Projects received:', projects.length);

        if (projects.length === 0) {
            showNoProjects(projectsContainer);
            return;
        }

        // Display projects
        displayProjects(projects, projectsContainer);

        // Check for text overflow and manage Read More buttons
        enhancedOverflowCheck();

    } catch (error) {
        console.error('💥 Error loading projects:', error);
        showError(error.message, projectsContainer);
    }
}

// Display projects function
function displayProjects(projects, container) {
    console.log('🎨 Displaying projects...');

    const projectsHTML = projects.map(project => createProjectCard(project)).join('');

    container.innerHTML = `
        <h2 class="section-title">Projects</h2>
        ${projectsHTML}
        <div style="text-align: center; margin-top: 2rem;">
            <a href="admin.html" class="btn-primary">
                <i class="fas fa-plus"></i> Add New Project
            </a>
        </div>
    `;

    console.log('✅ Projects displayed successfully');
}

// Create project card HTML
function createProjectCard(project) {
    const technologies = project.technologies ? project.technologies.split(',').map(tech => tech.trim()) : [];
    const impactMetrics = project.impact_metrics ? project.impact_metrics.split(',').map(metric => metric.trim()) : [];

    // Check if there's more content in full_description
    const hasFullDescription = project.full_description && project.full_description.trim().length > 0;

    const techTags = technologies.map(tech => `<span class="tag">${tech}</span>`).join('');

    const impactList = impactMetrics.length > 0 ?
        impactMetrics.slice(0, 3).map(metric => {
            if (metric.includes(':')) {
                const [key, value] = metric.split(':').map(s => s.trim());
                return `<li><strong>${key}:</strong> ${value}</li>`;
            }
            return `<li><strong>Impact:</strong> ${metric}</li>`;
        }).join('') :
        '<li>No metrics available</li>';

    // Default images based on category
    const defaultImages = {
        'Data Analytics': 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&auto=format&fit=crop',
        'Machine Learning': 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&auto=format&fit=crop',
        'Web Development': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop'
    };

    const defaultImage = defaultImages[project.category] || defaultImages['Data Analytics'];
    // Check if the image path is already a full URL (starts with http)
    let imageUrl;
    if (project.cover_image_path) {
        imageUrl = project.cover_image_path.startsWith('http') ?
            project.cover_image_path :
            `http://localhost:3000/${project.cover_image_path}`;
    } else if (project.image_path) {
        imageUrl = project.image_path.startsWith('http') ?
            project.image_path :
            `http://localhost:3000/${project.image_path}`;
    } else {
        imageUrl = defaultImage;
    }

    const altText = project.category || project.title;

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
                <p>${truncateForCard(project.short_description) || 'No description available'}</p>

                <div class="project-highlights">
                    <ul>
                        ${impactList}
                    </ul>
                </div>

                <div class="project-links">
                    <button onclick="openProjectModal(${project.id})" class="btn-link" data-read-more="true" data-has-full-desc="${hasFullDescription}">
                        <i class="fas fa-info-circle"></i> Read More
                    </button>
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
                </div>
            </div>
        </div>
    `;
}

// Show error message
function showError(message, container) {
    const target = container || document.querySelector('#projects .container');
    if (target) {
        target.innerHTML = `
            <h2 class="section-title">Projects</h2>
            <div class="project-card">
                <div class="project-content">
                    <h3>❌ Error Loading Projects</h3>
                    <p>Error: ${message}</p>
                    <div class="project-links">
                        <button onclick="location.reload()" class="btn-link">
                            <i class="fas fa-refresh"></i> Try Again
                        </button>
                        <a href="admin.html" class="btn-link">
                            <i class="fas fa-plus"></i> Add New Project
                        </a>
                    </div>
                </div>
            </div>
        `;
    }
}

// Show no projects message
function showNoProjects(container) {
    container.innerHTML = `
        <h2 class="section-title">Projects</h2>
        <div class="project-card">
            <div class="project-content">
                <h3>No Projects Available</h3>
                <p>Projects are currently being loaded. Please check back later or add a new project.</p>
                <div class="project-links">
                    <a href="admin.html" class="btn-link">
                        <i class="fas fa-plus"></i> Add New Project
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Open project modal with full details
async function openProjectModal(projectId) {
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');

    try {
        console.log('🔍 Fetching project details for ID:', projectId);

        // Show loading
        modalBody.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <p>🔄 Loading project details...</p>
            </div>
        `;
        modal.style.display = 'block';

        // Fetch project details
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch project: ${response.status}`);
        }

        const project = await response.json();
        console.log('✅ Project details loaded:', project.title);

        // Create detailed project view
        const impactMetrics = project.impact_metrics ? project.impact_metrics.split(',').map(metric => metric.trim()) : [];
        const technologies = project.technologies ? project.technologies.split(',').map(tech => tech.trim()) : [];

        const techTags = technologies.map(tech => `<span class="tag">${tech}</span>`).join('');

        const impactList = impactMetrics.length > 0 ?
            impactMetrics.map(metric => {
                if (metric.includes(':')) {
                    const [key, value] = metric.split(':').map(s => s.trim());
                    return `<li><strong>${key}:</strong> ${value}</li>`;
                }
                return `<li><strong>Impact:</strong> ${metric}</li>`;
            }).join('') :
            '<li>No impact metrics available</li>';

        // Get image URL (same logic as cards)
        let imageUrl;
        if (project.cover_image_path) {
            imageUrl = project.cover_image_path.startsWith('http') ?
                project.cover_image_path :
                `http://localhost:3000/${project.cover_image_path}`;
        } else if (project.image_path) {
            imageUrl = project.image_path.startsWith('http') ?
                project.image_path :
                `http://localhost:3000/${project.image_path}`;
        } else {
            const defaultImages = {
                'Data Analytics': 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&auto=format&fit=crop',
                'Machine Learning': 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&auto=format&fit=crop',
                'Web Development': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop'
            };
            imageUrl = defaultImages[project.category] || defaultImages['Data Analytics'];
        }

        // Convert markdown description to HTML if it contains markdown
        const isMarkdown = project.full_description && (
            project.full_description.includes('##') ||
            project.full_description.includes('- ') ||
            project.full_description.includes('**') ||
            project.full_description.includes('`')
        );

        const formattedDescription = isMarkdown ?
            markdownToHTML(project.full_description) :
            (project.full_description || project.short_description || 'No detailed description available');

        // Process additional images (charts, visualizations)
        let additionalImagesHTML = '';
        if (project.additional_images_paths) {
            const imagePaths = project.additional_images_paths.split(',').map(path => path.trim()).filter(path => path);
            if (imagePaths.length > 0) {
                const imagesGrid = imagePaths.map(path => {
                    const fullPath = path.startsWith('http') ? path : `http://localhost:3000/${path}`;
                    return `<img src="${fullPath}" alt="Project visualization" class="additional-project-image" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">`;
                }).join('');

                additionalImagesHTML = `
                    <div class="project-modal-images">
                        <h3>📊 Charts & Visualizations</h3>
                        <div class="images-grid">
                            ${imagesGrid}
                        </div>
                    </div>
                `;
            }
        }

        // Process demo video
        let demoVideoHTML = '';
        if (project.demo_video_path) {
            const videoPath = project.demo_video_path.startsWith('http') ?
                project.demo_video_path :
                `http://localhost:3000/${project.demo_video_path}`;

            demoVideoHTML = `
                <div class="project-modal-video">
                    <h3>🎥 Demo Video</h3>
                    <video controls style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <source src="${videoPath}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
            `;
        }

        modalBody.innerHTML = `
            <div class="project-modal-content">
                <div class="project-modal-header">
                    <img src="${imageUrl}" alt="${project.title}" class="project-modal-image">
                    <div class="project-modal-info">
                        <h2>${project.title}</h2>
                        <div class="project-tags">
                            ${techTags}
                        </div>
                        <p class="project-category"><strong>Category:</strong> ${project.category}</p>
                    </div>
                </div>

                ${demoVideoHTML}

                <div class="project-modal-description">
                    <h3>📋 Project Overview</h3>
                    <div>${formattedDescription}</div>
                </div>

                ${additionalImagesHTML}

                <div class="project-modal-impact">
                    <h3>📈 Impact & Results</h3>
                    <ul>
                        ${impactList}
                    </ul>
                </div>

                ${project.live_demo_url ? `
                    <div class="project-modal-demo">
                        <h3>🎥 Live Demo</h3>
                        <p>View the live demonstration of this project:</p>
                        <a href="${project.live_demo_url}" target="_blank" class="btn-primary">
                            <i class="fas fa-external-link-alt"></i> Open Live Demo
                        </a>
                    </div>
                ` : ''}

                <div class="project-modal-links">
                    <h3>🔗 Project Links</h3>
                    <div class="modal-links-grid">
                        ${project.github_url ? `
                            <a href="${project.github_url}" target="_blank" class="btn-link">
                                <i class="fab fa-github"></i> View Source Code
                            </a>
                        ` : ''}
                        ${project.live_demo_url ? `
                            <a href="${project.live_demo_url}" target="_blank" class="btn-link">
                                <i class="fas fa-external-link-alt"></i> Live Demo
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

    } catch (error) {
        console.error('❌ Error loading project details:', error);
        modalBody.innerHTML = `
            <div class="project-modal-content">
                <h2>Error Loading Project</h2>
                <p>Sorry, there was an error loading the project details: ${error.message}</p>
                <button onclick="closeProjectModal()" class="btn-primary">Close</button>
            </div>
        `;
    }
}

// Close project modal
function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    modal.style.display = 'none';
}

// Setup modal event listeners
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.close');

    // Close modal when clicking X
    if (closeBtn) {
        closeBtn.onclick = closeProjectModal;
    }

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target === modal) {
            closeProjectModal();
        }
    };
});

// SIMPLIFIED: Always show Read More buttons - NO overflow detection
function checkTextOverflow() {
    console.log('🔍 SIMPLE: Making sure ALL Read More buttons are visible...');

    // Find ALL possible Read More buttons with different selectors
    const allButtons = document.querySelectorAll(`
        button[data-read-more="true"],
        button[onclick*="openProjectModal"],
        .project-links button,
        .btn-link[onclick*="openProjectModal"]
    `);

    console.log(`📋 Found ${allButtons.length} potential Read More buttons`);

    allButtons.forEach((button, index) => {
        // FORCE VISIBILITY - No conditions, no checks
        button.style.display = 'inline-flex !important';
        button.style.visibility = 'visible !important';
        button.style.opacity = '1 !important';
        button.style.position = 'relative !important';
        button.style.zIndex = '999 !important';
        
        // Also set CSS properties directly
        button.setAttribute('style', `
            display: inline-flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: relative !important;
            z-index: 999 !important;
            background: #2563eb !important;
            color: white !important;
            padding: 10px 20px !important;
            border: none !important;
            border-radius: 8px !important;
            text-decoration: none !important;
            font-size: 0.9rem !important;
            font-weight: 500 !important;
            transition: all 0.3s ease !important;
            cursor: pointer !important;
        `);
        
        console.log(`✅ FORCED visibility for button ${index + 1}`);
    });

    // Also check project cards and ensure they have buttons
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        const projectLinks = card.querySelector('.project-links');
        if (projectLinks) {
            projectLinks.style.display = 'flex !important';
            projectLinks.style.visibility = 'visible !important';
            projectLinks.style.opacity = '1 !important';
        }
        console.log(`✅ Project card ${index + 1} links container made visible`);
    });
}

// AGGRESSIVE: Multiple checks to force Read More buttons visible
function enhancedOverflowCheck() {
    console.log('🚀 AGGRESSIVE: Starting multiple Read More button visibility checks...');
    
    // Immediate check
    checkTextOverflow();
    forceShowAllReadMoreButtons();

    // Multiple retries at different intervals
    const intervals = [100, 300, 500, 1000, 1500, 2000, 3000, 5000];
    
    intervals.forEach((delay, index) => {
        setTimeout(() => {
            console.log(`🔄 Retry ${index + 1} at ${delay}ms - Forcing Read More buttons...`);
            checkTextOverflow();
            forceShowAllReadMoreButtons();
        }, delay);
    });

    // Set up interval to continuously check every 2 seconds
    setInterval(() => {
        console.log('🔄 Periodic check - Ensuring Read More buttons are still visible...');
        checkTextOverflow();
        forceShowAllReadMoreButtons();
    }, 2000);
}

// CRITICAL FIX: Force all Read More buttons to be visible
function forceShowAllReadMoreButtons() {
    console.log('🔧 FORCE: Ensuring ALL Read More buttons are visible...');
    
    // Find ALL Read More buttons with multiple selectors
    const readMoreSelectors = [
        'button[data-read-more="true"]',
        '.project-links button',
        'button[onclick*="openProjectModal"]',
        '.btn-link[onclick*="openProjectModal"]'
    ];

    let totalButtonsFound = 0;
    let totalButtonsFixed = 0;

    readMoreSelectors.forEach(selector => {
        const buttons = document.querySelectorAll(selector);
        console.log(`🔍 Found ${buttons.length} buttons with selector: ${selector}`);
        
        buttons.forEach((button, index) => {
            totalButtonsFound++;
            
            // Force visibility with multiple CSS properties
            button.style.display = 'inline-flex';
            button.style.visibility = 'visible';
            button.style.opacity = '1';
            button.style.position = 'relative';
            button.style.zIndex = '10';
            
            // Remove any hidden classes
            button.classList.remove('hidden', 'invisible');
            
            // Ensure parent containers are also visible
            let parent = button.parentElement;
            while (parent && parent.classList.contains('project-links')) {
                parent.style.display = 'flex';
                parent.style.visibility = 'visible';
                parent = parent.parentElement;
            }
            
            totalButtonsFixed++;
            console.log(`✅ Fixed Read More button ${index + 1} with selector ${selector}`);
        });
    });

    console.log(`🎯 SUMMARY: Found ${totalButtonsFound} buttons, fixed ${totalButtonsFixed} buttons`);
    
    // SPECIAL FIX: Check for specific problem project (Weather Energy Analysis)
    const projectCards = document.querySelectorAll('.project-card');
    console.log(`📋 Total project cards found: ${projectCards.length}`);
    
    projectCards.forEach((card, index) => {
        const projectTitle = card.querySelector('h3');
        const projectTitleText = projectTitle ? projectTitle.textContent.trim() : '';
        
        console.log(`🔍 Checking card ${index + 1}: "${projectTitleText}"`);
        
        // Special check for Weather Energy project
        if (projectTitleText.includes('Weather-Driven Energy') || 
            projectTitleText.includes('Australian Energy Market')) {
            console.log(`🎯 FOUND PROBLEM PROJECT: "${projectTitleText}"`);
            fixSpecificProjectCard(card, index + 1, 'Weather-Driven Energy Project');
        }
        
        const hasReadMore = card.querySelector('button[data-read-more="true"], button[onclick*="openProjectModal"]');
        if (!hasReadMore) {
            console.warn(`⚠️ Project card ${index + 1} "${projectTitleText}" is missing Read More button! FIXING...`);
            createMissingReadMoreButton(card, index + 1);
        } else {
            console.log(`✅ Project card ${index + 1} "${projectTitleText}" has Read More button`);
        }
    });
}

// SPECIAL FIX: Fix specific project card that's problematic
function fixSpecificProjectCard(card, cardIndex, projectName) {
    console.log(`🔧 SPECIAL FIX for ${projectName} (card ${cardIndex})`);
    
    const projectLinks = card.querySelector('.project-links');
    if (projectLinks) {
        // Force the container to be visible
        projectLinks.style.display = 'flex !important';
        projectLinks.style.visibility = 'visible !important';
        projectLinks.style.opacity = '1 !important';
        projectLinks.style.minHeight = '50px !important';
        
        // Find all buttons in this specific card
        const buttons = projectLinks.querySelectorAll('button, .btn-link');
        console.log(`🔍 Found ${buttons.length} buttons in ${projectName}`);
        
        buttons.forEach((btn, btnIndex) => {
            // Ultra force visibility
            btn.style.cssText = `
                display: inline-flex !important;
                visibility: visible !important;
                opacity: 1 !important;
                position: relative !important;
                z-index: 9999 !important;
                background: #2563eb !important;
                color: white !important;
                padding: 10px 20px !important;
                border: none !important;
                border-radius: 8px !important;
                text-decoration: none !important;
                font-size: 0.9rem !important;
                font-weight: 500 !important;
                cursor: pointer !important;
                margin: 5px !important;
            `;
            console.log(`✅ ULTRA-FIXED button ${btnIndex + 1} in ${projectName}`);
        });
    } else {
        console.warn(`⚠️ No .project-links found in ${projectName} - creating one...`);
        createMissingReadMoreButton(card, cardIndex);
    }
}

// EMERGENCY FIX: Create missing Read More button
function createMissingReadMoreButton(card, cardIndex) {
    console.log(`🆘 EMERGENCY: Creating missing Read More button for card ${cardIndex}`);
    
    let projectLinks = card.querySelector('.project-links');
    
    if (!projectLinks) {
        // Create the project-links container
        projectLinks = document.createElement('div');
        projectLinks.className = 'project-links';
        projectLinks.style.cssText = `
            display: flex !important;
            gap: 1rem !important;
            margin-top: auto !important;
            visibility: visible !important;
            opacity: 1 !important;
        `;
        
        const projectContent = card.querySelector('.project-content');
        if (projectContent) {
            projectContent.appendChild(projectLinks);
        }
    }
    
    // Create the Read More button
    const readMoreBtn = document.createElement('button');
    readMoreBtn.setAttribute('data-read-more', 'true');
    
    // Try to get the actual project ID from the card data or use cardIndex as fallback
    const projectTitle = card.querySelector('h3');
    const projectTitleText = projectTitle ? projectTitle.textContent.trim() : '';
    
    // For Weather Energy project, try to find its actual ID or use a recognizable identifier
    let projectId = cardIndex;
    if (projectTitleText.includes('Weather-Driven Energy') || projectTitleText.includes('Australian Energy Market')) {
        projectId = 'weather-energy-project'; // Use a string ID for special handling
    }
    
    readMoreBtn.setAttribute('onclick', `openProjectModal('${projectId}')`);
    readMoreBtn.className = 'btn-link';
    readMoreBtn.innerHTML = '<i class="fas fa-info-circle"></i> Read More';
    
    // Ultra force styling
    readMoreBtn.style.cssText = `
        display: inline-flex !important;
        visibility: visible !important;
        opacity: 1 !important;
        position: relative !important;
        z-index: 9999 !important;
        background: #2563eb !important;
        color: white !important;
        padding: 10px 20px !important;
        border: none !important;
        border-radius: 8px !important;
        text-decoration: none !important;
        font-size: 0.9rem !important;
        font-weight: 500 !important;
        cursor: pointer !important;
        align-items: center !important;
        gap: 0.5rem !important;
    `;
    
    projectLinks.appendChild(readMoreBtn);
    console.log(`✅ EMERGENCY FIX: Created Read More button for card ${cardIndex}`);
}

// DEBUG HELPER: Manual fix for Weather Energy project
function debugWeatherEnergyProject() {
    console.log('🔧 DEBUG: Manually fixing Weather Energy project...');
    
    const projectCards = document.querySelectorAll('.project-card');
    let weatherCard = null;
    let weatherCardIndex = -1;
    
    projectCards.forEach((card, index) => {
        const projectTitle = card.querySelector('h3');
        const projectTitleText = projectTitle ? projectTitle.textContent.trim() : '';
        
        if (projectTitleText.includes('Weather-Driven Energy') || 
            projectTitleText.includes('Australian Energy Market')) {
            weatherCard = card;
            weatherCardIndex = index;
            console.log(`🎯 FOUND Weather Energy project at index ${index}: "${projectTitleText}"`);
        }
    });
    
    if (weatherCard) {
        console.log('🔧 Applying special fix to Weather Energy project...');
        fixSpecificProjectCard(weatherCard, weatherCardIndex + 1, 'Weather-Driven Energy Project');
        
        // Double-check by also running the missing button creation
        const hasReadMore = weatherCard.querySelector('button[data-read-more="true"], button[onclick*="openProjectModal"]');
        if (!hasReadMore) {
            console.log('🆘 Still no Read More button - creating emergency button...');
            createMissingReadMoreButton(weatherCard, weatherCardIndex + 1);
        }
        
        console.log('✅ Weather Energy project fix completed!');
        return weatherCard;
    } else {
        console.error('❌ Weather Energy project not found!');
        return null;
    }
}

// Make functions global
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;
window.checkTextOverflow = checkTextOverflow;
window.enhancedOverflowCheck = enhancedOverflowCheck;
window.forceShowAllReadMoreButtons = forceShowAllReadMoreButtons;
window.fixSpecificProjectCard = fixSpecificProjectCard;
window.createMissingReadMoreButton = createMissingReadMoreButton;
window.debugWeatherEnergyProject = debugWeatherEnergyProject;