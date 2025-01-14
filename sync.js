document.addEventListener('DOMContentLoaded', () => {
  const syncSettings = document.getElementById('sync-settings');
  
  document.getElementById('add-sync-button').addEventListener('click', () => {
    document.getElementById('sync-settings').style.display = 'block';
  });

  document.querySelector('.sync-lta-button').addEventListener('click', () => {
    const localShortcuts = JSON.parse(localStorage.getItem('shortcuts')) || [];
    if (localShortcuts.length > 0) {
      const confirmSync = confirm(`Are you sure you want to overwrite ${localShortcuts.length} items from local storage to account shortcuts?`);
      if (confirmSync) {
        // localStorage의 shortcuts를 chrome.storage.sync에 저장
        chrome.storage.local.set({ shortcuts: localShortcuts }, () => {
          // chrome.storage.local의 데이터를 chrome.storage.sync에 저장
          chrome.storage.local.get(null, (localData) => {
            chrome.storage.sync.set(localData, () => {
              location.reload();
              alert(`Successfully overwritten ${localShortcuts.length} items from local storage to account shortcuts.`);
            });
          });
        });
      }
    } else {
      alert('No items to overwrite from local storage.');
    }
  });
  document.querySelector('.sync-atl-button').addEventListener('click', () => {
    chrome.storage.sync.get(null, (data) => {
      const syncShortcuts = data.shortcuts || [];
      if (syncShortcuts.length > 0) {
        const confirmSync = confirm(`Are you sure you want to overwrite ${syncShortcuts.length} items from account shortcuts to local storage?`);
        if (confirmSync) {
          localStorage.setItem('shortcuts', JSON.stringify(syncShortcuts));
          chrome.storage.local.set(data, () => {
            location.reload();
            alert(`Successfully overwritten ${syncShortcuts.length} items from account shortcuts to local storage.`);
          });
        }
      } else {
        alert('No items to overwrite from account.');
      }
    });
  });

  document.querySelector('.sync-tab-button').addEventListener('click', () => {
    syncSettings.style.display = 'none';
  });
});