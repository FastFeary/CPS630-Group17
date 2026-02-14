const key = 'bookedClassIds';

function getBookedIds() {
  try {
    const raw = localStorage.getItem(key);
    let parsed = [];
    if (raw) {
      parsed = JSON.parse(raw);
    }
    if (Array.isArray(parsed)) {
      return parsed;
    } else {
      return [];
    }
  } catch {
    return [];
  }
}

function setBookedIds(ids) {
  localStorage.setItem(key, JSON.stringify(ids));
}

function initIndexPage() {
  const grid = document.getElementById('classesGrid');
  if (!grid) {
    return;
  }

  function isBooked(id) {
    return getBookedIds().includes(id);
  }

  function bookClass(id) {
    const ids = getBookedIds();
    if (!ids.includes(id)) {
      ids.push(id);
      setBookedIds(ids);
    }
    renderClasses(window.__classes || []);
  }

  async function deleteClass(id) {
    try {
      const res = await fetch(`/api/classes/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        console.error('Failed to delete class');
        return;
      }

      const ids = getBookedIds().filter((x) => x !== id);
      setBookedIds(ids);

      await loadClasses();
    } catch (err) {
      console.error(err);
    }
  }

  function renderClasses(classes) {
    window.__classes = classes;
    grid.innerHTML = '';

    classes.forEach((c) => {
      const card = document.createElement('article');
      card.className = 'card';

      const booked = isBooked(c.id);

      let disabledAttr = '';
      let buttonLabel = 'Book';
      if (booked) {
        disabledAttr = 'disabled';
        buttonLabel = 'Booked';
      }

      card.innerHTML = `
          <div class="card-image">
            <img src="${c.image}" alt="${c.title}" loading="lazy" />
          </div>
          <div class="card-body">
            <h3 class="card-title">${c.title}</h3>
            <p class="card-description">${c.description}</p>
            <div class="card-actions">
              <button class="button" ${disabledAttr} data-id="${c.id}">
                ${buttonLabel}
              </button>
              <button class="button danger" data-delete-id="${c.id}">
                Delete class
              </button>
            </div>
          </div>
        `;

      const btn = card.querySelector('button');
      btn.addEventListener('click', () => bookClass(c.id));

      const deleteBtn = card.querySelector('button[data-delete-id]');
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteClass(c.id);
      });

      grid.appendChild(card);
    });
  }

  async function loadClasses() {
    const res = await fetch('/api/classes');
    const classes = await res.json();
    renderClasses(classes);
  }

  loadClasses().catch((err) => {
    console.error(err);
    grid.innerHTML = '<p class="error">Failed to load classes.</p>';
  });
}

function initBookedPage() {
  const grid = document.getElementById('bookedGrid');
  if (!grid) {
    return;
  }

  function unbookClass(id) {
    const ids = getBookedIds().filter((x) => x !== id);
    setBookedIds(ids);
    renderBooked(window.__classes || []);
  }

  function renderBooked(classes) {
    window.__classes = classes;
    const bookedIds = getBookedIds();
    const booked = classes.filter((c) => bookedIds.includes(c.id));

    if (booked.length === 0) {
      grid.innerHTML = '<p class="muted">No booked classes yet. Go to the Classes page to book one.</p>';
      return;
    }

    grid.innerHTML = '';

    booked.forEach((c) => {
      const card = document.createElement('article');
      card.className = 'card';

      card.innerHTML = `
          <div class="card-image">
            <img src="${c.image}" alt="${c.title}" loading="lazy" />
          </div>
          <div class="card-body">
            <h3 class="card-title">${c.title}</h3>
            <p class="card-description">${c.description}</p>
            <div class="card-actions">
              <button class="button danger" data-id="${c.id}">Delete booking</button>
            </div>
          </div>
        `;

      const btn = card.querySelector('button');
      btn.addEventListener('click', () => unbookClass(c.id));

      grid.appendChild(card);
    });
  }

  async function load() {
    const res = await fetch('/api/classes');
    const classes = await res.json();
    renderBooked(classes);
  }

  load().catch((err) => {
    console.error(err);
    grid.innerHTML = '<p class="error">Failed to load booked classes.</p>';
  });
}

function initAddClassPage() {
  const form = document.getElementById('addClassForm');
  if (!form) {
    return;
  }

  const statusEl = document.getElementById('status');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = '';

    const payload = {
      title: document.getElementById('title').value.trim(),
      description: document.getElementById('description').value.trim(),
      image: '/images/placeholder.jpg',
    };

    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        statusEl.textContent = data?.error || 'Failed to add class.';
        statusEl.className = 'error';
        return;
      }

      window.location.href = '/';
    } catch (err) {
      console.error(err);
      statusEl.textContent = 'Network error while adding class.';
      statusEl.className = 'error';
    }
  });
}

initIndexPage();
initBookedPage();
initAddClassPage();
