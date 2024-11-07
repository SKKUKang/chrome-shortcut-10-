document.addEventListener('DOMContentLoaded', () => {
  const shortcutsContainer = document.getElementById('shortcuts');
  const searchInput = document.getElementById('search-input');
  const addShortcutButton = document.createElement('div');
  addShortcutButton.id = 'add-shortcut-button';
  const addOptionButton = document.createElement('div');
  addOptionButton.id = 'add-option-button';
  const dialogContainer = document.getElementById('dialog-container');
  const dialogShortcutName = document.getElementById('dialog-shortcut-name');
  const dialogShortcutUrl = document.getElementById('dialog-shortcut-url');
  const dialogAddButton = document.getElementById('dialog-add-button');
  const dialogCancelButton = document.getElementById('dialog-cancel-button');

  let editIndex = null;

  const defaultShortcuts = [
    { name: 'Google', url: 'https://www.google.com', icon: 'http://www.google.com/s2/favicons?sz=32&domain=google.com' },
    { name: 'YouTube', url: 'https://www.youtube.com', icon: 'http://www.google.com/s2/favicons?sz=32&domain=youtube.com'},
    { name: 'Facebook', url: 'https://www.facebook.com', icon: 'http://www.google.com/s2/favicons?sz=32&domain=facebook.com'},
    { name: 'Twitter', url: 'https://www.twitter.com', icon: 'http://www.google.com/s2/favicons?sz=32&domain=twitter.com' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com', icon: 'http://www.google.com/s2/favicons?sz=32&domain=linkedin.com' },
    { name: 'GitHub', url: 'https://www.github.com', icon: 'http://www.google.com/s2/favicons?sz=32&domain=github.com' },
    { name: 'Reddit', url: 'https://www.reddit.com', icon: 'http://www.google.com/s2/favicons?sz=32&domain=reddit.com' },
    { name: 'StackOverflow', url: 'https://stackoverflow.com', icon: 'http://www.google.com/s2/favicons?sz=32&domain=stackoverflow.com' },
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
      shortcutImage.src = shortcut.icon || getFaviconUrl(shortcut.url);
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

      chrome.storage.local.get('textColorSettings', (result) => {
        const savedTextColor = result.textColorSettings;
        if (savedTextColor) {
          document.querySelectorAll('.shortcut-container span').forEach(span => {
            span.style.color = savedTextColor;
          });
        }
      });


      shortcutElement.appendChild(shortcutImage);
      shortcutContainer.appendChild(shortcutElement);
      shortcutContainer.appendChild(shortcutName);
      shortcutsContainer.appendChild(shortcutContainer);
     
    });
    const fakecontainer = document.createElement('div');
    fakecontainer.className = 'fake-container';
    fakecontainer.appendChild(addShortcutButton);
    shortcutsContainer.appendChild(fakecontainer);

    const fakecontainer2 = document.createElement('div');
    fakecontainer2.className = 'fake-container';
    fakecontainer2.appendChild(addOptionButton);
    shortcutsContainer.appendChild(fakecontainer2);
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
    try {
      const urlObj = new URL(url);
      const googleFaviconUrl = `http://www.google.com/s2/favicons?sz=32&domain=${urlObj.origin}`;
      const originFaviconUrl = `${urlObj.origin}/favicon.ico`;
      if(googleFaviconUrl){
        return googleFaviconUrl;
      }else{
        return originFaviconUrl;

      }
    } catch (e) {
      return 'default-icon.png'; // 기본 아이콘 URL
    }
  }

  searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const query = searchInput.value;
      if (query) {
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      }
    }
  });

  addShortcutButton.addEventListener('click', () => {
    editIndex = null;
    dialogShortcutName.value = '';
    dialogShortcutUrl.value = '';
    dialogContainer.style.display = 'block';
  });





  function handleAddShortcut() {
    const name = dialogShortcutName.value;
    let url = dialogShortcutUrl.value;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    const icon = getFaviconUrl(url);
    if (name && url) {
      saveShortcut(name, url, icon);
      dialogShortcutName.value = '';
      dialogShortcutUrl.value = '';
      dialogContainer.style.display = 'none';
    }
  }

  dialogAddButton.addEventListener('click', handleAddShortcut);

  dialogShortcutUrl.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      handleAddShortcut();
    }
  });

  dialogShortcutName.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      handleAddShortcut();
    }
  });


  dialogCancelButton.addEventListener('click', () => {
    dialogContainer.style.display = 'none';
  });

  loadShortcuts();






});  