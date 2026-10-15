const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');
const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = [...document.querySelectorAll('main section[id]')];

menuToggle.addEventListener('click', () => {
  const open = sidebar.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

navLinks.forEach((link) => link.addEventListener('click', () => {
  sidebar.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55% 0px' });

sections.forEach((section) => observer.observe(section));

const publicationSection = document.querySelector('#publications');
if (publicationSection) {
  const publicationFilters = [...publicationSection.querySelectorAll('[data-publication-filter]')];
  const publicationGroups = [...publicationSection.querySelectorAll('[data-publication-group]')];
  const allPublications = publicationSection.querySelector('#all-publications');
  const publicationEntries = publicationGroups.flatMap((group) => [...group.querySelectorAll('.publication-list > .publication')]);

  publicationEntries
    .sort((first, second) => Number(second.querySelector('.pub-year')?.textContent) - Number(first.querySelector('.pub-year')?.textContent))
    .forEach((publication) => allPublications.appendChild(publication.cloneNode(true)));

  const showPublicationFilter = (filter) => {
    const showAll = filter === 'all';
    allPublications.hidden = !showAll;
    allPublications.classList.toggle('filter-hidden', !showAll);
    publicationGroups.forEach((group) => {
      const showGroup = !showAll && group.dataset.publicationGroup === filter;
      group.hidden = !showGroup;
      group.classList.toggle('filter-hidden', !showGroup);
    });
    publicationFilters.forEach((button) => {
      const isActive = button.dataset.publicationFilter === filter;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  };

  publicationFilters.forEach((button) => {
    button.addEventListener('click', () => showPublicationFilter(button.dataset.publicationFilter));
  });

  showPublicationFilter('all');
}
