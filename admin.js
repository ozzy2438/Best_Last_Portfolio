const API_BASE_URL = 'https://best-last-portfolio.onrender.com/api';

// Simple markdown to HTML converter for README copy-paste
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

// Setup markdown preview functionality and character counter
document.addEventListener('DOMContentLoaded', function() {
    const previewBtn = document.getElementById('preview-btn');
    const descriptionTextarea = document.getElementById('full_description');
    const previewArea = document.getElementById('description-preview');

    // Setup character counter for short description
    const shortDescTextarea = document.getElementById('short_description');
    const charCountSpan = document.getElementById('short-desc-count');

    if (shortDescTextarea && charCountSpan) {
        // Update character count
        function updateCharCount() {
            const length = shortDescTextarea.value.length;
            charCountSpan.textContent = length;

            // Change color based on length
            if (length > 1000) {
                charCountSpan.style.color = '#dc3545'; // Red
                charCountSpan.style.fontWeight = 'bold';
            } else if (length > 800) {
                charCountSpan.style.color = '#ffc107'; // Yellow
                charCountSpan.style.fontWeight = 'normal';
            } else {
                charCountSpan.style.color = '#666'; // Gray
                charCountSpan.style.fontWeight = 'normal';
            }
        }

        // Initial count
        updateCharCount();

        // Update on input
        shortDescTextarea.addEventListener('input', updateCharCount);
    }

    if (previewBtn && descriptionTextarea && previewArea) {
        let isPreviewVisible = false;

        previewBtn.addEventListener('click', function() {
            if (!isPreviewVisible) {
                // Show preview
                const markdownText = descriptionTextarea.value;
                const htmlContent = markdownToHTML(markdownText);

                previewArea.innerHTML = htmlContent || '<p><em>No content to preview</em></p>';
                previewArea.style.display = 'block';
                previewBtn.textContent = '📝 Edit';
                isPreviewVisible = true;
            } else {
                // Hide preview
                previewArea.style.display = 'none';
                previewBtn.textContent = '👁️ Preview';
                isPreviewVisible = false;
            }
        });

        // Auto-preview on input (debounced)
        let timeoutId;
        descriptionTextarea.addEventListener('input', function() {
            if (isPreviewVisible) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    const markdownText = descriptionTextarea.value;
                    const htmlContent = markdownToHTML(markdownText);
                    previewArea.innerHTML = htmlContent || '<p><em>No content to preview</em></p>';
                }, 500);
            }
        });
    }
});

function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alert-container');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    alertContainer.innerHTML = '';
    alertContainer.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 5000);
}

function updateFileLabel(input) {
    const label = input.nextElementSibling;
    if (input.files.length > 0) {
        if (input.files.length === 1) {
            label.textContent = `✅ ${input.files[0].name}`;
        } else {
            label.textContent = `✅ ${input.files.length} files selected`;
        }
        label.style.color = 'var(--accent-color)';
    }
}

let editingProjectId = null;

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('projectForm');
    const coverImageInput = document.getElementById('cover_image');
    const additionalImagesInput = document.getElementById('additional_images');
    const videoInput = document.getElementById('demo_video');

    coverImageInput.addEventListener('change', () => updateFileLabel(coverImageInput));
    additionalImagesInput.addEventListener('change', () => updateFileLabel(additionalImagesInput));
    videoInput.addEventListener('change', () => updateFileLabel(videoInput));

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitBtn = document.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = editingProjectId ? 'Updating Project...' : 'Adding Project...';

        // Validate cover image only for new projects
        const coverImageInput = document.getElementById('cover_image');
        if (!editingProjectId && !coverImageInput.files.length) {
            showAlert('Please upload a cover image for new projects', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            return;
        }

        try {
            const formData = new FormData(form);
            console.log('Form data being sent:', Array.from(formData.entries()));

            const url = editingProjectId ?
                `${API_BASE_URL}/projects/${editingProjectId}` :
                `${API_BASE_URL}/projects`;
            const method = editingProjectId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                const message = editingProjectId ? 'Project updated successfully!' : 'Project added successfully!';
                showAlert(message, 'success');

                // Reset form and editing state
                form.reset();
                editingProjectId = null;
                submitBtn.textContent = 'Add Project';

                // Reset file labels
                document.querySelector('label[for="cover_image"]').textContent = '📸 Choose cover photo (required)';
                document.querySelector('label[for="additional_images"]').textContent = '🖼️ Choose additional images (optional)';
                document.querySelector('label[for="demo_video"]').textContent = '🎥 Choose demo video (optional)';

                loadProjects();
            } else {
                const error = await response.json();
                showAlert(`Error: ${error.error}`, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('Failed to save project. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = editingProjectId ? 'Update Project' : 'Add Project';
        }
    });

    loadProjects();
});

