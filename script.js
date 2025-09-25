// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Project details modal functionality
const modal = document.getElementById('project-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.querySelector('.close');
const readMoreBtns = document.querySelectorAll('.read-more-btn');

// Project details data
const projectDetails = {
    'manchester-city': {
        title: 'Manchester City WSL Championship Analytics',
        content: `
            <div class="video-demo-section">
                <h3>🎥 Project Video Demo</h3>
                <div class="video-container">
                    <iframe src="https://www.canva.com/design/DAGzxo8J3VM/4UN-WJI8tbTppTjsJeVMiw/watch?embed" allowfullscreen></iframe>
                </div>
                <p class="video-caption">3-Minute Executive Overview - Complete methodology and business impact demonstration</p>
            </div>

            <h2>Project Overview</h2>
            <p><strong>Critical challenge solved:</strong> Converting £2.5M transfer budget into measurable competitive advantage for Manchester City Women's championship pursuit through advanced predictive analytics.</p>
            
            <h3>📊 Dashboard Overview</h3>
            <div class="dashboard-gallery">
                <div class="dashboard-row">
                    <img src="https://github.com/ozzy2438/MoneyBall-Manchester-City/blob/451ac6a51f3aeb58f1c9458dfe23ae1e63a6567a/4-b28e25c6.jpg?raw=1" alt="Club Overview Dashboard" style="width: 48%; margin-right: 2%;">
                    <img src="https://github.com/ozzy2438/MoneyBall-Manchester-City/blob/451ac6a51f3aeb58f1c9458dfe23ae1e63a6567a/4-30d6399c.jpg?raw=1" alt="Transfer Decisions Dashboard" style="width: 48%;">
                </div>
                <p><em>Club Overview (budget analysis, PPG vs GA/90, season trends) and Transfer Decisions (value map + shortlist table)</em></p>
            </div>

            <h3>🎯 Key Achievements</h3>
            <ul>
                <li><strong>Championship Probability:</strong> Increased from 5.2% to 79.7% (achievable with recommended changes)</li>
                <li><strong>Points Improvement:</strong> +8.5 league points through strategic transfers</li>
                <li><strong>Budget Optimization:</strong> 47% improvement in points-per-£ efficiency</li>
                <li><strong>Squad Utilization:</strong> 1,800 minutes freed through 5 strategic player releases</li>
            </ul>

            <h3>📈 Detailed Analytics Dashboards</h3>
            <div class="dashboard-gallery">
                <div class="dashboard-row">
                    <img src="https://github.com/ozzy2438/MoneyBall-Manchester-City/blob/e344efec2f8309d91ae3ca1b686f7322db9b267b/3-b28e25c6.jpg?raw=1" alt="KPI Analysis" style="width: 48%; margin-right: 2%;">
                    <img src="https://github.com/ozzy2438/MoneyBall-Manchester-City/blob/1b95a1eea76d71ae4be2c0a3a473739603f04b70/2-b28e25c6.jpg?raw=1" alt="Performance Metrics" style="width: 48%;">
                </div>
                <div class="dashboard-row" style="margin-top: 1rem;">
                    <img src="https://github.com/ozzy2438/MoneyBall-Manchester-City/blob/451ac6a51f3aeb58f1c9458dfe23ae1e63a6567a/3-30d6399c.jpg?raw=1" alt="Player Priority Analysis" style="width: 48%; margin-right: 2%;">
                    <img src="https://github.com/ozzy2438/MoneyBall-Manchester-City/blob/e344efec2f8309d91ae3ca1b686f7322db9b267b/1-b28e25c6.jpg?raw=1" alt="Player Matrix" style="width: 48%;">
                </div>
                <p><em>KPI analysis, performance metrics, player priority rankings, and comprehensive player matrix by season</em></p>
            </div>

            <h3>📊 Methodology</h3>
            <ul>
                <li><strong>SQL Data Models:</strong> Complex CTEs and window functions for league calibration</li>
                <li><strong>Python Analysis:</strong> RandomForest and GradientBoosting for performance prediction</li>
                <li><strong>Power BI Dashboard:</strong> Interactive visualizations for executive decision-making</li>
            </ul>

            <h3>🔗 Key Links</h3>
            <ul>
                <li><a href="https://www.canva.com/design/DAGzxo8J3VM/4UN-WJI8tbTppTjsJeVMiw/edit" target="_blank">📺 3-Minute Executive Overview Video</a></li>
                <li><a href="https://github.com/ozzy2438/MoneyBall-Manchester-City" target="_blank">💻 GitHub Repository</a></li>
                <li><a href="https://fbref.com/en/" target="_blank">📈 Data Source (FBref)</a></li>
            </ul>

            <h3>💡 Business Impact</h3>
            <p>This analysis addresses the critical challenge faced by football clubs: maximizing competitive advantage from limited transfer budgets through data-driven decision making. The methodology can be applied to any sports team looking to optimize player recruitment strategies.</p>
        `
    },
    'energy-forecast': {
        title: 'Energy Operations Forecast Platform',
        content: `
            <div class="video-demo-section">
                <h3>🎥 Live Platform Demo</h3>
                <div class="video-container">
                    <iframe src="https://www.canva.com/design/DAGzxJJLMEc/YlcBw7gUbsZXJF7ZRqudXA/watch?embed" allowfullscreen></iframe>
                </div>
                <p class="video-caption">2-Minute Interactive Dashboard Walkthrough - Energy market forecasting and trading insights</p>
            </div>

            <h2>Project Overview</h2>
            <p><strong>Advanced Energy Market Forecasting Platform:</strong> End-to-end energy market intelligence platform that automates forecasting for power trading operations, enabling teams to predict price volatility and demand fluctuations with 95%+ reliability.</p>
            
            <h3>💰 Business Impact</h3>
            <ul>
                <li><strong>Annual Profits:</strong> $500K-$5M through optimized hedging & arbitrage</li>
                <li><strong>Forecast Accuracy:</strong> 95%+ with scenario modeling (baseline, shock, delta)</li>
                <li><strong>Automation:</strong> Reduced manual work from 8-10 hours/week to 30 minutes</li>
                <li><strong>Risk Management:</strong> Proactive trading vs reactive losses of $50-120/MWh</li>
            </ul>

            <h3>⚡ Key Features</h3>
            <ul>
                <li><strong>Real-time Dashboards:</strong> Executive dashboards for data-driven decision-making</li>
                <li><strong>Automated Reports:</strong> Email reports with cron scheduling</li>
                <li><strong>Scenario Analysis:</strong> Baseline, shock, and delta modeling</li>
                <li><strong>Regional Analysis:</strong> Multi-zone price differential tracking</li>
            </ul>

            <h3>🛠️ Technical Stack</h3>
            <ul>
                <li><strong>Backend:</strong> Python, Pandas, NumPy for data processing</li>
                <li><strong>Frontend:</strong> Streamlit with OAuth2 authentication</li>
                <li><strong>Visualization:</strong> Plotly for interactive charts</li>
                <li><strong>Automation:</strong> Cron jobs and SMTP integration</li>
            </ul>

            <h3>🔗 Links & Resources</h3>
            <ul>
                <li><a href="https://www.canva.com/design/DAGzxJJLMEc/YlcBw7gUbsZXJF7ZRqudXA/edit" target="_blank">🎥 Live Demo Walkthrough (2 minutes)</a></li>
                <li><a href="https://github.com/ozzy2438/Energy-Operations-Forecast" target="_blank">💻 GitHub Repository</a></li>
            </ul>

            <h3>📈 Market Analysis Results</h3>
            <p><strong>Price Volatility:</strong> Shock scenarios show 2.5x higher volatility with up to 300% price increases during extreme weather events.</p>
            <p><strong>Regional Arbitrage:</strong> Average price differences of $8-15/MWh between zones, with peak congestion spreads reaching $45/MWh.</p>
        `
    },
    'weather-energy': {
        title: 'Weather-Driven Energy Demand Analysis',
        content: `
            <div class="video-demo-section">
                <h3>🎥 Weather Energy Analysis Demo</h3>
                <div class="video-container">
                    <iframe src="https://www.canva.com/design/DAGz8viPYlM/Vw4Jbiq0ytMKiNwHjXuQug/watch?embed" allowfullscreen></iframe>
                </div>
                <p class="video-caption">Weather correlation analysis & risk modeling demonstration - Australian energy market insights</p>
            </div>

            <h2>Project Overview</h2>
            <p><strong>Australian Energy Market Analysis:</strong> Comprehensive analysis identifying weather-driven correlations across 9,000+ trading intervals, enabling $8-12M annual portfolio optimization through strategic load shifting and risk hedging.</p>
            
            <h3>📊 Dashboard Gallery</h3>
            <div class="dashboard-gallery">
                <div class="dashboard-row">
                    <img src="https://github.com/ozzy2438/energy_weather_dashboard/blob/main/dashboard_images/Image%2023-9-2025%20at%201.55%E2%80%AFPM%20(1).jpg?raw=true" alt="Main KPI Dashboard" style="width: 48%; margin-right: 2%;">
                    <img src="https://github.com/ozzy2438/energy_weather_dashboard/blob/main/dashboard_images/Image%2023-9-2025%20at%201.55%E2%80%AFPM.jpg?raw=true" alt="Weather Impact Analysis" style="width: 48%;">
                </div>
                <p><em>Executive KPI Dashboard and Weather Impact Analysis - showing key performance indicators and temperature-demand correlations</em></p>
            </div>

            <h3>🎯 Key Achievements</h3>
            <ul>
                <li><strong>Business Impact:</strong> Improved customer retention by 15% using Excel KPI dashboard</li>
                <li><strong>Portfolio Optimization:</strong> $8-12M annual savings through load shifting strategies</li>
                <li><strong>Risk Reduction:</strong> 35% exposure reduction during compound weather events</li>
                <li><strong>Accuracy:</strong> Temperature correlation >0.6 with demand during peak periods</li>
            </ul>

            <h3>📈 Risk & Optimization Dashboards</h3>
            <div class="dashboard-gallery">
                <div class="dashboard-row">
                    <img src="https://github.com/ozzy2438/energy_weather_dashboard/blob/main/dashboard_images/Image%2023-9-2025%20at%201.56%E2%80%AFPM.jpg?raw=true" alt="Portfolio Risk Assessment" style="width: 48%; margin-right: 2%;">
                    <img src="https://github.com/ozzy2438/energy_weather_dashboard/blob/main/dashboard_images/Image%2023-9-2025%20at%201.56%E2%80%AFPM%202.jpg?raw=true" alt="Demand Response Optimization" style="width: 48%;">
                </div>
                <div class="dashboard-row" style="margin-top: 1rem;">
                    <img src="https://github.com/ozzy2438/energy_weather_dashboard/blob/main/dashboard_images/Image%2023-9-2025%20at%201.57%E2%80%AFPM.jpg?raw=true" alt="Regional Performance Analysis" style="width: 48%; margin-right: 2%;">
                    <img src="https://github.com/ozzy2438/energy_weather_dashboard/blob/main/dashboard_images/Image%2023-9-2025%20at%202.02%E2%80%AFPM.jpg?raw=true" alt="Financial Impact Calculator" style="width: 48%;">
                </div>
                <p><em>Portfolio risk assessment, demand response optimization, regional performance analysis, and financial impact calculations</em></p>
            </div>

            <h3>🔬 Research Methodology</h3>
            <ul>
                <li><strong>Time Series Analysis:</strong> Correlation and regression modeling of weather variables</li>
                <li><strong>Feature Engineering:</strong> Compound risk indicators combining temperature, solar, and peak timing</li>
                <li><strong>Scenario Modeling:</strong> Baseline vs shock event simulations</li>
                <li><strong>Statistical Testing:</strong> Pearson correlation across regional markets</li>
            </ul>

            <h3>🔗 Project Resources</h3>
            <ul>
                <li><a href="https://github.com/ozzy2438/energy_weather_price_forecast" target="_blank">💻 GitHub Repository</a></li>
                <li><a href="https://www.aemo.com.au/" target="_blank">📊 AEMO Market Data Source</a></li>
            </ul>

            <h3>💡 Key Insights</h3>
            <p><strong>Temperature Impact:</strong> +1.8% demand increase per +1°C temperature rise (strongest correlation: 0.65)</p>
            <p><strong>Solar Displacement:</strong> 15% peak demand reduction during high solar generation periods</p>
            <p><strong>Compound Events:</strong> Occur in 8% of intervals but cause 65% of price spikes (>$100/MWh)</p>
        `
    },
    'business-usa': {
        title: 'Business Readiness USA - County Expansion Analytics',
        content: `
            <div class="video-demo-section">
                <h3>🎥 Business Analytics Deep Dive</h3>
                <div class="video-container">
                    <iframe src="https://www.canva.com/design/DAGz8viPYlM/Vw4Jbiq0ytMKiNwHjXuQug/watch?embed" allowfullscreen></iframe>
                </div>
                <p class="video-caption">County ranking methodology & expansion strategy demonstration - US business readiness analysis</p>
            </div>

            <h2>Project Overview</h2>
            <p><strong>Comprehensive US County Analysis:</strong> Ranking system for 3,181 US counties using growth, structure, and specialization signals to support strategic business expansion planning with transparent "Opportunity Score" methodology.</p>
            
            <h3>📊 Dashboard Gallery</h3>
            <div class="dashboard-gallery">
                <div class="dashboard-row">
                    <img src="https://raw.githubusercontent.com/ozzy2438/Business_Analysis_USA/main/screenshots/business_readiness_overview_dashboard.jpg" alt="Business Readiness Overview Dashboard" style="width: 100%;">
                </div>
                <p><em>Business Readiness Overview Dashboard - showing county rankings, opportunity scores, and growth metrics across the United States</em></p>
            </div>

            <h3>📊 Analysis Scope</h3>
            <ul>
                <li><strong>Geographic Coverage:</strong> All 3,181 US counties analyzed and ranked</li>
                <li><strong>Data Sources:</strong> County Business Patterns (CBP) 2020-2023 + Census population data</li>
                <li><strong>Tiering System:</strong> Clear A/B/C/D opportunity tier classification</li>
                <li><strong>Growth Analysis:</strong> 4.9% average establishment growth identification</li>
            </ul>

            <h3>📈 Detailed Analysis Dashboards</h3>
            <div class="dashboard-gallery">
                <div class="dashboard-row">
                    <img src="https://raw.githubusercontent.com/ozzy2438/Business_Analysis_USA/main/screenshots/county_rankings_opportunity_analysis.jpg" alt="County Rankings & Opportunity Analysis" style="width: 48%; margin-right: 2%;">
                    <img src="https://raw.githubusercontent.com/ozzy2438/Business_Analysis_USA/main/screenshots/industry_growth_distribution_analysis.jpg" alt="Industry Growth Distribution Analysis" style="width: 48%;">
                </div>
                <p><em>County rankings with opportunity analysis and industry growth distribution patterns across different sectors</em></p>
            </div>

            <h3>🎯 Key Findings</h3>
            <ul>
                <li><strong>Growth Dynamics:</strong> Mean establishment growth 4.9% (median 3.7%)</li>
                <li><strong>Employment Growth:</strong> Mean 6.0% (median 3.0%) across analyzed counties</li>
                <li><strong>Industry Specialization:</strong> Retail/Services lead at 83.1% coverage</li>
                <li><strong>Multi-specialization:</strong> 2,540 counties show specialization in ≥2 industry buckets</li>
            </ul>

            <h3>🛠️ Technical Implementation</h3>
            <ul>
                <li><strong>Data Engineering:</strong> Type-safe ingestion with FIPS normalization</li>
                <li><strong>Location Quotients:</strong> County share/US share analysis with outlier capping</li>
                <li><strong>Diversity Scoring:</strong> HHI-based industry mix analysis</li>
                <li><strong>K-means Clustering:</strong> 5-cluster economic type profiling</li>
            </ul>

            <h3>🔗 Resources & Data</h3>
            <ul>
                <li><a href="https://github.com/ozzy2438/Business_Analysis_USA" target="_blank">💻 GitHub Repository</a></li>
                <li><a href="https://drive.google.com/drive/folders/1dgOh9Ek3PHLVu7hQ_Kt7hpJ7LANWfHvU" target="_blank">📊 Dataset (Google Drive)</a></li>
                <li><a href="https://www.census.gov/programs-surveys/cbp.html" target="_blank">📈 County Business Patterns Source</a></li>
            </ul>

            <h3>💼 Business Applications</h3>
            <p><strong>Strategic Planning:</strong> Enables data-driven expansion decisions by identifying counties with optimal growth potential, industry diversity, and specialization advantages.</p>
            <p><strong>Risk Assessment:</strong> Balanced approach considering both high-growth opportunities and market stability factors.</p>
        `
    }
};

// Event listeners for read more buttons
readMoreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const projectId = btn.dataset.project;
        const project = projectDetails[projectId];
        
        if (project) {
            modalBody.innerHTML = `
                <h1>${project.title}</h1>
                ${project.content}
            `;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    });
});

// Close modal functionality
if (closeModal) {
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.project-card, .skill-category, .stat-card, .contact-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 80);
        }, 500);
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image');
    
    if (heroImage) {
        const speed = scrolled * 0.3;
        heroImage.style.transform = `translateY(${speed}px)`;
    }
});

// Add active navigation highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Mobile menu styles
const mobileMenuStyles = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            left: -100%;
            top: 70px;
            flex-direction: column;
            background-color: white;
            width: 100%;
            text-align: center;
            transition: 0.3s;
            box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
            padding: 2rem 0;
        }

        .nav-menu.active {
            left: 0;
        }

        .nav-link {
            padding: 1rem;
            display: block;
            font-size: 1.1rem;
        }

        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }

        .hamburger.active span:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }

        .hamburger.active span:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }

        .nav-link.active {
            color: #2563eb;
            font-weight: 600;
        }
    }
`;

// Add mobile menu styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileMenuStyles;
document.head.appendChild(styleSheet);
