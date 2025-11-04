// inject current year in footer
const myrightNow = new Date();
document.querySelector('#year').textContent = myrightNow.getFullYear()

// mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const primaryMenu = document.querySelector('#primary-menu');
const primaryNav = navToggle ? navToggle.closest('.primary-nav') : null;
const siteHeader = document.querySelector('.site-header');
const footerNavPortal = document.querySelector('#footerNavPortal');
const topAnchor = document.querySelector('#top');
const rootElement = document.documentElement;

if (navToggle && primaryMenu && primaryNav && footerNavPortal) {
  const navOriginalParent = primaryMenu.parentElement;
  const navOriginalNextSibling = primaryMenu.nextElementSibling;
  const mdUpQuery = window.matchMedia('(min-width: 35rem)');

  const applyHeaderOffset = () => {
    if (!siteHeader) return;
    const headerHeight = siteHeader.getBoundingClientRect().height;
    rootElement.style.setProperty('--header-offset', `${Math.round(headerHeight)}px`);
  };

  const moveMenuToFooter = () => {
    if (primaryMenu.parentElement === footerNavPortal) return;
    footerNavPortal.appendChild(primaryMenu);
    document.body.classList.add('nav-in-footer');
  };

  const restoreMenuToHeader = () => {
    if (!navOriginalParent) return;
    if (primaryMenu.parentElement === navOriginalParent) return;
    if (navOriginalNextSibling && navOriginalNextSibling.parentElement === navOriginalParent) {
      navOriginalParent.insertBefore(primaryMenu, navOriginalNextSibling);
    } else {
      navOriginalParent.appendChild(primaryMenu);
    }
    document.body.classList.remove('nav-in-footer');
  };

  const scrollToElement = element => {
    if (!element) return;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openMenu = () => {
    applyHeaderOffset();
    navToggle.setAttribute('aria-expanded', 'true');
    moveMenuToFooter();
    primaryMenu.classList.add('is-open');
    requestAnimationFrame(() => scrollToElement(footerNavPortal));
  };

  const closeMenu = ({ scrollToTop = true } = {}) => {
    navToggle.setAttribute('aria-expanded', 'false');
    primaryMenu.classList.remove('is-open');
    restoreMenuToHeader();
    if (scrollToTop) {
      if (topAnchor) {
        requestAnimationFrame(() => scrollToElement(topAnchor));
      } else {
        requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
      }
    }
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
        const isBackToTop = link.getAttribute('href') === '#top';
        closeMenu({ scrollToTop: isBackToTop });
      }
    });
  });

  const handleViewportChange = event => {
    if (event.matches) {
      closeMenu({ scrollToTop: false });
    }
  };

  if (typeof mdUpQuery.addEventListener === 'function') {
    mdUpQuery.addEventListener('change', handleViewportChange);
  } else if (typeof mdUpQuery.addListener === 'function') {
    mdUpQuery.addListener(handleViewportChange);
  }

  window.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      closeMenu({ scrollToTop: false });
      navToggle.focus();
    }
  });
}
