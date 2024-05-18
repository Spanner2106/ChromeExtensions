// タブを閉じる関数
export function closeTab(tab) {
    // 渡されたタブ情報を使用してタブを閉じる
    chrome.tabs.remove(tab.id, function() {
      console.log('Tab closed successfully: ' + tab.id);
    });
  }