async function loadProjects() {
    const container = document.getElementById('projects-container');

    try {
        const response = await fetch(`${API_BASE_URL}/projects`);

        if (response.ok) {
            const projects = await response.json();

            if (projects.length === 0) {
                container.innerHTML = '<p class="loading">No projects found. Add your first project above!</p>';
                return;
            }

            container.innerHTML = projects.map(project => `
                <div class="project-item">
                    <div class="project-info">
                        <h3>${project.title}</h3>
                        <p>${project.short_description || 'No description'}</p>
                        <p><strong>Category:</strong> ${project.category || 'Uncategorized'} | <strong>Status:</strong> ${project.status}</p>
                        <p><small>Created: ${new Date(project.created_date).toLocaleDateString()}</small></p>
                    </div>
                    <div class="project-actions">
                        <button class="btn-small btn-edit" onclick="editProject(${project.id})">Edit</button>
                        <button class="btn-small btn-delete" onclick="deleteProject(${project.id}, '${project.title}')">Delete</button>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p class="loading">Failed to load projects.</p>';
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        container.innerHTML = '<p class="loading">Error loading projects. Make sure the server is running.</p>';
    }
}

async function deleteProject(id, title) {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showAlert('Project deleted successfully!', 'success');
            loadProjects();
        } else {
            showAlert('Failed to delete project.', 'error');
        }
    } catch (error) {
        console.error('Error deleting project:', error);
        showAlert('Failed to delete project. Please try again.', 'error');
    }
}

async function editProject(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/projects/${id}`);
        if (response.ok) {
            const project = await response.json();

            // Fill form with project data
            document.getElementById('title').value = project.title || '';
            document.getElementById('short_description').value = project.short_description || '';
            document.getElementById('full_description').value = project.full_description || '';
            document.getElementById('technologies').value = project.technologies || '';
            document.getElementById('category').value = project.category || '';
            document.getElementById('github_url').value = project.github_url || '';
            document.getElementById('live_demo_url').value = project.live_demo_url || '';
            document.getElementById('impact_metrics').value = project.impact_metrics || '';

            // Show current file paths with instructions
            const coverImageLabel = document.querySelector('label[for="cover_image"]');
            const additionalImagesLabel = document.querySelector('label[for="additional_images"]');
            const videoLabel = document.querySelector('label[for="demo_video"]');

            if (project.cover_image_path) {
                coverImageLabel.innerHTML = `✅ Current: ${project.cover_image_path.split('/').pop()}<br><small>Leave empty to keep current</small>`;
            }

            if (project.additional_images_paths) {
                const imgCount = project.additional_images_paths.split(',').length;
                additionalImagesLabel.innerHTML = `✅ Current: ${imgCount} image(s)<br><small>Leave empty to keep current</small>`;
            }

            if (project.demo_video_path) {
                videoLabel.innerHTML = `✅ Current: ${project.demo_video_path.split('/').pop()}<br><small>Leave empty to keep current</small>`;
            }

            // Set editing state
            editingProjectId = id;
            document.querySelector('.btn-submit').textContent = 'Update Project';

            // Scroll to form
            document.getElementById('projectForm').scrollIntoView({ behavior: 'smooth' });

            showAlert('Project loaded for editing. Leave file fields empty to keep current files.', 'success');
        } else {
            showAlert('Failed to load project for editing.', 'error');
        }
    } catch (error) {
        console.error('Error loading project:', error);
        showAlert('Failed to load project for editing.', 'error');
    }
}