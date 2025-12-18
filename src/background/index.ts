/**
 * プライバシー一発クリーン - バックグラウンドスクリプト
 * クリーンアップ処理を実行する
 */

import { CleanupSettings, CleanupResult, CleanupMessage } from '../types';

/**
 * ブラウジングデータを削除する
 */
async function performCleanup(settings: CleanupSettings): Promise<CleanupResult> {
  const startTime = Date.now();
  const deletedItems: string[] = [];

  try {
    // 削除対象のデータタイプを構築
    const dataToRemove: chrome.browsingData.DataTypeSet = {};

    if (settings.cookies) {
      dataToRemove.cookies = true;
      deletedItems.push('クッキー');
    }

    if (settings.cache) {
      dataToRemove.cache = true;
      deletedItems.push('キャッシュ');
    }

    if (settings.history) {
      dataToRemove.history = true;
      deletedItems.push('閲覧履歴');
    }

    if (settings.downloads) {
      dataToRemove.downloads = true;
      deletedItems.push('ダウンロード履歴');
    }

    if (settings.formData) {
      dataToRemove.formData = true;
      deletedItems.push('フォームデータ');
    }

    if (settings.localStorage) {
      dataToRemove.localStorage = true;
      deletedItems.push('ローカルストレージ');
    }

    // パスワード保護がオフの場合のみパスワードを削除
    if (!settings.protectPasswords) {
      dataToRemove.passwords = true;
      deletedItems.push('パスワード');
    }

    // 削除対象がない場合
    if (Object.keys(dataToRemove).length === 0) {
      return {
        success: false,
        message: '削除対象が選択されていません',
        timestamp: Date.now(),
      };
    }

    // 全期間のデータを削除
    await chrome.browsingData.remove(
      { since: 0 }, // 全期間
      dataToRemove
    );

    const elapsedTime = Date.now() - startTime;
    const itemsText = deletedItems.join('、');

    return {
      success: true,
      message: `${itemsText}を削除しました (${elapsedTime}ms)`,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('クリーンアップエラー:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'クリーンアップに失敗しました',
      timestamp: Date.now(),
    };
  }
}

// メッセージリスナー
chrome.runtime.onMessage.addListener(
  (message: CleanupMessage, _sender, sendResponse) => {
    if (message.type === 'CLEANUP') {
      // 非同期処理を実行
      performCleanup(message.settings)
        .then((result) => {
          sendResponse({ type: 'CLEANUP_RESULT', result });
        })
        .catch((error) => {
          sendResponse({
            type: 'CLEANUP_RESULT',
            result: {
              success: false,
              message: error instanceof Error ? error.message : '予期しないエラーが発生しました',
              timestamp: Date.now(),
            },
          });
        });

      // 非同期レスポンスを示すためにtrueを返す
      return true;
    }
    return false;
  }
);

// インストール時の処理
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('プライバシー一発クリーンがインストールされました');
  } else if (details.reason === 'update') {
    console.log('プライバシー一発クリーンが更新されました');
  }
});
