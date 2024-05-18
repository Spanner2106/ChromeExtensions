document.addEventListener('DOMContentLoaded', function() {
    // 「Download Images」ボタンがクリックされたときのイベントリスナーを追加
    document.getElementById('download-images').addEventListener('click', function() {
      // バックグラウンドスクリプトにメッセージを送信し、画像をダウンロードするアクションをトリガー
      chrome.runtime.sendMessage({ action: 'download_images' });
    });
  
    // 「Get Tab Titles」ボタンがクリックされたときのイベントリスナーを追加
    document.getElementById('get-tab-titles').addEventListener('click', function() {
      // バックグラウンドスクリプトにメッセージを送信し、タブのタイトルを取得するアクションをトリガー
      chrome.runtime.sendMessage({ action: 'get_tab_titles' });
    });
  
    // バックグラウンドスクリプトからのメッセージを受信
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'show_alert') {
        // アラートを表示する
        alert(message.data);
      }
    });
  });
  