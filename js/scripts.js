// inject current year in footer
const myrightNow = new Date();
document.querySelector('#year').textContent = myrightNow.getFullYear()

// mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const primaryMenu = document.querySelector('#primary-menu');
const siteHeader = document.querySelector('.site-header');
const rootElement = document.documentElement;

if (navToggle && primaryMenu) {
  let lastScrollY = 0;

  const lockBodyScroll = () => {
    if (document.body.classList.contains('nav-open')) return;
    lastScrollY = window.scrollY;
    document.body.classList.add('nav-open');
    document.body.style.position = 'fixed';
    document.body.style.top = `-${lastScrollY}px`;
    document.body.style.width = '100%';
  };

  const unlockBodyScroll = (restoreScroll = true) => {
    if (!document.body.classList.contains('nav-open')) return;
    document.body.classList.remove('nav-open');
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('width');
    if (restoreScroll) {
      window.scrollTo({ top: lastScrollY, behavior: 'auto' });
    }
  };

  const applyHeaderOffset = () => {
    if (!siteHeader) return;
    const headerHeight = siteHeader.getBoundingClientRect().height;
    rootElement.style.setProperty('--header-offset', `${Math.round(headerHeight)}px`);
  };

  const openMenu = () => {
    applyHeaderOffset();
    navToggle.setAttribute('aria-expanded', 'true');
    primaryMenu.classList.add('is-open');
    primaryMenu.scrollTo({ top: 0 });
    lockBodyScroll();
  };

  const closeMenu = ({ restoreScroll = true } = {}) => {
    navToggle.setAttribute('aria-expanded', 'false');
    primaryMenu.classList.remove('is-open');
    unlockBodyScroll(restoreScroll);
  };

  const toggleMenu = () => {
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

  const mdUpQuery = window.matchMedia('(min-width: 35rem)');
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
