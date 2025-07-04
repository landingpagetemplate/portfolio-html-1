// Translation system
let currentLanguage = 'en';
let translations = {};

// Load translations
async function loadTranslations(lang) {
    try {
        const response = await fetch(`/data/${lang}.json`);
        translations[lang] = await response.json();
    } catch (error) {
        console.error(`Error loading ${lang} translations:`, error);
    }
}

// Translation function
function t(key) {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
        if (value && value[k]) {
            value = value[k];
        } else {
            return key; // Return key if translation not found
        }
    }
    
    return value;
}

// Update page content
function updateContent() {
    // Update meta tags
    document.title = t('meta.title');
    document.querySelector('meta[name="description"]').setAttribute('content', t('meta.description'));
    
    // Update header
    document.getElementById('name').textContent = t('header.name');
    document.getElementById('lastname').textContent = t('header.lastname');
    document.getElementById('tagline').textContent = t('header.tagline');
    document.getElementById('cta').textContent = t('header.cta');
    
    // Update about section
    document.getElementById('about-title').textContent = t('about.title');
    document.getElementById('about-content').textContent = t('about.content');
    
    // Update skills
    const skillsContainer = document.getElementById('skills');
    skillsContainer.innerHTML = '';
    t('about.skills').forEach(skill => {
        const skillElement = document.createElement('span');
        skillElement.className = 'skill';
        skillElement.textContent = skill;
        skillsContainer.appendChild(skillElement);
    });
    
    // Update projects
    const projectsContainer = document.getElementById('projects');
    projectsContainer.innerHTML = '';
    t('projects').forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.className = 'project';
        projectElement.innerHTML = `
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="tags">
                ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        `;
        projectsContainer.appendChild(projectElement);
    });
    
    // Update contact section
    document.getElementById('contact-title').textContent = t('contact.title');
    document.getElementById('contact-email').textContent = t('contact.email');
    
    // Update social links
    const socialContainer = document.getElementById('social-links');
    socialContainer.innerHTML = '';
    t('contact.social').forEach(social => {
        const linkElement = document.createElement('a');
        linkElement.href = social.url;
        linkElement.textContent = social.name;
        linkElement.className = 'social-link';
        socialContainer.appendChild(linkElement);
    });
}

// Language detection
async function detectLanguage() {
    try {
        // Try to detect user's country using ipapi.co
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.country_code === 'BR') {
            return 'pt';
        }
    } catch (error) {
        console.log('Could not detect location, using browser language');
    }
    
    // Fallback to browser language
    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang.startsWith('pt') ? 'pt' : 'en';
}

// Change language
async function changeLanguage(lang) {
    if (!translations[lang]) {
        await loadTranslations(lang);
    }
    currentLanguage = lang;
    updateContent();
    
    // Update language selector
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-lang="${lang}"]`).classList.add('active');
    
    // Save preference
    localStorage.setItem('preferred-language', lang);
}

// Initialize
async function init() {
    // Load both languages
    await Promise.all([
        loadTranslations('en'),
        loadTranslations('pt')
    ]);
    
    // Detect or get saved language
    const savedLang = localStorage.getItem('preferred-language');
    const detectedLang = savedLang || await detectLanguage();
    
    // Set initial language
    await changeLanguage(detectedLang);
    
    // Add event listeners
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            changeLanguage(btn.dataset.lang);
        });
    });
}

// Start when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 