
document.addEventListener('DOMContentLoaded', () => {



// 북마크 데이터를 가져와 화면에 표시하는 함수

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

