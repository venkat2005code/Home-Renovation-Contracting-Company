/**
 * BuildPro - Home Renovation & Contracting
 * Main JavaScript File
 */

// ==========================================
// Dark Mode Toggle
// ==========================================
const html = document.documentElement;
const darkModeToggles = document.querySelectorAll('#darkModeToggle, [data-toggle="dark-mode"]');
const directionToggles = document.querySelectorAll('#rtlToggle, [data-toggle="direction"]');

function updateDarkModeToggleUI() {
  const isDark = html.classList.contains('dark');
  darkModeToggles.forEach((toggle) => {
    if (toggle.hasAttribute('data-toggle')) {
      toggle.innerHTML = `<i class="fas ${isDark ? 'fa-sun' : 'fa-moon'} mr-2"></i>${isDark ? 'Light' : 'Dark'}`;
    } else {
      toggle.innerHTML = `<i class="fas ${isDark ? 'fa-sun' : 'fa-moon'}"></i>`;
    }
  });
}

function updateDirectionToggleUI() {
  const currentDir = html.getAttribute('dir') || 'ltr';
  const buttonText = currentDir === 'rtl' ? '🌐 LTR' : '🌍 RTL';
  directionToggles.forEach((toggle) => {
    toggle.textContent = buttonText;
  });
}

function toggleDarkMode() {
  html.classList.toggle('dark');
  localStorage.setItem('darkMode', html.classList.contains('dark'));
  updateDarkModeToggleUI();
  if (typeof hasDashboardCharts === 'function' && hasDashboardCharts()) {
    setTimeout(initDashboardChartsIfPresent, 0);
  }
}

function toggleDirection() {
  const currentDir = html.getAttribute('dir') || 'ltr';
  const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
  html.setAttribute('dir', newDir);
  localStorage.setItem('direction', newDir);
  updateDirectionToggleUI();
}

// Check for saved preference or system preference
if (localStorage.getItem('darkMode') === 'true' || 
    (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  html.classList.add('dark');
}
updateDarkModeToggleUI();

const savedDir = localStorage.getItem('direction');
if (savedDir) {
  html.setAttribute('dir', savedDir);
}
updateDirectionToggleUI();

darkModeToggles.forEach((toggle) => {
  toggle.addEventListener('click', toggleDarkMode);
});

// ==========================================
// RTL Toggle
// ==========================================
directionToggles.forEach((toggle) => {
  toggle.addEventListener('click', toggleDirection);
});

// ==========================================
// Mobile Menu Toggle
// ==========================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuContent = document.getElementById('mobileMenuContent');
const closeMobileMenu = document.getElementById('closeMobileMenu');

function openMobileMenu() {
  if (mobileMenu && mobileMenuContent) {
    mobileMenu.classList.add('active');
    mobileMenu.classList.remove('hidden');
    setTimeout(() => {
      mobileMenuContent.classList.add('active');
    }, 10);
  }
}

function closeMobileMenuFn() {
  if (mobileMenu && mobileMenuContent) {
    mobileMenuContent.classList.remove('active');
    setTimeout(() => {
      mobileMenu.classList.remove('active');
      mobileMenu.classList.add('hidden');
    }, 300);
  }
}

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', openMobileMenu);
}

if (closeMobileMenu) {
  closeMobileMenu.addEventListener('click', closeMobileMenuFn);
}

if (mobileMenu) {
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      closeMobileMenuFn();
    }
  });
}

// ==========================================
// Sticky Navbar with Shadow on Scroll
// ==========================================
const navbar = document.getElementById('navbar');

if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  });
}

