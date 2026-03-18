// script.js

// ==================== MOBILE MENU & OVERLAY ====================
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const overlay = document.getElementById('menu-overlay');

function toggleMenu(open) {
  const isOpen = open !== undefined ? open : !navLinks.classList.contains('active');
  
  if (isOpen) {
    navLinks.classList.add('active');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    // Animate hamburger to X
    const spans = menuToggle.querySelectorAll('span');
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
  } else {
    navLinks.classList.remove('active');
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
    // Reset hamburger
    const spans = menuToggle.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
  }
  menuToggle.setAttribute('aria-expanded', isOpen);
}

menuToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleMenu();
});

// Close menu when clicking on overlay
overlay.addEventListener('click', () => toggleMenu(false));

// Close menu when a link is clicked
const links = navLinks.querySelectorAll('a');
links.forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});

// Close menu on window resize (if going from mobile to desktop)
window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
    toggleMenu(false);
  }
});

// ==================== STICKY HEADER & BACK TO TOP ====================
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  if (window.scrollY > 500) {
    backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
    backToTopBtn.classList.add('opacity-100');
  } else {
    backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
    backToTopBtn.classList.remove('opacity-100');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ==================== DYNAMIC CONTENT (from config.json) ====================
async function loadConfig() {
  try {
    const response = await fetch('config.json');
    const config = await response.json();

    document.getElementById('heroHeadline').innerHTML = config.hero_headline;
    document.getElementById('heroSubheadline').textContent = config.hero_subheadline;
    document.getElementById('companyDescription').textContent = config.company_description;
    document.getElementById('contactEmail').href = `mailto:${config.contact_email}`;
    document.getElementById('contactEmailText').textContent = config.contact_email;
    document.getElementById('contactPhone').href = `tel:${config.contact_phone.replace(/\s/g, '')}`;
    document.getElementById('contactPhoneText').textContent = config.contact_phone;
    document.getElementById('applicationForm').action = config.form_action;
  } catch (error) {
    console.warn('Could not load config.json, using default content.');
  }
}
loadConfig();

// ==================== FORM HANDLING ====================
const form = document.getElementById('applicationForm');
const submitBtn = document.getElementById('submitBtn');
const submitBtnText = document.getElementById('submitBtnText');
const successMessage = document.getElementById('successMessage');

function showFormMessage(type, text) {
  const existing = form.querySelector('.form-message');
  if (existing) existing.remove();

  const msgDiv = document.createElement('div');
  msgDiv.className = `form-message ${type === 'error' ? 'bg-red-100 border-red-400 text-red-800' : 'bg-green-100 border-green-400 text-green-800'} border px-4 py-3 rounded-xl mb-4`;
  msgDiv.textContent = text;
  form.insertBefore(msgDiv, form.firstChild);
}

function validateForm(formData) {
  const fullName = formData.get('fullName')?.trim();
  const email = formData.get('email')?.trim();
  const phone = formData.get('phone')?.trim();

  if (!fullName) return 'Full name is required.';
  if (!email) return 'Email address is required.';
  if (!/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email address.';
  if (!phone) return 'Phone number is required.';
  if (!/^[0-9+\-\s()]{7,}$/.test(phone)) return 'Please enter a valid phone number.';

  const file = formData.get('resume');
  if (file && file.size > 5 * 1024 * 1024) {
    return 'Resume file must be under 5MB.';
  }
  return null;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const validationError = validateForm(formData);
  if (validationError) {
    showFormMessage('error', validationError);
    return;
  }

  submitBtn.disabled = true;
  submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
  submitBtnText.textContent = 'Submitting...';

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: formData
    });

    if (response.ok) {
      form.classList.add('hidden');
      successMessage.classList.remove('hidden');
      form.reset();
    } else {
      let errorText = `Server error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorText = errorData.message || errorData.error || errorText;
      } catch {
        errorText = await response.text() || errorText;
      }
      showFormMessage('error', `Submission failed: ${errorText}`);
      console.error('Form error:', errorText);
    }
  } catch (err) {
    console.error('Network error:', err);
    showFormMessage('error', 'Network error. Please check your connection and try again.');
  } finally {
    if (!form.classList.contains('hidden')) {
      submitBtn.disabled = false;
      submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
      submitBtnText.textContent = 'Submit Application';
    }
  }
});
// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.closest('.faq-item');
        const answer = faqItem.querySelector('.faq-answer');
        const icon = button.querySelector('.faq-icon');

        // Toggle current item
        answer.classList.toggle('hidden');
        icon.classList.toggle('rotate-180');

        // Optional: close other items (uncomment if you want only one open at a time)
        /*
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) {
                item.querySelector('.faq-answer').classList.add('hidden');
                item.querySelector('.faq-icon').classList.remove('rotate-180');
            }
        });
        */
    });
});
