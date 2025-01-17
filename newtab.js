document.addEventListener('DOMContentLoaded', () => {
  const shortcutsContainer = document.getElementById('shortcuts');
  const searchInput = document.getElementById('search-input');
  const addShortcutButton = document.createElement('div');
  addShortcutButton.id = 'add-shortcut-button';
  const addOptionButton = document.createElement('div');
  addOptionButton.id = 'add-option-button';
  const addSyncButton = document.createElement('div');
  addSyncButton.id = 'add-sync-button';
  const dialogContainer = document.getElementById('dialog-container');
  const dialogShortcutName = document.getElementById('dialog-shortcut-name');
  const dialogShortcutUrl = document.getElementById('dialog-shortcut-url');
  const dialogAddButton = document.getElementById('dialog-add-button');
  const dialogCancelButton = document.getElementById('dialog-cancel-button');

  let editIndex = null;

  const defaultShortcuts = [
    { name: 'Google', url: 'https://www.google.com', icon: 'defaulticon/google.png' },
    { name: 'YouTube', url: 'https://www.youtube.com', icon: 'defaulticon/youtube.png' },
    { name: 'Facebook', url: 'https://www.facebook.com', icon: 'defaulticon/facebook.png' },
    { name: 'Twitter', url: 'https://www.twitter.com', icon: 'defaulticon/x.png' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com', icon: 'defaulticon/linkedin.png' },
    { name: 'GitHub', url: 'https://www.github.com', icon: 'defaulticon/github.png' },
    { name: 'Reddit', url: 'https://www.reddit.com', icon: 'defaulticon/reddit.png' },
    { name: 'StackOverflow', url: 'https://stackoverflow.com', icon: 'defaulticon/stackoverflow.png' },
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
      shortcutContainer.classList.add('draggable');
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

    const fakecontainer3 = document.createElement('div');
    fakecontainer3.className = 'fake-container';
    fakecontainer3.appendChild(addSyncButton);
    shortcutsContainer.appendChild(fakecontainer3);


    
  const shortcutContainers = document.querySelectorAll('.shortcut-container');
  let dragSrcEl = null;
  let dragSrcIndex = null;
  let dragDstIndex = null;
  
  // 드래그 시작 이벤트
  shortcutContainers.forEach((container, index) => {
    container.setAttribute('draggable', true); // 드래그 가능하도록 설정
    container.addEventListener('dragstart', function (e) {
      dragSrcEl = this;
      dragSrcIndex = index;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', this.innerHTML);
    });
  
    // 드래그 대상 위로 이동 시
    container.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });
  
    // 드롭 이벤트
    container.addEventListener('drop', function (e) {
      e.stopPropagation();
      if (dragSrcEl !== this) {
        dragDstIndex = Array.from(shortcutContainers).indexOf(this);
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');
        saveOrder(dragSrcIndex, dragDstIndex);
        loadShortcuts();
      }
      return false;
    });
  });
  
  // 순서 저장 함수
  function saveOrder(srcIndex, dstIndex) {
    const shortcuts = JSON.parse(localStorage.getItem('shortcuts')) || [];
    swapArrayElements(shortcuts, srcIndex, dstIndex);
    localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
    
  }
  
  // 배열에서 두 항목의 위치를 서로 바꾸는 함수
  function swapArrayElements(arr, index1, index2) {
    const temp = arr[index1];
    arr.splice(index1,1);
    arr.splice(index2,0,temp);
  }
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
    return new Promise((resolve, reject) => {
      if (!navigator.onLine) {
        resolve('defaulticon/default.png');
        return;
      }
      try {
        const urlObj = new URL(url);
        const googleFaviconUrl = `http://www.google.com/s2/favicons?sz=32&domain=${urlObj.origin}`;
        const originFaviconUrl = `${urlObj.origin}/favicon.ico`;
  
        // Favicon을 불러오는 로직 추가
        const img = new Image();
        img.src = googleFaviconUrl;
        img.onload = () => {
          resolve(googleFaviconUrl);
        };
        img.onerror = () => {
          const imgFallback = new Image();
          imgFallback.src = originFaviconUrl;
          imgFallback.onload = () => {
            resolve(originFaviconUrl);
          };
          imgFallback.onerror = () => {
            resolve('defaulticon/default.png');
          };
        };
      } catch (e) {
        resolve('defaulticon/default.png'); // 기본 아이콘 URL
      }
    });
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

  async function handleAddShortcut() {
    const name = dialogShortcutName.value;
    let url = dialogShortcutUrl.value;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    if (name && url) {
      icon = await getFaviconUrl(url);
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