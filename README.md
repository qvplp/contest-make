## プロジェクト概要

コンテスト参加者向けの**攻略記事プラットフォーム兼コンテスト作品ビューア**です。  
Next.js(App Router) + TypeScript で実装されており、コンテスト情報の閲覧・作品応募・投票・攻略記事の投稿/閲覧/引用などをフロントエンドのみで体験できるモックアプリです。

- コンテスト一覧・詳細・応募・投票機能
- 攻略記事一覧・詳細・投稿（ブロックエディタ + Markdown プレビュー）
- 作品一覧・プロフィール・決済設定（クレジット表示のみ）
- localStorage を利用した認証モックと記事下書き管理

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

- `app/`
  - `page.tsx`：ホーム
  - `contests/`：コンテスト一覧
  - `contest/halloween2025/`：コンテスト詳細/応募/投票
  - `guides/`：記事一覧・詳細・投稿フロー・引用
  - `contest-posts/`：作品一覧
  - `profile/`：プロフィール関連
  - `login/`, `signup/`, `settings/`：認証・設定系
- `components/`
  - `home/`：ホーム専用セクション群
  - `ContestGuidesViewer/`：コンテスト詳細ページ内の攻略記事ビューア
  - `editor/`：BlockEditor, MarkdownPreview, SectionManager など記事編集関連
  - 共通 UI（`Header`, `Footer`, `Sidebar`, `ResponsiveImage` など）
- `utils/`
  - `contestGuides.ts`：コンテスト x 攻略記事のモックデータ・ヘルパー
  - `draftManager.ts`：記事下書きの保存・履歴管理
  - `markdown.ts`：Markdown パース・サニタイズ・ハイライト
- `types/`
  - 記事フォーム、コンテスト、BlockNote などの型定義
- `contexts/`
  - `AuthContext.tsx`：認証状態管理（モック）
- `hooks/`
  - `useAutoSave.ts`：記事の自動保存
  - `useUnloadGuard.ts`：ページ離脱ガード

詳しくはソースコードと `実装機能一覧.md` をあわせて参照してください。

## 開発環境

### 必要環境

- Node.js (プロジェクト作成時点の LTS 推奨)
- npm（`package-lock.json` を利用）

### セットアップ

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開くとアプリを確認できます。

## 実装上の前提・制約

- バックエンド API は未実装で、**すべてのデータはモック or localStorage** で管理されています。
- 認証は `AuthContext` + `localStorage('animehub_user')` によるモック実装です。
- ガードがかかっているページでは、未ログイン時に `/login` へリダイレクトされます。
- 本番運用を想定したセキュリティ・スケーラビリティ要件は考慮していません（フロントのみのデモアプリ）。

詳細な仕様やユースケースは `実装機能一覧.md` を参照してください。
