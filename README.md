## プロジェクト概要

コンテスト参加者向けの**攻略記事プラットフォーム兼コンテスト作品ビューア**です。  
Next.js 16 (App Router) + TypeScript + React 19 で実装されており、コンテスト情報の閲覧・作品応募・投票・攻略記事の投稿/閲覧/引用などをフロントエンドのみで体験できるモックアプリです。

### 主要機能

- **コンテスト機能**: 一覧・詳細・応募・投票機能
- **攻略記事機能**: 一覧・詳細・投稿（BlockNoteブロックエディタ + Markdown プレビュー）
- **作品機能**: 一覧・投稿・詳細ビューア・引用機能
- **外部リンク機能**: YouTube埋め込み対応（作品応募・詳細表示）
- **プロフィール機能**: 表示・編集・通知管理
- **認証機能**: ログイン・新規登録（localStorage モック）
- **下書き管理**: 自動保存・履歴管理・ページ離脱ガード
- **決済設定**: クレジット残高表示（モック）
- **審査機能**: 型定義のみ（実装は未完了）

より詳細な機能一覧は `実装機能一覧.md` を参照してください。

## 主要ページ構成

- `/`：ホーム（ヒーロー、コンテスト一覧、攻略記事、作品セクション）
- `/contests`：コンテスト一覧
- `/contest/halloween2025`：コンテスト詳細
  - `/submit`：作品応募
  - `/vote`：投票
- `/guides`：攻略記事一覧
- `/guides/[id]`：記事詳細
  - `/cite`：作品引用
- `/guides/new`：記事新規作成（コンテンツ）
- `/guides/new/settings`：記事設定
- `/guides/new/preview`：記事プレビュー専用ページ
- `/contest-posts`：作品一覧
- `/profile`：プロフィール
  - `/edit`：プロフィール編集
- `/login`：ログイン
- `/signup`：新規登録
- `/settings/payment`：決済設定

## ディレクトリ構造（概要）

```
sousaku-contest/
├── app/                          # Next.js App Router ページ
│   ├── page.tsx                  # ホームページ
│   ├── contests/                 # コンテスト一覧
│   ├── contest/halloween2025/    # コンテスト詳細/応募/投票
│   ├── guides/                   # 記事一覧・詳細・投稿フロー・引用
│   ├── contest-posts/            # 作品一覧
│   ├── profile/                  # プロフィール関連
│   ├── login/                    # ログインページ
│   ├── signup/                   # 新規登録ページ
│   └── settings/                 # 設定ページ
├── components/                   # React コンポーネント
│   ├── home/                     # ホーム専用セクション群
│   ├── ContestGuidesViewer/      # コンテスト詳細ページ内の攻略記事ビューア
│   ├── editor/                   # BlockEditor, MarkdownPreview, SectionManager など
│   ├── guides/                   # ガイド引用関連コンポーネント
│   ├── works/                    # 作品関連コンポーネント
│   │   ├── WorkMediaPreview.tsx  # 作品メディアプレビュー
│   │   ├── WorkSubmitModal.tsx   # 作品投稿・編集モーダル
│   │   └── WorkViewerModal.tsx   # 作品詳細ビューアモーダル
│   ├── ui/                       # 共通UIコンポーネント
│   ├── Header.tsx                # ヘッダー
│   ├── Footer.tsx                # フッター
│   ├── Sidebar.tsx               # サイドバー
│   └── ResponsiveImage.tsx      # レスポンシブ画像コンポーネント
├── contexts/                     # React Context
│   ├── AuthContext.tsx           # 認証状態管理（モック）
│   └── WorksContext.tsx          # 作品状態管理
├── hooks/                        # カスタムフック
│   ├── useAutoSave.ts            # 記事の自動保存
│   └── useUnloadGuard.ts         # ページ離脱ガード
├── utils/                        # ユーティリティ関数
│   ├── contestGuides.ts          # コンテスト x 攻略記事のモックデータ・ヘルパー
│   ├── draftManager.ts           # 記事下書きの保存・履歴管理
│   ├── markdown.ts               # Markdown パース・サニタイズ・ハイライト
│   └── externalLinks.ts          # 外部リンク（YouTube）のバリデーション・処理
├── types/                        # TypeScript 型定義
│   ├── guideForm.ts              # 記事フォーム型
│   ├── contests.ts               # コンテスト型（応募設定・外部リンク設定含む）
│   ├── works.ts                  # 作品型（外部リンク情報含む）
│   ├── judging.ts                # 審査関連型
│   ├── blocknote.d.ts            # BlockNote 型定義
│   └── ContestGuidesViewer.ts    # コンテストガイドビューア型
├── constants/                    # 定数
│   └── taxonomies.ts             # 分類・カテゴリー定義
├── lib/                          # ライブラリ・モックデータ
│   └── mockCitedGuides.ts        # 引用ガイドのモックデータ
└── public/                       # 静的ファイル
    └── images/                   # 画像リソース
```

