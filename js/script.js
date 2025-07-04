// Language management
let currentLanguage = 'pt';
let translations = {};

// Detect user's country and set default language
async function detectUserLanguage() {
  try {
    // Try to get country from IP geolocation
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    if (data.country_code === 'BR') {
      return 'pt';
    } else {
      return 'en';
    }
  } catch (error) {
    console.log('Could not detect location, using default language');
    // Fallback to browser language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('pt')) {
      return 'pt';
    } else {
      return 'en';
    }
  }
}

// Load translations
async function loadTranslations(language) {
  try {
    const response = await fetch(`data/${language}.json`);
    const data = await response.json();
    translations = data;
    return data;
  } catch (error) {
    console.error('Error loading translations:', error);
    return null;
  }
}

// Translation function
function t(key) {
  const keys = key.split('.');
  let value = translations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  }
  
  return value || key;
}

// Change language
async function changeLanguage(language) {
  currentLanguage = language;
  await loadTranslations(language);
  updateContent();
  updateLanguageButtons();
}

// Update language selector buttons
function updateLanguageButtons() {
  const brBtn = document.getElementById('lang-br');
  const usBtn = document.getElementById('lang-us');
  
  if (brBtn && usBtn) {
    brBtn.classList.toggle('active', currentLanguage === 'pt');
    usBtn.classList.toggle('active', currentLanguage === 'en');
  }
}

// Update all content on the page
function updateContent() {
  // Update meta tags
  document.title = t('meta.title');
  document.querySelector('meta[name="description"]').setAttribute('content', t('meta.description'));
  
  // Update header
  document.querySelector('.logo').textContent = t('header.name');
  document.querySelector('h1').textContent = t('header.name');
  document.querySelector('.tagline').textContent = t('header.tagline');
  document.querySelector('.cta-button').textContent = t('header.cta');
  
  // Update about section
  document.querySelector('#about h2').textContent = t('about.title');
  document.querySelector('#about p').textContent = t('about.content');
  
  // Update skills
  const skillsList = document.querySelector('.skills-list');
  if (skillsList) {
    skillsList.innerHTML = '';
    t('about.skills').forEach(skill => {
      const li = document.createElement('li');
      li.textContent = skill;
      skillsList.appendChild(li);
    });
  }
  
  // Update projects
  const projectsGrid = document.querySelector('.projects-grid');
  if (projectsGrid) {
    projectsGrid.innerHTML = '';
    t('projects').forEach(project => {
      const projectCard = document.createElement('div');
      projectCard.className = 'project-card';
      projectCard.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-tags">
          ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      `;
      projectsGrid.appendChild(projectCard);
    });
  }
  
  // Update contact section
  document.querySelector('#contact h2').textContent = t('contact.title');
  document.querySelector('.email').textContent = t('contact.email');
  
  // Update social links
  const socialLinks = document.querySelector('.social-links');
  if (socialLinks) {
    socialLinks.innerHTML = '';
    t('contact.social').forEach(social => {
      const link = document.createElement('a');
      link.href = social.url;
      link.textContent = social.name;
      socialLinks.appendChild(link);
    });
  }
  
  // Update footer
  const footerName = document.querySelector('footer span[data-json="header.name"]');
  if (footerName) {
    footerName.textContent = t('header.name');
  }
}

// Initialize the page
async function init() {
  // Create language selector
  const navbar = document.querySelector('#navbar .container');
  if (navbar) {
    const languageSelector = document.createElement('div');
    languageSelector.className = 'language-selector';
    languageSelector.innerHTML = `
      <button id="lang-br" class="lang-btn active" onclick="changeLanguage('pt')">🇧🇷 BR</button>
      <button id="lang-us" class="lang-btn" onclick="changeLanguage('en')">🇺🇸 US</button>
    `;
    navbar.appendChild(languageSelector);
  }
  
  // Detect user language and load translations
  const detectedLanguage = await detectUserLanguage();
  currentLanguage = detectedLanguage;
  await loadTranslations(detectedLanguage);
  updateContent();
  updateLanguageButtons();
  
  // Set current year in footer
  document.getElementById('year').textContent = new Date().getFullYear();
  
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
  
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 