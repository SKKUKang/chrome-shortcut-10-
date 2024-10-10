document.addEventListener('DOMContentLoaded', () => {
  const shortcutsContainer = document.getElementById('shortcuts');
  const searchInput = document.getElementById('search-input');
  const addShortcutButton = document.createElement('div');
  addShortcutButton.id = 'add-shortcut-button';
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

document.addEventListener('DOMContentLoaded', () => {
  const settingsIcon = document.getElementById('settings-icon');
const settingsDialog = document.getElementById('settings-dialog');
const backgroundColorInput = document.getElementById('background-color');
const backgroundImageInput = document.getElementById('background-image');
const saveBackgroundColorSettingsButton = document.getElementById('save-background-color-settings');
const saveBackgroundImageSettingsButton = document.getElementById('save-background-image-settings');
const resetBackgroundSettingsButton = document.getElementById('reset-background-settings');
const closeSettingsDialogButton = document.getElementById('close-settings-dialog');

// Show settings dialog on settings icon click
settingsIcon.addEventListener('click', () => {
  settingsDialog.style.display = 'block';
});

// Save settings
saveBackgroundColorSettingsButton.addEventListener('click', () => {
  const backgroundColor = backgroundColorInput.value;
  localStorage.setItem('backgroundColor', backgroundColor);
  localStorage.removeItem('backgroundImage'); // Remove background image if only color is set
  applyBackgroundSettings();
  settingsDialog.style.display = 'none'; // Close dialog after saving

});


saveBackgroundImageSettingsButton.addEventListener('click', () => {
  const backgroundImageFile = backgroundImageInput.files[0];
  const reader = new FileReader();
  reader.onload = function(event) {
      const backgroundImage = event.target.result;
      localStorage.setItem('backgroundImage', backgroundImage);
      localStorage.removeItem('backgroundColor', backgroundColor); // Save color as well
      applyBackgroundSettings();
      settingsDialog.style.display = 'none'; // Close dialog after saving

    reader.readAsDataURL(backgroundImageFile);
  } 
});


// Reset settings
resetBackgroundSettingsButton.addEventListener('click', () => {
  localStorage.removeItem('backgroundColor');
  localStorage.removeItem('backgroundImage');
  document.body.style.backgroundColor = '';
  document.body.style.backgroundImage = '';
});

// Close settings dialog
closeSettingsDialogButton.addEventListener('click', () => {
  settingsDialog.style.display = 'none';
});

// Apply background settings
function applyBackgroundSettings() {
  const backgroundColor = localStorage.getItem('backgroundColor');
  const backgroundImage = localStorage.getItem('backgroundImage');
  if (backgroundImage) {
    document.body.style.backgroundImage = `url(${backgroundImage})`;
    document.body.style.backgroundSize = 'cover';
  } else if (backgroundColor) {
    document.body.style.backgroundColor = backgroundColor;
    document.body.style.backgroundImage = '';
  }
}

applyBackgroundSettings();

// Load bookmarks
function loadBookmarks() {
  if (chrome.bookmarks) {
    chrome.bookmarks.getTree((bookmarkTreeNodes) => {
      displayBookmarks(bookmarkTreeNodes);
    });
  } else {
    console.error('Bookmarks API is not available');
  }
}
function displayBookmarks(bookmarkNodes) {
  const bookmarksContainer = document.getElementById('shortcuts');
  bookmarksContainer.innerHTML = '';
  bookmarkNodes.forEach((node) => {
    if (node.children) {
      displayBookmarks(node.children);
    } else {
      const bookmarkElement = document.createElement('a');
      bookmarkElement.href = node.url;
      bookmarkElement.textContent = node.title;
      bookmarksContainer.appendChild(bookmarkElement);
    }
  });
}

loadBookmarks();
});