const MCPServer = require('./MCPServer');

async function startServer() {
    try {
        // サーバーのインスタンス化
        const server = new MCPServer();
        console.log('経営分析システムを起動中...');

        // サーバーの初期化（サンプルデータの読み込み）
        await server.initialize('financial_data.csv');
        console.log('システムの初期化が完了しました');

        // システム状態の確認
        const status = server.getStatus();
        console.log('システム状態:', status);

        // 対話型インターフェースの開始
        console.log('\n経営分析システムの準備が完了しました。');
        console.log('以下のような質問ができます：');
        console.log('- 「収益性について教えてください」');
        console.log('- 「売上のトレンドを分析してください」');
        console.log('- 「成長性はどうですか？」');
        console.log('- 「経営効率について分析してください」');

        // サンプルクエリの実行
        const sampleQueries = [
            '収益性について教えてください',
            '成長性の分析をお願いします',
            '経営効率はどうですか'
        ];

        for (const query of sampleQueries) {
            console.log(`\n質問: ${query}`);
            const result = await server.processQuery(query);
            console.log('分析結果:', result);
        }

        return server;

    } catch (error) {
        console.error('起動エラー:', error);
        throw error;
    }
}

// システム起動
console.log('経営分析システムを起動します...');
startServer().catch(console.error);