document.addEventListener('DOMContentLoaded', () => {
  const shortcutsContainer = document.getElementById('shortcuts');
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const addShortcutButton = document.createElement('div');
  addShortcutButton.id = 'add-shortcut-button';
  const dialogContainer = document.getElementById('dialog-container');
  const dialogShortcutName = document.getElementById('dialog-shortcut-name');
  const dialogShortcutUrl = document.getElementById('dialog-shortcut-url');
  const dialogAddButton = document.getElementById('dialog-add-button');
  const dialogCancelButton = document.getElementById('dialog-cancel-button');

  let editIndex = null;

  const defaultShortcuts = [
    { name: 'Google', url: 'https://www.google.com', icon: 'https://www.google.com/favicon.ico' },
    { name: 'YouTube', url: 'https://www.youtube.com', icon: 'https://www.youtube.com/favicon.ico' },
    { name: 'Facebook', url: 'https://www.facebook.com', icon: 'https://www.facebook.com/favicon.ico' },
    { name: 'Twitter', url: 'https://www.twitter.com', icon: 'https://www.twitter.com/favicon.ico' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com', icon: 'https://www.linkedin.com/favicon.ico' },
    { name: 'GitHub', url: 'https://www.github.com', icon: 'https://www.github.com/favicon.ico' },
    { name: 'Reddit', url: 'https://www.reddit.com', icon: 'https://www.reddit.com/favicon.ico' },
    { name: 'StackOverflow', url: 'https://stackoverflow.com', icon: 'https://stackoverflow.com/favicon.ico' },
    { name: 'Gmail', url: 'https://mail.google.com', icon: 'https://mail.google.com/favicon.ico' },
    { name: 'Amazon', url: 'https://www.amazon.com', icon: 'https://www.amazon.com/favicon.ico' },
    { name: 'Netflix', url: 'https://www.netflix.com', icon: 'https://www.netflix.com/favicon.ico' },
    { name: 'Wikipedia', url: 'https://www.wikipedia.org', icon: 'https://www.wikipedia.org/favicon.ico' }
  ];

  function loadShortcuts() {
    const savedShortcuts = JSON.parse(localStorage.getItem('shortcuts')) || defaultShortcuts;
    shortcutsContainer.innerHTML = '';
    savedShortcuts.forEach((shortcut, index) => {
      const shortcutContainer = document.createElement('div');
      shortcutContainer.className = 'shortcut-container';
  
      const iconContainer = document.createElement('div');
      iconContainer.className = 'icon-container';
  
      const editIcon = document.createElement('div');
      editIcon.className = 'icon edit-icon';
      editIcon.addEventListener('click', (event) => {
        event.preventDefault();
        editIndex = index;
        dialogShortcutName.value = shortcut.name;
        dialogShortcutUrl.value = shortcut.url;
        dialogContainer.style.display = 'block';
      });
  
      const deleteIcon = document.createElement('div');
      deleteIcon.className = 'icon delete-icon';
      deleteIcon.addEventListener('click', (event) => {
        event.preventDefault();
        savedShortcuts.splice(index, 1);
        localStorage.setItem('shortcuts', JSON.stringify(savedShortcuts));
        loadShortcuts();
      });
  
      iconContainer.appendChild(editIcon);
      iconContainer.appendChild(deleteIcon);
      shortcutContainer.appendChild(iconContainer);
  
      const shortcutElement = document.createElement('a');
      shortcutElement.href = shortcut.url;
      shortcutElement.className = 'shortcut';
      const shortcutImage = document.createElement('img');
      shortcutImage.src = shortcut.icon;
      shortcutImage.alt = shortcut.name;
      shortcutImage.addEventListener('error', () => {
        shortcutImage.style.display = 'none';
        const fallbackText = document.createElement('div');
        fallbackText.textContent = shortcut.name.charAt(0).toUpperCase();
        fallbackText.style.fontSize = '30px';
        fallbackText.style.color = 'white';
        fallbackText.style.display = 'flex';
        fallbackText.style.alignItems = 'center';
        fallbackText.style.justifyContent = 'center';
        fallbackText.style.width = '100%';
        fallbackText.style.height = '100%';
        shortcutElement.appendChild(fallbackText);
      });
  
      const shortcutName = document.createElement('span');
      shortcutName.textContent = shortcut.name;
  
      shortcutElement.appendChild(shortcutImage);
      shortcutContainer.appendChild(shortcutElement);
      shortcutContainer.appendChild(shortcutName);
      shortcutsContainer.appendChild(shortcutContainer);
    });
    shortcutsContainer.appendChild(addShortcutButton);
  }
  
  function saveShortcut(name, url, icon) {
    const savedShortcuts = JSON.parse(localStorage.getItem('shortcuts')) || defaultShortcuts;
    if (editIndex !== null) {
      savedShortcuts[editIndex] = { name, url, icon };
      editIndex = null;
    } else {
      savedShortcuts.push({ name, url, icon });
    }
    localStorage.setItem('shortcuts', JSON.stringify(savedShortcuts));
    loadShortcuts();
  }

  function getFaviconUrl(url) {
    const urlObj = new URL(url);
    return `${urlObj.origin}/favicon.ico`;
  }

  searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    if (query) {
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    }
  });

  searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      searchButton.click();
    }
  });

  addShortcutButton.addEventListener('click', () => {
    editIndex = null;
    dialogShortcutName.value = '';
    dialogShortcutUrl.value = '';
    dialogContainer.style.display = 'block';
  });

  dialogAddButton.addEventListener('click', () => {
    const name = dialogShortcutName.value;
    const url = dialogShortcutUrl.value;
    const icon = getFaviconUrl(url);
    if (name && url) {
      saveShortcut(name, url, icon);
      dialogShortcutName.value = '';
      dialogShortcutUrl.value = '';
      dialogContainer.style.display = 'none';
    }
  });

  dialogCancelButton.addEventListener('click', () => {
    dialogContainer.style.display = 'none';
  });

  loadShortcuts();
});