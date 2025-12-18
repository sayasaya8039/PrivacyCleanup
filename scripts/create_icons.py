"""
プライバシー一発クリーン - アイコン生成スクリプト
シールド（盾）とほうきを組み合わせたデザイン
"""

from PIL import Image, ImageDraw
import os

def create_icon(size: int, output_path: str) -> None:
    """
    プライバシークリーンアップのアイコンを生成する

    Args:
        size: アイコンのサイズ（ピクセル）
        output_path: 出力ファイルパス
    """
    # 透明な背景で画像を作成
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # スケール係数
    scale = size / 128

    # カラーパレット（パステル水色系）
    shield_color = (56, 189, 248, 255)      # #38BDF8 - アクセントカラー
    shield_dark = (14, 165, 233, 255)       # #0EA5E9 - 濃いめ
    sparkle_color = (255, 255, 255, 255)    # 白 - キラキラ
    check_color = (167, 243, 208, 255)      # #A7F3D0 - 成功色（緑）

    # シールド（盾）の形状を描画
    center_x = size // 2

    # 盾の外形ポイント
    shield_points = [
        (center_x, int(10 * scale)),                    # 上中央
        (int(108 * scale), int(25 * scale)),            # 右上
        (int(108 * scale), int(70 * scale)),            # 右中
        (center_x, int(118 * scale)),                   # 下中央（とがった部分）
        (int(20 * scale), int(70 * scale)),             # 左中
        (int(20 * scale), int(25 * scale)),             # 左上
    ]

    # 盾の影（少し暗い色で少しずらす）
    shadow_points = [(x + int(3 * scale), y + int(3 * scale)) for x, y in shield_points]
    draw.polygon(shadow_points, fill=(0, 0, 0, 60))

    # 盾本体
    draw.polygon(shield_points, fill=shield_color, outline=shield_dark, width=max(1, int(2 * scale)))

    # 盾の中にグラデーション風のハイライト
    highlight_points = [
        (center_x, int(18 * scale)),
        (int(98 * scale), int(30 * scale)),
        (int(98 * scale), int(50 * scale)),
        (center_x, int(45 * scale)),
        (int(30 * scale), int(50 * scale)),
        (int(30 * scale), int(30 * scale)),
    ]
    draw.polygon(highlight_points, fill=(125, 211, 252, 180))  # 半透明の明るい色

    # チェックマーク（パスワード保護を象徴）
    check_width = max(2, int(6 * scale))
    check_points = [
        (int(40 * scale), int(65 * scale)),   # 左
        (int(55 * scale), int(85 * scale)),   # 中央下
        (int(90 * scale), int(45 * scale)),   # 右上
    ]
    draw.line(check_points[:2], fill=check_color, width=check_width)
    draw.line(check_points[1:], fill=check_color, width=check_width)

    # キラキラエフェクト（クリーン感を演出）
    sparkle_positions = [
        (int(95 * scale), int(20 * scale), int(4 * scale)),
        (int(25 * scale), int(35 * scale), int(3 * scale)),
        (int(100 * scale), int(55 * scale), int(3 * scale)),
    ]

    for x, y, r in sparkle_positions:
        # 十字型のキラキラ
        draw.line([(x - r, y), (x + r, y)], fill=sparkle_color, width=max(1, int(1.5 * scale)))
        draw.line([(x, y - r), (x, y + r)], fill=sparkle_color, width=max(1, int(1.5 * scale)))

    # アンチエイリアスのために少し大きく作ってリサイズする場合はここで処理
    img.save(output_path, "PNG")
    print(f"生成完了: {output_path} ({size}x{size})")


def main() -> None:
    """アイコンを各サイズで生成"""
    # iconsディレクトリを作成
    icons_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "icons")
    os.makedirs(icons_dir, exist_ok=True)

    # 各サイズで生成
    sizes = [16, 32, 48, 128]
    for size in sizes:
        output_path = os.path.join(icons_dir, f"icon{size}.png")
        create_icon(size, output_path)

    print("\nすべてのアイコンを生成しました！")


if __name__ == "__main__":
    main()