詳しくはソースコードと `実装機能一覧.md` をあわせて参照してください。

## 開発環境

### 必要環境

- **Node.js**: >= 20（`package.json` の `engines` で指定）
- **npm**: `package-lock.json` を利用

### セットアップ

```bash
# 依存関係のインストール
npm install
```

### 開発サーバーの起動

```bash
# 開発サーバー起動（ホットリロード有効）
npm run dev
```

ブラウザで `http://localhost:3000` を開くとアプリを確認できます。

### ビルド

```bash
# 本番用ビルド
npm run build

# 本番サーバー起動（ビルド後）
npm start
```

### リント

```bash
# ESLint によるコードチェック
npm run lint
```

## 技術スタック

### コア技術

- **フレームワーク**: Next.js 16.0.1 (App Router)
- **言語**: TypeScript 5
- **React**: 19.2.0
- **スタイリング**: Tailwind CSS 4

### 主要ライブラリ

- **ブロックエディタ**: BlockNote (@blocknote/core, @blocknote/react, @blocknote/mantine)
- **UIコンポーネント**: Mantine Core (@mantine/core)
- **ドラッグ&ドロップ**: @dnd-kit (core, sortable, utilities)
- **Markdown処理**: 
  - marked (Markdownパーサー)
  - react-syntax-highlighter (シンタックスハイライト)
  - prismjs (コードハイライト)
  - dompurify (XSS対策・サニタイズ)
- **アイコン**: Lucide React
- **画像最適化**: Next.js Image

### 状態管理

- React Context API (`AuthContext`, `WorksContext`)

## 実装上の前提・制約

### データ管理

- **バックエンド API**: 未実装。すべてのデータはモックデータまたは `localStorage` で管理
- **認証**: `AuthContext` + `localStorage('animehub_user')` によるモック実装
- **下書き管理**: `localStorage` に自動保存（`draftManager` を使用）
- **引用データ**: `localStorage` に保存（`guide_citations_{guideId}` 形式）
- **作品データ**: `WorksContext` で管理（外部リンク情報含む）

### セキュリティ

- **XSS対策**: Markdownレンダリング時に `DOMPurify` によるサニタイズを実施
- **認証ガード**: 主要ページは未ログイン時に `/login` へリダイレクト
- **本番運用**: セキュリティ・スケーラビリティ要件は考慮していません（フロントのみのデモアプリ）

### 自動保存機能

- **デバウンス保存**: 入力停止から約1.5秒後に保存
- **定期保存**: 10秒間隔で自動保存
- **ハッシュ比較**: 変更がない場合は保存をスキップ
- **履歴管理**: 直近最大5件の下書き履歴を保持
- **ページ離脱ガード**: 未保存変更がある場合に警告を表示

### アクセス制御

- **公開ページ**: `/login`, `/signup`
- **ログイン必須ページ**: 
  - `/` (ホーム)
  - `/contest/halloween2025/submit` (作品応募)
  - `/contest/halloween2025/vote` (投票)
  - `/guides/new`, `/guides/new/settings` (記事投稿)
  - `/guides/[id]/cite` (記事引用)
  - `/profile`, `/profile/edit` (プロフィール)

### 外部リンク機能

- **YouTube対応**: 作品応募時にYouTubeリンクを追加可能
- **バリデーション**: URL形式の検証（`utils/externalLinks.ts`）
- **埋め込み表示**: 作品詳細ビューアでYouTube動画を埋め込み表示
- **コンテスト設定**: 各コンテストで許可する外部リンクの種類を設定可能

詳細な仕様やユースケースは `実装機能一覧.md` を参照してください。
