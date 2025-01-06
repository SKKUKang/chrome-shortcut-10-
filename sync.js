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
        chrome.storage.sync.set({ shortcuts: localShortcuts }, () => {
          
          alert(`Successfully overwritten ${localShortcuts.length} items from local storage to account shortcuts.`);
          location.reload();
        });
      }
    } else {
      alert('No items to overwrite from local storage.');
    }
  });

  document.querySelector('.sync-atl-button').addEventListener('click', () => {
    chrome.storage.sync.get('shortcuts', (data) => {
      const syncShortcuts = data.shortcuts || [];
      if (syncShortcuts.length > 0) {
        const confirmSync = confirm(`Are you sure you want to overwrite ${syncShortcuts.length} items from account shortcuts to local storage?`);
        if (confirmSync) {
          localStorage.setItem('shortcuts', JSON.stringify(syncShortcuts));
          
          alert(`Successfully overwritten ${syncShortcuts.length} items from account shortcuts to local storage.`);
          location.reload();
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