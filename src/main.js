import './styles.css';
import { getEvents } from './lib/events';

const categories = ['All events', 'Environment', 'Community', 'Food access', 'Animals'];
const savedStorageKey = 'volo-saved';
const icons = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  heart: '<path d="M20.8 8.7c0 5.3-8.8 10.1-8.8 10.1S3.2 14 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z"/>',
  mapPin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  sparkles: '<path d="m12 3-1.2 4.8L6 9l4.8 1.2L12 15l1.2-4.8L18 9l-4.8-1.2L12 3ZM19 15l-.6 2.4L16 18l2.4.6L19 21l.6-2.4L22 18l-2.4-.6L19 15ZM5 15l-.5 2L3 17.5l1.5.5L5 20l.5-2 1.5-.5L5.5 17 5 15Z"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  x: '<path d="m6 6 12 12M18 6 6 18"/>'
};

function icon(name, size = 16, fill = 'none') {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
}

const state = {
  events: [],
  category: 'All events',
  query: '',
  saved: JSON.parse(localStorage.getItem(savedStorageKey) || localStorage.getItem('good-neighbors-saved') || '[]'),
  location: 'Charlotte, NC'
};

function eventCard(event) {
  const saved = state.saved.includes(event.id);
  return `<article class="event-card">
    <div class="event-image" style="background-image: url('${event.image}')">
      <span class="event-category">${event.category}</span>
      <button class="save-button ${saved ? 'saved' : ''}" data-action="save" data-id="${event.id}" aria-label="${saved ? 'Remove from saved events' : 'Save event'}">${icon('heart', 17, saved ? 'currentColor' : 'none')}</button>
    </div>
    <div class="event-content">
      <div class="event-date"><span>${event.day}</span><strong>${event.date}</strong></div>
      <div class="event-details"><h3>${event.title}</h3><p class="event-org">${event.organization}</p><div class="event-meta"><span>${icon('mapPin', 14)}${event.distance} mi</span><span>${icon('clock', 14)}${event.duration}</span></div></div>
      <button class="join-button" data-action="join" data-id="${event.id}">Join ${icon('arrow', 16)}</button>
    </div>
  </article>`;
}

function renderEvents() {
  const filtered = state.events.filter((event) => {
    const matchesCategory = state.category === 'All events' || event.category === state.category;
    const searchable = `${event.title} ${event.organization} ${event.category}`.toLowerCase();
    return matchesCategory && searchable.includes(state.query.toLowerCase());
  });
  const grid = document.querySelector('.events-grid');
  grid.innerHTML = filtered.map(eventCard).join('');
  document.querySelector('.empty-state')?.remove();
  if (!filtered.length) grid.insertAdjacentHTML('afterend', '<div class="empty-state">' + icon('search', 25) + '<h3>No events found</h3><p>Try a different search or cause.</p></div>');
}

function modal(event) {
  document.body.insertAdjacentHTML('beforeend', `<div class="modal-backdrop" data-action="close-modal"><div class="join-modal"><button class="modal-close" data-action="close-modal" aria-label="Close">${icon('x', 18)}</button><div class="modal-check">${icon('check', 26)}</div><p class="eyebrow">You’re on the list</p><h2>${event.title}</h2><p>We’ll send the details to your inbox. Thanks for making space for something good.</p><button class="modal-action" data-action="close-modal">Done ${icon('arrow', 16)}</button></div></div>`);
}

function renderApp() {
  document.querySelector('#root').innerHTML = `<div class="app-shell">
    <header class="topbar"><a class="brand" href="#top"><span class="brand-mark">${icon('sparkles', 16)}</span>Volo</a><nav><a href="#discover">Discover</a><a href="#how-it-works">How it works</a><a href="#about">About us</a></nav><button class="profile-button"><span>JD</span> Jordan ${icon('chevron', 15)}</button></header>
    <main id="top"><section class="hero"><div class="hero-copy"><p class="eyebrow"><span class="eyebrow-dot"></span>Make a little room for good</p><h1>Small actions.<br><em>Real change.</em></h1><p class="hero-subtitle">Find meaningful ways to show up for your community, right around the corner.</p><div class="hero-search">${icon('search', 20)}<input id="search-input" placeholder="Search by cause, place, or activity"><button data-action="explore">Explore</button></div><div class="location-picker">${icon('mapPin', 15)}<span>Showing events near</span><button data-action="location">${state.location} ${icon('chevron', 14)}</button></div></div><div class="hero-art" aria-label="Volunteers planting flowers together"><div class="sun-stamp"><span>YOUR<br>TIME<br><b>MATTERS</b></span></div><div class="hero-note">${icon('users', 15)}<span><b>2,400+</b><small>neighbors helping today</small></span></div></div></section>
    <section class="discover-section" id="discover"><div class="section-heading"><div><p class="eyebrow">A good place to start</p><h2>Events near you</h2></div><button class="view-all">View all ${icon('arrow', 16)}</button></div><div class="filter-row"><div class="category-filters">${categories.map((item) => `<button class="${state.category === item ? 'active' : ''}" data-category="${item}">${item}</button>`).join('')}</div><button class="date-filter">${icon('calendar', 16)} This weekend ${icon('chevron', 14)}</button></div><div class="events-grid"></div></section>
    <section class="impact-strip" id="how-it-works"><div class="impact-intro"><span class="impact-icon">${icon('sparkles', 19)}</span><h2>Good things<br><em>start nearby.</em></h2></div><div class="impact-stat"><strong>18,642</strong><span>hours volunteered<br>this month</span></div><div class="impact-stat"><strong>94</strong><span>local organizations<br>ready for you</span></div><div class="impact-quote">“It’s the easiest way I’ve found to get involved without overthinking it.”<small>— Maya, Charlotte</small></div></section></main>
    <footer id="about"><div class="brand"><span class="brand-mark">${icon('sparkles', 16)}</span>Volo</div><span>Made for people who care.</span><span class="footer-right">© 2026 Volo</span></footer>
  </div>`;
  renderEvents();
  bindEvents();
}

function bindEvents() {
  document.querySelector('#search-input').addEventListener('input', (event) => { state.query = event.target.value; renderEvents(); });
  document.querySelector('[data-action="explore"]').addEventListener('click', () => document.querySelector('#discover').scrollIntoView({ behavior: 'smooth' }));
  document.querySelector('[data-action="location"]').addEventListener('click', () => { state.location = state.location === 'Charlotte, NC' ? 'Your location' : 'Charlotte, NC'; document.querySelector('[data-action="location"]').innerHTML = `${state.location} ${icon('chevron', 14)}`; });
  document.querySelectorAll('[data-category]').forEach((button) => button.addEventListener('click', () => { state.category = button.dataset.category; document.querySelectorAll('[data-category]').forEach((item) => item.classList.toggle('active', item === button)); renderEvents(); }));
  document.querySelector('.events-grid').addEventListener('click', (event) => { const button = event.target.closest('[data-action]'); if (!button) return; const item = state.events.find((entry) => entry.id === button.dataset.id); if (button.dataset.action === 'save') { state.saved = state.saved.includes(item.id) ? state.saved.filter((id) => id !== item.id) : [...state.saved, item.id]; localStorage.setItem(savedStorageKey, JSON.stringify(state.saved)); renderEvents(); } else modal(item); });
}

document.addEventListener('click', (event) => { if (event.target.closest('[data-action="close-modal"]')) document.querySelector('.modal-backdrop')?.remove(); });
renderApp();
getEvents().then((events) => { state.events = events; renderEvents(); });