// ==========================================
// Active Navigation Link Highlighting
// ==========================================
function highlightActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    let isActive = false;
    
    // Check if link href matches current page
    if (href === currentPage) {
      isActive = true;
    }
    // Special handling for Home button (no href) on home pages
    else if (!href && (currentPage === 'index.html' || currentPage === 'index2.html')) {
      isActive = true;
    }
    
    if (isActive) {
      link.classList.add('text-blue-600', 'dark:text-blue-400', 'font-semibold');
      // Handle both button and anchor tag parents
      if (link.parentElement && link.parentElement.parentElement) {
        link.parentElement.parentElement.classList.add('active');
      }
    }
  });
  
  // Highlight dropdown menu links (Home 1, Home 2)
  const dropdownLinks = document.querySelectorAll('.dropdown-menu a');
  dropdownLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('text-blue-600', 'dark:text-blue-400', 'font-semibold', 'bg-blue-50', 'dark:bg-slate-700');
      // Also highlight the Home button parent
      const homeButton = document.querySelector('.nav-link:not([href])');
      if (homeButton) {
        homeButton.classList.add('text-blue-600', 'dark:text-blue-400', 'font-semibold');
      }
    }
  });
}

highlightActiveNav();

// ==========================================
// Animated Counters
// ==========================================
function animateCounter(element, target, duration = 2000) {
  const suffix = element.getAttribute('data-suffix') || '';
  let start = 0;
  const increment = target / (duration / 16);
  
  function updateCounter() {
    start += increment;
    if (start < target) {
      element.textContent = `${Math.floor(start)}${suffix}`;
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = `${target}${suffix}`;
    }
  }
  
  updateCounter();
}

// Intersection Observer for counters
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counter = entry.target;
      const target = parseInt(counter.getAttribute('data-target'));
      animateCounter(counter, target);
      counterObserver.unobserve(counter);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(counter => {
  counterObserver.observe(counter);
});

// ==========================================
// Before/After Image Slider
// ==========================================
function initBeforeAfterSlider() {
  const sliders = document.querySelectorAll('.before-after-container');
  
  sliders.forEach(container => {
    const slider = container.querySelector('.before-after-slider');
    const beforeImage = container.querySelector('.before-image');
    let isDragging = false;
    
    function updateSlider(x) {
      const rect = container.getBoundingClientRect();
      let position = ((x - rect.left) / rect.width) * 100;
      position = Math.max(0, Math.min(100, position));
      
      slider.style.left = position + '%';
      beforeImage.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
    }
    
    slider.addEventListener('mousedown', () => isDragging = true);
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      updateSlider(e.clientX);
    });
    
    // Touch support
    slider.addEventListener('touchstart', () => isDragging = true);
    window.addEventListener('touchend', () => isDragging = false);
    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      updateSlider(e.touches[0].clientX);
    });
  });
}

initBeforeAfterSlider();

// ==========================================
// Smooth Scroll for Anchor Links
// ==========================================
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

// ==========================================
// Form Validation
// ==========================================
function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.classList.add('border-red-500');
      } else {
        input.classList.remove('border-red-500');
      }
    });
    
    if (isValid) {
      // Show success message
      showNotification('Form submitted successfully!', 'success');
      form.reset();
    } else {
      showNotification('Please fill in all required fields.', 'error');
    }
  });
}

// Initialize form validation
validateForm('contactForm');
validateForm('quoteForm');
validateForm('loginForm');
validateForm('registerForm');

