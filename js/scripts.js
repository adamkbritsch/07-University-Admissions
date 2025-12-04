// inject current year in footer
const myrightNow = new Date();
document.querySelector('#year').textContent = myrightNow.getFullYear()

// mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const primaryMenu = document.querySelector('#primary-menu');
const siteHeader = document.querySelector('.site-header');
const rootElement = document.documentElement;

if (navToggle && primaryMenu) {
  const mdUpQuery = window.matchMedia('(min-width: 35rem)');

  const applyHeaderOffset = () => {
    if (!siteHeader) return;
    const headerHeight = siteHeader.getBoundingClientRect().height;
    rootElement.style.setProperty('--header-offset', `${Math.round(headerHeight)}px`);
  };

  const openMenu = () => {
    applyHeaderOffset();
    navToggle.setAttribute('aria-expanded', 'true');
    primaryMenu.classList.add('is-open');
    document.body.classList.add('nav-open');
  };

  const closeMenu = () => {
    navToggle.setAttribute('aria-expanded', 'false');
    primaryMenu.classList.remove('is-open');
    document.body.classList.remove('nav-open');
  };

  const toggleMenu = () => {
    if (mdUpQuery.matches) return;
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  navToggle.addEventListener('click', toggleMenu);

  primaryMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navToggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
      }
    });
  });

  const handleViewportChange = event => {
    if (event.matches) {
      closeMenu();
    }
  };

  if (typeof mdUpQuery.addEventListener === 'function') {
    mdUpQuery.addEventListener('change', handleViewportChange);
  } else if (typeof mdUpQuery.addListener === 'function') {
    mdUpQuery.addListener(handleViewportChange);
  }

  window.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      navToggle.focus();
    }
  });
}
