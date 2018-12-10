ons.ready(async () => {
  // ディレクトリを取得
  const dir = await getDir();
  // ディレクトリ内にあるPDFファイルを取得
  const files = await getFiles(dir);
  // PDFを一覧表示
  showFiles(files);
  // ダウンロードボタンを押した時のアクション
  $('#download').on('click', async () => {
    // 入力されているURLを取得
    const url = $('#url').val();
    // オンライン上のデータを取得&保存
    await getFile(url, dir);
    // ディレクトリ内にあるPDFファイルを取得
    const files = await getFiles(dir);
    // 表示を更新
    showFiles(files);
  });
});

// PDFファイルを表示するイベント
$(document).on('click', '.file div', (e) => {
  const path = $(e.target).parent('.file').data('path');
  // ドキュメントビューワーで表示
  cordova.plugins.SitewaertsDocumentViewer.viewDocument(path, 'application/pdf');
});

// ファイル一覧を表示
const showFiles = (files) => {
  const ary = [];
  for (const file of files) {
    if (!file.isFile) continue;
    ary.push(`
      <ons-list-item class="file" data-path="${file.nativeURL}" tappable>
        ${file.name}
      </ons-list-item>
    `);
  }
  $('#files').empty().html(ary.join(''));
}

// ローカルのファイル一覧を取得
const getFiles = async (dir) => {
  return new Promise((res, rej) => {
    const reader = new DirectoryReader(dir.toURL());
    reader.readEntries(res, rej);
  });
}

// ディレクトリを取得
const getDir = async () => {
  return new Promise((res, rej) => {
    const dir = `${cordova.file.applicationStorageDirectory}/Documents/`;
    resolveLocalFileSystemURL(dir, res, rej);
  });
}

// オンライン上のPDFファイルを取得して保存
const getFile = async (url, dir) => {
  return new Promise((res, rej) => {
    const fileTransfer = new FileTransfer();
    const fileName = url.replace(/.*\/(.*?\.pdf)/, "$1");
    fileTransfer.download(url, `${dir.toURL()}/${fileName}`, res, rej);
  });
}