// ==========================================
// Notification System
// ==========================================
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500'
  };
  
  notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in-down`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// ==========================================
// Modal Functionality
// ==========================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}

// Close modal on outside click
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
});

// ==========================================
// Dashboard Sidebar Toggle (Mobile)
// ==========================================
const dashboardSidebarToggle = document.getElementById('dashboardSidebarToggle');
const closeDashboardSidebar = document.getElementById('closeDashboardSidebar');
const dashboardSidebar = document.getElementById('dashboardSidebar');

if (dashboardSidebarToggle && dashboardSidebar) {
  dashboardSidebarToggle.addEventListener('click', () => {
    dashboardSidebar.classList.toggle('active');
  });
}

if (closeDashboardSidebar && dashboardSidebar) {
  closeDashboardSidebar.addEventListener('click', () => {
    dashboardSidebar.classList.remove('active');
  });
}

// ==========================================
// Chart.js Initialization for Dashboard
// ==========================================
const dashboardChartInstances = [];

function getDashboardChartTheme() {
  const isDark = html.classList.contains('dark');
  return {
    textColor: isDark ? '#cbd5e1' : '#334155',
    gridColor: isDark ? 'rgba(148, 163, 184, 0.22)' : 'rgba(148, 163, 184, 0.28)'
  };
}

function destroyDashboardCharts() {
  while (dashboardChartInstances.length) {
    const chart = dashboardChartInstances.pop();
    if (chart) {
      chart.destroy();
    }
  }
}

function initDashboardCharts() {
  if (typeof Chart === 'undefined') return;

  destroyDashboardCharts();
  const theme = getDashboardChartTheme();

  // Project Growth Chart
  const projectGrowthCtx = document.getElementById('projectGrowthChart');
  if (projectGrowthCtx) {
    const chart = new Chart(projectGrowthCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Projects Completed',
          data: [12, 19, 15, 25, 22, 30],
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: theme.textColor
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: theme.textColor
            },
            grid: {
              color: theme.gridColor
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: theme.textColor
            },
            grid: {
              color: theme.gridColor
            }
          }
        }
      }
    });
    dashboardChartInstances.push(chart);
  }
  
  // Revenue Analytics Chart
  const revenueCtx = document.getElementById('revenueChart');
  if (revenueCtx) {
    const chart = new Chart(revenueCtx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Revenue ($)',
          data: [15000, 22000, 18000, 28000, 25000, 35000],
          backgroundColor: '#f97316',
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: theme.textColor
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: theme.textColor
            },
            grid: {
              color: theme.gridColor
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: theme.textColor
            },
            grid: {
              color: theme.gridColor
            }
          }
        }
      }
    });
    dashboardChartInstances.push(chart);
  }
  
  // Service Distribution Pie Chart
  const serviceDistCtx = document.getElementById('serviceDistChart');
  if (serviceDistCtx) {
    const chart = new Chart(serviceDistCtx, {
      type: 'doughnut',
      data: {
        labels: ['Kitchen', 'Bathroom', 'Exterior', 'Interior', 'Other'],
        datasets: [{
          data: [30, 25, 20, 15, 10],
          backgroundColor: [
            '#2563eb',
            '#f97316',
            '#10b981',
            '#f59e0b',
            '#ef4444'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: theme.textColor
            }
          }
        }
      }
    });
    dashboardChartInstances.push(chart);
  }
}

// Initialize charts when dashboard page loads
function hasDashboardCharts() {
  return Boolean(
    document.getElementById('projectGrowthChart') ||
    document.getElementById('revenueChart') ||
    document.getElementById('serviceDistChart')
  );
}

function initDashboardChartsIfPresent() {
  if (hasDashboardCharts()) {
    initDashboardCharts();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDashboardChartsIfPresent);
} else {
  initDashboardChartsIfPresent();
}

// ==========================================
// Countdown Timer (Coming Soon Page)
// ==========================================
function initCountdown() {
  const countdownElement = document.getElementById('countdown');
  if (!countdownElement) return;
  
  const targetDate = new Date(countdownElement.getAttribute('data-target')).getTime();
  
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;
    
    if (distance < 0) {
      countdownElement.innerHTML = '<div class="text-4xl font-bold">We\'re Live!</div>';
      return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    countdownElement.innerHTML = `
      <div class="grid grid-cols-4 gap-4 text-center">
        <div class="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-lg">
          <div class="text-4xl font-bold text-blue-600">${days}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Days</div>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-lg">
          <div class="text-4xl font-bold text-blue-600">${hours}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Hours</div>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-lg">
          <div class="text-4xl font-bold text-blue-600">${minutes}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Minutes</div>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-lg">
          <div class="text-4xl font-bold text-blue-600">${seconds}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Seconds</div>
        </div>
      </div>
    `;
  }
  
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

initCountdown();

// ==========================================
// Filter Functionality (Services/Blog)
// ==========================================
function initFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const filterItems = document.querySelectorAll('.filter-item');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active', 'bg-blue-600', 'text-white'));
      // Add active class to clicked button
      button.classList.add('active', 'bg-blue-600', 'text-white');
      
      const filterValue = button.getAttribute('data-filter');
      
      filterItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.classList.remove('hidden');
          item.classList.add('animate-fade-in-up');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

initFilters();

// ==========================================
// Search Functionality
// ==========================================
function initSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchItems = document.querySelectorAll('.search-item');
  
  if (!searchInput) return;
  
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    searchItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(searchTerm)) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
}

initSearch();

// ==========================================
// Scroll to Top Button
// ==========================================
const scrollToTopBtn = document.getElementById('scrollToTop');

if (scrollToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.remove('hidden');
    } else {
      scrollToTopBtn.classList.add('hidden');
    }
  });
  
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ==========================================
// Tab Functionality
// ==========================================
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active', 'border-b-2', 'border-blue-600', 'text-blue-600'));
      tabContents.forEach(content => content.classList.add('hidden'));
      
      // Add active class to clicked button and corresponding content
      button.classList.add('active', 'border-b-2', 'border-blue-600', 'text-blue-600');
      document.getElementById(tabId)?.classList.remove('hidden');
    });
  });
}

initTabs();

// ==========================================
// Accordion Functionality
// ==========================================
function initAccordions() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const icon = header.querySelector('.accordion-icon');
      
      // Toggle current accordion
      content.classList.toggle('hidden');
      icon?.classList.toggle('rotate-180');
      
      // Close other accordions (optional - remove if you want multiple open)
      accordionHeaders.forEach(otherHeader => {
        if (otherHeader !== header) {
          const otherContent = otherHeader.nextElementSibling;
          const otherIcon = otherHeader.querySelector('.accordion-icon');
          otherContent?.classList.add('hidden');
          otherIcon?.classList.remove('rotate-180');
        }
      });
    });
  });
}

initAccordions();

// ==========================================
// Cost Estimator UI
// ==========================================
function initCostEstimator() {
  const estimatorForm = document.getElementById('costEstimator');
  if (!estimatorForm) return;
  
  estimatorForm.addEventListener('input', calculateEstimate);
  
  function calculateEstimate() {
    const squareFeet = parseFloat(document.getElementById('sqft')?.value) || 0;
    const qualityLevel = document.getElementById('quality')?.value || 'standard';
    const rooms = parseInt(document.getElementById('rooms')?.value) || 0;
    
    const qualityMultipliers = {
      basic: 50,
      standard: 75,
      premium: 120
    };
    
    const baseCost = squareFeet * qualityMultipliers[qualityLevel];
    const roomCost = rooms * 2000;
    const totalEstimate = baseCost + roomCost;
    
    const estimateDisplay = document.getElementById('estimateDisplay');
    if (estimateDisplay) {
      estimateDisplay.textContent = `$${totalEstimate.toLocaleString()}`;
    }
  }
}

initCostEstimator();

// ==========================================
// Lazy Loading Images
// ==========================================
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

initLazyLoading();

// ==========================================
// Tooltip Initialization
// ==========================================
function initTooltips() {
  const tooltips = document.querySelectorAll('[data-tooltip]');
  
  tooltips.forEach(tooltip => {
    tooltip.addEventListener('mouseenter', (e) => {
      const tooltipText = e.target.getAttribute('data-tooltip');
      // Tooltip styling handled by CSS
    });
  });
}

initTooltips();

// ==========================================
// Print Functionality
// ==========================================
function printPage() {
  window.print();
}

// ==========================================
// Export Data (for Dashboard)
// ==========================================
function exportToCSV(data, filename = 'export.csv') {
  const csvContent = "data:text/csv;charset=utf-8," + data.map(e => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ==========================================
// Utility Functions
// ==========================================

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

// Format date
function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ==========================================
// Console Welcome Message
// ==========================================
console.log('%c🏡 BuildPro - Home Renovation Template', 'color: #2563eb; font-size: 20px; font-weight: bold;');
console.log('%cPremium HTML Template by BuildPro', 'color: #f97316; font-size: 14px;');
