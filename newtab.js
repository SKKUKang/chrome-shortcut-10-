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

      shortcutElement.appendChild(shortcutImage);
      shortcutContainer.appendChild(shortcutElement);
      shortcutContainer.appendChild(shortcutName);
      shortcutsContainer.appendChild(shortcutContainer);
    });
    shortcutsContainer.appendChild(addShortcutButton);
    shortcutsContainer.appendChild(addOptionButton);
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




document.getElementById('add-option-button').addEventListener('click', () => {
  editIndex = null;
  document.getElementById('background-settings').style.display = 'block';
});

const STORAGE_KEY_BACKGROUND = 'backgroundSettings';
const DEFAULT_BACKGROUND = {
  type: 'color',
  value: '#000000'
};

// DOM 요소
const backgroundSettings = document.getElementById('background-settings');
const backgroundTypeInputs = document.querySelectorAll('input[name="background-type"]');
const colorSection = document.getElementById('colorSection');
const imageSection = document.getElementById('imageSection');
const colorOptions = document.querySelectorAll('.color-option');
const customColorInput = document.querySelector('.custom-color');
const fileInput = document.querySelector('input[type="file"]');
const preview = document.querySelector('.preview');
const saveButton = document.querySelector('.save-button');
const resetButton = document.querySelector('.reset-button');


// 배경화면 설정 초기화
async function initializeBackgroundSettings() {
  try {
    const result = await chrome.storage.local.get(STORAGE_KEY_BACKGROUND);
    const settings = result[STORAGE_KEY_BACKGROUND] || DEFAULT_BACKGROUND;
    applyBackgroundSettings(settings);
  } catch (error) {
    console.error('Error loading background settings:', error);
  }
}

// 배경화면 설정 적용
function applyBackgroundSettings(settings) {
  if (settings.type === 'color') {
    document.body.style.backgroundColor = settings.value;
    document.body.style.backgroundImage = '';
  } else if (settings.type === 'image') {
    document.body.style.backgroundImage = `url(${settings.value})`;
    document.body.style.backgroundSize = 'cover';
  }
}

// 배경화면 설정 저장
async function saveBackgroundSettings(settings) {
  try {
    await chrome.storage.local.set({
      [STORAGE_KEY_BACKGROUND]: settings
    });
    applyBackgroundSettings(settings);
  } catch (error) {
    console.error('Error saving background settings:', error);
  }
}
// 이벤트 리스너
addOptionButton.addEventListener('click', () => {
  backgroundSettings.style.display = 'block';
});

// 배경 타입 변경 이벤트
backgroundTypeInputs.forEach(input => {
  input.addEventListener('change', (e) => {
    if (e.target.value === 'color') {
      colorSection.classList.remove('hidden');
      imageSection.classList.add('hidden');
    } else {
      colorSection.classList.add('hidden');
      imageSection.classList.remove('hidden');
    }
  });
});

// 색상 선택 이벤트
colorOptions.forEach(option => {
  option.addEventListener('click', () => {
    colorOptions.forEach(opt => opt.classList.remove('selected'));
    option.classList.add('selected');
    customColorInput.value = rgbToHex(option.style.backgroundColor);
  });
});

// 커스텀 색상 선택 이벤트
customColorInput.addEventListener('input', (e) => {
  colorOptions.forEach(opt => opt.classList.remove('selected'));
});

// 이미지 업로드 이벤트
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
    };
    reader.readAsDataURL(file);
  }
});

// 저장 버튼 클릭 이벤트
saveButton.addEventListener('click', async () => {
  const backgroundType = document.querySelector('input[name="background-type"]:checked').value;
  let settings = { type: backgroundType };

  if (backgroundType === 'color') {
    const selectedColor = document.querySelector('.color-option.selected');
    settings.value = selectedColor ? 
      rgbToHex(selectedColor.style.backgroundColor) : 
      customColorInput.value;
  } else {
    const previewImg = preview.querySelector('img');
    if (previewImg) {
      settings.value = previewImg.src;
    } else {
      alert('이미지를 선택해주세요.');
      return;
    }
  }

  await saveBackgroundSettings(settings);
  backgroundSettings.style.display = 'none';
});

// 초기화 버튼 클릭 이벤트
resetButton.addEventListener('click', async () => {
  await saveBackgroundSettings(DEFAULT_BACKGROUND);
  initializeBackgroundSettings();
  backgroundSettings.style.display = 'none';
});

// 다이얼로그 외부 클릭시 닫기
document.addEventListener('click', (e) => {
  if (e.target === backgroundSettings) {
    backgroundSettings.style.display = 'none';
  }
});

// RGB to Hex 변환 유틸리티 함수
function rgbToHex(rgb) {
  // rgb(r, g, b) 형식에서 숫자만 추출
  const [r, g, b] = rgb.match(/\d+/g).map(Number);
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// ESC 키로 다이얼로그 닫기
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && backgroundSettings.style.display === 'block') {
    backgroundSettings.style.display = 'none';
  }
});

applyBackgroundSettings({
  type: localStorage.getItem('backgroundImage') ? 'image' : 'color',
  value: localStorage.getItem('backgroundImage') || localStorage.getItem('backgroundColor')
});

/*

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
*/


// 북마크 데이터를 가져와 화면에 표시하는 함수
/*
function displayBookmarks() {
  console.log('displayBookmarks');
  chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
    let bookmarksContainer = document.getElementById('bookmarks');
    bookmarksContainer.innerHTML = '';  // 기존 내용을 초기화
    
    bookmarkTreeNodes.forEach(function(node) {
      bookmarksContainer.appendChild(createBookmarkNode(node));
    });
  });
}

// 북마크 노드를 생성하는 함수 (폴더 구조 유지)
function createBookmarkNode(bookmarkNode) {
  console.log('createBookmarkNode');
  let li = document.createElement('li');
  if (bookmarkNode.title) {
    li.textContent = bookmarkNode.title;
  }
  
  // 자식 노드(폴더나 북마크)가 있으면 그들도 표시
  if (bookmarkNode.children && bookmarkNode.children.length > 0) {
    let ul = document.createElement('ul');
    for (let i = 0; i < bookmarkNode.children.length; i++) {
      ul.appendChild(createBookmarkNode(bookmarkNode.children[i]));
    }
    li.appendChild(ul);
  }

  // 북마크라면 링크를 설정
  if (bookmarkNode.url) {
    let a = document.createElement('a');
    a.href = bookmarkNode.url;
    a.textContent = bookmarkNode.title;
    a.target = '_blank';  // 새 탭에서 열기
    li.appendChild(a);
  }

  return li;
}

displayBookmarks();
});

*/ });  