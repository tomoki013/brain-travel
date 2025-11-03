// (imports)
export default function PrivacyPage() {
return (
<div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">プライバシーポリシー</h1>
      <div className="space-y-4">
        <p>
          [開発者名]（以下、「当方」といいます。）は、本サービスの提供にあたり、ユーザーの個人情報の重要性を認識し、その保護の徹底を図るため、以下のプライバシーポリシーを定めます。
        </p>
        <section>
          <h2 className="text-2xl font-semibold mb-2">第1条（APIの利用）</h2>
          <p>
            本サービスは、写真の表示のためにUnsplash API（Unsplash, Inc.）を利用しています。
            APIを通じて送信される情報（検索クエリなど）は、Unsplashのプライバシーポリシーに基づいて処理されます。当方は、Unsplash APIから取得した写真以外の個人情報を取得しません。
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">第2条（アクセス解析）</h2>
          <p>
            本サービスでは、将来的にサービス向上のため、Google Analyticsなどのアクセス解析ツールを利用する場合があります。これらのツールは、トラフィックデータの収集のためにCookieを使用します。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">第3条（免責事項）</h2>
          <p>
            本サービスからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報、サービス等について一切の責任を負いません。
          </p>
        </section>
        <p className="text-right">最終更新日: 2025年11月4日</p>
      </div>
    </div>
);
}
