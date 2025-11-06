export default function PrivacyPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-6 py-24 lg:px-8">
        <article className="prose lg:prose-xl">
          <h1>プライバシーポリシー</h1>
          <p>
            脳内世界旅行 開発チーム（以下、「当方」といいます。）は、本サービスの提供にあたり、ユーザーの個人情報の重要性を認識し、その保護の徹底を図るため、以下のプライバシーポリシーを定めます。
          </p>
          <h2>第1条（APIの利用）</h2>
          <p>
            本サービスは、写真の表示のためにUnsplash API（Unsplash, Inc.）を利用しています。
            APIを通じて送信される情報（検索クエリなど）は、Unsplashのプライバシーポリシーに基づいて処理されます。当方は、Unsplash APIから取得した写真以外の個人情報を取得しません。
          </p>
          <h2>第2条（アクセス解析）</h2>
          <p>
            本サービスでは、将来的にサービス向上のため、Google Analyticsなどのアクセス解析ツールを利用する場合があります。これらのツールは、トラフィックデータの収集のためにCookieを使用します。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。
          </p>
          <h2>第3条（免責事項）</h2>
          <p>
            本サービスからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報、サービス等について一切の責任を負いません。
          </p>
          <p className="text-right text-sm">最終更新日: 2025年11月4日</p>
        </article>
      </div>
    </div>
  );
}
