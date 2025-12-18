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

const CheckIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// メイン削除項目のカード型チェックボックス
interface MainItemCardProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon: string;
  color: string;
}

const MainItemCard = ({ label, description, checked, onChange, icon, color }: MainItemCardProps) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative w-full p-4 rounded-xl border-2 transition-all duration-200 text-left
      ${checked
        ? `${color} border-current bg-opacity-10 shadow-md`
        : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
  >
    <div className="flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <div className={`font-bold ${checked ? 'text-current' : 'text-gray-700'}`}>{label}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
      <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all
        ${checked
          ? 'bg-current border-current'
          : 'border-gray-300 bg-white'
        }`}
      >
        {checked && <span className="text-white"><CheckIcon /></span>}
      </div>
    </div>
  </button>
);

// 詳細設定のトグルスイッチ
interface SettingItemProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon: string;
}

const SettingItem = ({ label, checked, onChange, icon }: SettingItemProps) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center gap-2">
      <span className="text-sm">{icon}</span>
      <span className="text-sm text-gray-600">{label}</span>
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`w-10 h-5 rounded-full transition-all duration-200 relative
        ${checked ? 'bg-primary-400' : 'bg-gray-300'}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200
        ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
      />
    </button>
  </div>
);

function App() {
  const [settings, setSettings] = useState<CleanupSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CleanupResult | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

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

  // メイン3項目の選択数
  const mainSelectedCount = [settings.cookies, settings.cache, settings.history].filter(Boolean).length;

  const version = chrome.runtime.getManifest().version;

  return (
    <div className="min-h-[480px] bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      {/* ヘッダー */}
      <header className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-2xl shadow-lg mb-2">
          <div className="text-primary-400">
            <ShieldIcon />
          </div>
        </div>
        <h1 className="text-lg font-bold text-light-text">プライバシー一発クリーン</h1>
      </header>

      {/* メイン削除項目 - カード型チェックボックス */}
      <div className="space-y-3 mb-4">
        <MainItemCard
          label="クッキー"
          description="サイトの追跡データ・ログイン情報"
          checked={settings.cookies}
          onChange={(v) => updateSetting('cookies', v)}
          icon="🍪"
          color="text-amber-500"
        />
        <MainItemCard
          label="キャッシュ"
          description="画像・ファイルの一時保存データ"
          checked={settings.cache}
          onChange={(v) => updateSetting('cache', v)}
          icon="📦"
          color="text-blue-500"
        />
        <MainItemCard
          label="閲覧履歴"
          description="アクセスしたサイトの記録"
          checked={settings.history}
          onChange={(v) => updateSetting('history', v)}
          icon="📜"
          color="text-purple-500"
        />
      </div>

      {/* メインボタン */}
      <button
        onClick={handleCleanup}
        disabled={isLoading || mainSelectedCount === 0}
        className={`clean-button w-full py-4 px-6 rounded-xl font-bold text-white text-lg shadow-lg
          ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600'}
          ${showSuccess ? 'success-animation !bg-green-500' : ''}
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
            一発クリーン！（{mainSelectedCount}項目）
          </span>
        )}
      </button>

      {/* 結果表示 */}
      {result && !showSuccess && (
        <div className={`mt-3 p-3 rounded-lg text-sm ${result.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {result.message}
        </div>
      )}

      {/* パスワード保護 */}
      <div className="mt-4 bg-green-50 rounded-xl p-3 border border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔒</span>
            <div>
              <div className="font-medium text-green-700 text-sm">パスワードを保護</div>
              <div className="text-xs text-green-600">保存済みパスワードは削除しない</div>
            </div>
          </div>
          <button
            onClick={() => updateSetting('protectPasswords', !settings.protectPasswords)}
            className={`w-12 h-6 rounded-full transition-all duration-200 relative
              ${settings.protectPasswords ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
              ${settings.protectPasswords ? 'translate-x-6' : 'translate-x-0.5'}`}
            />
          </button>
        </div>
      </div>

      {/* 詳細設定 */}
      <div className="mt-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full text-sm text-gray-500 flex items-center justify-center gap-1 hover:text-gray-700"
        >
          <span>詳細設定</span>
          <svg className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {showAdvanced && (
          <div className="mt-2 bg-white rounded-xl p-3 shadow-sm">
            <SettingItem
              label="ダウンロード履歴"
              checked={settings.downloads}
              onChange={(v) => updateSetting('downloads', v)}
              icon="📥"
            />
            <SettingItem
              label="フォームデータ"
              checked={settings.formData}
              onChange={(v) => updateSetting('formData', v)}
              icon="📝"
            />
            <SettingItem
              label="ローカルストレージ"
              checked={settings.localStorage}
              onChange={(v) => updateSetting('localStorage', v)}
              icon="💾"
            />
          </div>
        )}
      </div>

      {/* フッター */}
      <footer className="mt-4 text-center text-xs text-light-subtext">
        <p>v{version}</p>
      </footer>
    </div>
  );
}

export default App;
