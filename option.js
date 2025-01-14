document.addEventListener('DOMContentLoaded', () => {

document.getElementById('add-option-button').addEventListener('click', () => {
    editIndex = null;
    document.getElementById('background-settings').style.display = 'block';
  });
  const STORAGE_KEY_GMAIL_UI = 'gmailUISettings';
  const STORAGE_KEY_IMAGE_UI = 'imageUISettings';
  
  const STORAGE_KEY_BACKGROUND = 'backgroundSettings';
  const STORAGE_KEY_TEXT_COLOR = 'textColorSettings';
  const STORAGE_KEY_LINE_COLOR = 'lineColorSettings';
  const DEFAULT_BACKGROUND = {
    type: 'color',
    value: '#000000'
  };
  
  // DOM 요소
  const backgroundSettings = document.getElementById('background-settings');
  const backgroundTypeInputs = document.querySelectorAll('input[name="background-type"]');
  const textColorSettings = document.getElementById('text-color-settings');
  const lineColorSettings = document.getElementById('line-color-settings');
  const colorSection = document.getElementById('colorSection');
  const imageSection = document.getElementById('imageSection');
  const colorOptions = document.querySelectorAll('.color-option');
  const customColorInput = document.querySelector('.custom-color');
  const fileInput = document.querySelector('input[type="file"]');
  const preview = document.querySelector('.preview');
  const saveButton = document.querySelector('.save-button');
  const resetButton = document.querySelector('.reset-button');
  const addOptionButton = document.getElementById('add-option-button');
  const textColorPicker = document.getElementById('text-color-picker');
  const lineColorPicker = document.getElementById('line-color-picker');
  const gmailTypeInputs = document.querySelectorAll('input[name="gmail-type"]'); // 추가
  const imageTypeInputs = document.querySelectorAll('input[name="image-type"]'); // 추가
  
  
  
  
  textColorPicker.addEventListener('input', async (e) => {
    const color = e.target.value;
    document.querySelectorAll('.shortcut-container span').forEach(span => {
      span.style.color = color;
    });
    document.querySelectorAll('.nav-item').forEach(item => {
      item.style.color = color;
    });
    try {
      await chrome.storage.local.set({ [STORAGE_KEY_TEXT_COLOR]: color });
    } catch (error) {
      console.error('Error saving text color:', error);
    }
  });

  
  lineColorPicker.addEventListener('input', async (e) => {
    const color = e.target.value;
    document.querySelector('#search-input').style.borderColor = color;
    try {
      await chrome.storage.local.set({ [STORAGE_KEY_LINE_COLOR]: color });
    } catch (error) {
      console.error('Error saving line color:', error);
    }
  });



  // 기존 배경화면 설정 초기화 코드...
  async function initializeBackgroundSettings() {
    try {
      const result = await chrome.storage.local.get([STORAGE_KEY_BACKGROUND, STORAGE_KEY_TEXT_COLOR, STORAGE_KEY_GMAIL_UI, STORAGE_KEY_IMAGE_UI, STORAGE_KEY_LINE_COLOR]);
      const settings = result[STORAGE_KEY_BACKGROUND] || DEFAULT_BACKGROUND;
      applyBackgroundSettings(settings);

      // 저장된 텍스트 색상 불러오기
      const savedTextColor = result[STORAGE_KEY_TEXT_COLOR];
      const savedLineColor = result[STORAGE_KEY_LINE_COLOR];
      if (savedTextColor) {
        textColorPicker.value = savedTextColor;
        document.querySelectorAll('.shortcut-container span').forEach(span => {
          span.style.color = savedTextColor;
        });
        document.querySelectorAll('.nav-item').forEach(item => {
          item.style.color = savedTextColor;
        });
      }

      if (savedLineColor) {
        lineColorPicker.value = savedLineColor;
        document.querySelector('#search-input').style.borderColor = savedLineColor;
      }

      if (settings.type === 'color') {
        document.querySelector('input[name="background-type"][value="color"]').checked = true;
        colorSection.style.display = 'block';
        imageSection.style.display = 'none';
        customColorInput.value = settings.value;
      } else if (settings.type === 'image') {
        document.querySelector('input[name="background-type"][value="image"]').checked = true;
        colorSection.style.display = 'none';
        imageSection.style.display = 'block';
        preview.innerHTML = `<img src="${settings.value}" alt="Preview">`;
      }
      const savedGmailUI = result[STORAGE_KEY_GMAIL_UI];
      if (savedGmailUI) {
        document.querySelector(`input[name="gmail-type"][value="${savedGmailUI}"]`).checked = true;
        const gmailElement = document.getElementById('nav-gmail');
        if (savedGmailUI === 'gmailyes') {
          gmailElement.style.display = 'block';
        } else {
          gmailElement.style.display = 'none';
        }
      }
      
      const savedImageUI = result[STORAGE_KEY_IMAGE_UI];
      if (savedImageUI) {
        document.querySelector(`input[name="image-type"][value="${savedImageUI}"]`).checked = true;
        const imageElement = document.getElementById('nav-image');
        if (savedImageUI === 'imageyes') {
          imageElement.style.display = 'block';
        } else {
          imageElement.style.display = 'none';
        }
      }


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
    initializeBackgroundSettings(); // 초기화 함수 호출
  });
  
  // 배경 타입 변경 이벤트
// 배경 타입 변경 이벤트 핸들러 추가
backgroundTypeInputs.forEach(input => {
  input.addEventListener('change', (e) => {
    if (e.target.value === 'color') {
      colorSection.style.display = 'block';
      imageSection.style.display = 'none';
    } else if (e.target.value === 'image') {
      colorSection.style.display = 'none';
      imageSection.style.display = 'block';
    }
  });
});

gmailTypeInputs.forEach(input => {
  input.addEventListener('change', async (e) => {
    const gmailUI = e.target.value;
    try {
      await chrome.storage.local.set({ [STORAGE_KEY_GMAIL_UI]: gmailUI });
      const gmailElement = document.getElementById('nav-gmail');
      if (gmailUI === 'gmailyes') {
        gmailElement.style.display = 'block';
      } else {
        gmailElement.style.display = 'none';
      }
    } catch (error) {
      console.error('Error saving Gmail UI settings:', error);
    }
  });
});

// Image UI 설정 변경 이벤트 핸들러 추가
imageTypeInputs.forEach(input => {
  input.addEventListener('change', async (e) => {
    const imageUI = e.target.value;
    try {
      await chrome.storage.local.set({ [STORAGE_KEY_IMAGE_UI]: imageUI });
      const imageElement = document.getElementById('nav-image');
      if (imageUI === 'imageyes') {
        imageElement.style.display = 'block';
      } else {
        imageElement.style.display = 'none';
      }
    } catch (error) {
      console.error('Error saving Image UI settings:', error);
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
        alert('Select an image file');
        return;
      }
    }
  
    await saveBackgroundSettings(settings);
    backgroundSettings.style.display = 'none';
  });
  
  // 초기화 버튼 클릭 이벤트
  resetButton.addEventListener('click', async () => {
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
    arr[index1] = arr[index2];
    arr[index2] = temp;
  }
  

  initializeBackgroundSettings();

});

/* Save settings
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