import { useState, useEffect, useCallback } from 'react';
import { CleanupSettings, DEFAULT_SETTINGS, CleanupResult } from '../types';

// アイコンコンポーネント
const ShieldIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SparkleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

// 設定項目コンポーネント
interface SettingItemProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon: React.ReactNode;
  isProtect?: boolean;
}

const SettingItem = ({ label, description, checked, onChange, icon, isProtect }: SettingItemProps) => (
  <div className="flex items-center justify-between py-3 border-b border-primary-100 last:border-b-0">
    <div className="flex items-center gap-3">
      <div className={`text-xl ${isProtect ? 'text-green-500' : 'text-primary-400'}`}>
        {icon}
      </div>
      <div>
        <div className="font-medium text-light-text">{label}</div>
        <div className="text-xs text-light-subtext">{description}</div>
      </div>
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`toggle-switch ${checked ? 'active' : ''}`}
      aria-label={`${label}を${checked ? 'オフ' : 'オン'}にする`}
    />
  </div>
);

function App() {
  const [settings, setSettings] = useState<CleanupSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CleanupResult | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // 設定の読み込み
  useEffect(() => {
    chrome.storage.local.get(['cleanupSettings'], (data) => {
      if (data.cleanupSettings) {
        setSettings(data.cleanupSettings);
      }
    });
  }, []);

  // 設定の保存
  useEffect(() => {
    chrome.storage.local.set({ cleanupSettings: settings });
  }, [settings]);

  // 設定の更新
  const updateSetting = useCallback((key: keyof CleanupSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  // クリーンアップ実行
  const handleCleanup = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      // バックグラウンドスクリプトにメッセージを送信
      const response = await chrome.runtime.sendMessage({
        type: 'CLEANUP',
        settings,
      });

      if (response?.result) {
        setResult(response.result);
        if (response.result.success) {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2000);
        }
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'クリーンアップ中にエラーが発生しました',
        timestamp: Date.now(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 選択されている項目数
  const selectedCount = Object.entries(settings)
    .filter(([key, value]) => key !== 'protectPasswords' && value)
    .length;

  const version = chrome.runtime.getManifest().version;

  return (
    <div className="min-h-[480px] bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      {/* ヘッダー */}
      <header className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-3">
          <div className="text-primary-400">
            <ShieldIcon />
          </div>
        </div>
        <h1 className="text-xl font-bold text-light-text">プライバシー一発クリーン</h1>
        <p className="text-sm text-light-subtext mt-1">ワンクリックでプライバシー保護</p>
      </header>

      {/* メインボタン */}
      <button
        onClick={handleCleanup}
        disabled={isLoading || selectedCount === 0}
        className={`clean-button w-full py-4 px-6 rounded-xl font-bold text-white text-lg shadow-lg
          ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600'}
          ${showSuccess ? 'success-animation bg-green-500' : ''}
          disabled:opacity-50 transition-all duration-300`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            クリーンアップ中...
          </span>
        ) : showSuccess ? (
          <span className="flex items-center justify-center gap-2">
            ✓ 完了！
            <SparkleIcon className="w-4 h-4 sparkle" />
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <SparkleIcon className="w-5 h-5" />
            一発クリーン！
          </span>
        )}
      </button>

      {/* 結果表示 */}
      {result && !showSuccess && (
        <div className={`mt-3 p-3 rounded-lg text-sm ${result.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {result.message}
        </div>
      )}

      {/* 設定セクション */}
      <div className="mt-6 bg-white rounded-xl shadow-md p-4">
        <h2 className="font-bold text-light-text mb-2 flex items-center gap-2">
          <span>削除対象</span>
          <span className="text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full">
            {selectedCount}項目選択中
          </span>
        </h2>

        <div className="divide-y divide-primary-50">
          <SettingItem
            label="クッキー"
            description="サイトの追跡データを削除"
            checked={settings.cookies}
            onChange={(v) => updateSetting('cookies', v)}
            icon="🍪"
          />
          <SettingItem
            label="キャッシュ"
            description="一時ファイルを削除"
            checked={settings.cache}
            onChange={(v) => updateSetting('cache', v)}
            icon="📦"
          />
          <SettingItem
            label="閲覧履歴"
            description="アクセス履歴を削除"
            checked={settings.history}
            onChange={(v) => updateSetting('history', v)}
            icon="📜"
          />
          <SettingItem
            label="ダウンロード履歴"
            description="ダウンロードの記録を削除"
            checked={settings.downloads}
            onChange={(v) => updateSetting('downloads', v)}
            icon="📥"
          />
          <SettingItem
            label="フォームデータ"
            description="入力フォームの自動補完データ"
            checked={settings.formData}
            onChange={(v) => updateSetting('formData', v)}
            icon="📝"
          />
          <SettingItem
            label="ローカルストレージ"
            description="サイトの保存データを削除"
            checked={settings.localStorage}
            onChange={(v) => updateSetting('localStorage', v)}
            icon="💾"
          />
        </div>
      </div>

      {/* パスワード保護セクション */}
      <div className="mt-4 bg-green-50 rounded-xl shadow-md p-4 border-2 border-green-200">
        <SettingItem
          label="パスワードを保護"
          description="保存済みパスワードは削除しない"
          checked={settings.protectPasswords}
          onChange={(v) => updateSetting('protectPasswords', v)}
          icon="🔒"
          isProtect
        />
      </div>

      {/* フッター */}
      <footer className="mt-6 text-center text-xs text-light-subtext">
        <p>v{version} - トラッカーからあなたを守ります</p>
      </footer>
    </div>
  );
}

export default App;
