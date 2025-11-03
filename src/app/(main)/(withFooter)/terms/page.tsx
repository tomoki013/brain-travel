// (imports)
export default function TermsPage() {
return (
<div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">利用規約</h1>
      <div className="space-y-4">
        <p>
          この利用規約（以下、「本規約」といいます。）は、[開発者名]（以下、「当方」といいます。）がこのウェブサイト上で提供するサービス（以下、「本サービス」といいます。）の利用条件を定めるものです。ユーザーの皆様（以下、「ユーザー」といいます。）には、本規約に従って、本サービスをご利用いただきます。
        </p>
        <section>
          <h2 className="text-2xl font-semibold mb-2">第1条（適用）</h2>
          <p>
            本規約は、ユーザーと当方との間の本サービスの利用に関わる一切の関係に適用されるものとします。
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">第2条（免責事項）</h2>
          <p>
            当方は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
          </p>
          <p>
            当方は、本サービスに起因してユーザーに生じたあらゆる損害について一切の責任を負いません。
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">第3条（サービス内容の変更等）</h2>
          <p>
            当方は、ユーザーに通知することなく、本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">第4条（利用規約の変更）</h2>
          <p>
            当方は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。
          </p>
        </section>
        <p className="text-right">最終更新日: 2025年11月4日</p>
      </div>
    </div>
);
}
