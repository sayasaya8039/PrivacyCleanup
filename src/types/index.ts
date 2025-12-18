/**
 * クリーンアップ設定の型定義
 */
export interface CleanupSettings {
  /** クッキーを削除するか */
  cookies: boolean;
  /** キャッシュを削除するか */
  cache: boolean;
  /** 閲覧履歴を削除するか */
  history: boolean;
  /** ダウンロード履歴を削除するか */
  downloads: boolean;
  /** フォームデータを削除するか */
  formData: boolean;
  /** パスワードを保護するか（削除しない） */
  protectPasswords: boolean;
  /** 自動入力データを削除するか */
  autofill: boolean;
  /** ローカルストレージを削除するか */
  localStorage: boolean;
}

/**
 * クリーンアップ結果の型定義
 */
export interface CleanupResult {
  success: boolean;
  message: string;
  timestamp: number;
}

/**
 * メッセージの型定義（バックグラウンドとの通信用）
 */
export interface CleanupMessage {
  type: 'CLEANUP';
  settings: CleanupSettings;
}

export interface CleanupResponse {
  type: 'CLEANUP_RESULT';
  result: CleanupResult;
}

/**
 * デフォルト設定
 */
export const DEFAULT_SETTINGS: CleanupSettings = {
  cookies: true,
  cache: true,
  history: true,
  downloads: false,
  formData: false,
  protectPasswords: true,  // パスワードは保護がデフォルト
  autofill: false,
  localStorage: false,
};
