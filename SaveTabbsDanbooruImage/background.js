// メッセージを受信するためのリスナーを追加
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => 
{
  if (message.action === 'download_images') 
  {
    // danbooru.donmai.us のタブを検索
    chrome.tabs.query({ url: '*://danbooru.donmai.us/*' }, (tabs) => 
    {
      // 各タブに対してスクリプトを実行
        tabs.forEach(tab => 
        {
          // タブのURLに「page」が含まれていないタブのみ処理を行う
          if (!tab.url.includes('page')) 
          {
            // スクリプトを実行
            chrome.scripting.executeScript(
            {
              target: { tabId: tab.id },
              function: downloadImagesFromDanbooru
            });
            // タブを閉じる
            closeTab(tab);
          }
        });
    });
  }
   else if (message.action === 'get_tab_titles') 
  {
    // すべてのタブを検索
    chrome.tabs.query({}, (tabs) => {
      // 各タブのタイトルを取得
      let titles = tabs.map(tab => tab.title);
      // ポップアップスクリプトにメッセージを送信してアラートを表示
      chrome.runtime.sendMessage({
        action: 'show_alert',
        data: "Tab Titles:\n" + titles.join("\n")
      });
    });
  } else if (message.action === 'download_urls') {
    // メッセージから受け取ったURLの配列を取得
    const urls = message.urls;
    // 各URLについてダウンロードを行う
    urls.forEach((url, index) => {
      chrome.downloads.download({
        // ダウンロードするURLを設定
        url: url,
        // ダウンロード時の競合解決方法を設定
        conflictAction: 'uniquify'
      });
    });
  }
});
  
// タブを閉じる関数
function closeTab(tab) {
  // 渡されたタブ情報を使用してタブを閉じる
  chrome.tabs.remove(tab.id, function() {
    console.log('Tab closed successfully: ' + tab.id);
  });
}


  // danbooru.donmai.us のページから画像をダウンロードする関数
  function downloadImagesFromDanbooru() {
    // タブのURLをコンソールに出力
    console.log(document.URL);


    // .fit-width クラスの画像要素を取得
    const fitWidthImages = document.querySelectorAll('.fit-width');
    // .image-view-original-link クラスのリンク要素を取得
    const originalLinkImages = document.querySelectorAll('.image-view-original-link');
  
    // ダウンロードする画像の URL を格納する配列
    const images = [];
    //console.log(originalLinkImages[0].currentSrc);
    console.log(fitWidthImages[0].currentSrc);

  
    // .image-view-original-link クラスの要素が存在する場合
    if (originalLinkImages.length > 0) 
    {
      // リンク要素の href 属性を取得して配列に追加
      console.log(originalLinkImages[0].href);
      images.push(originalLinkImages[0].href);
    } else {
      // .fit-width クラスの画像要素が存在する場合、その src 属性を取得して配列に追加
      console.log(fitWidthImages[0].currentSrc);
      images.push(fitWidthImages[0].currentSrc);
    }
  
    // 取得した画像 URL をバックグラウンドスクリプトに送信してダウンロードをトリガー
    chrome.runtime.sendMessage({ action: 'download_urls', urls: images });
  }
  