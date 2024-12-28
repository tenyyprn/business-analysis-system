const BusinessAnalyzer = require('./BusinessAnalyzer');
const fs = require('fs');
const path = require('path');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));

class MCPServer {
    constructor() {
        this.analyzer = new BusinessAnalyzer();
        this.config = config;
        this.isInitialized = false;
        this.cache = new Map();
    }

    // サーバーの初期化
    async initialize(dataPath) {
        try {
            const success = await this.analyzer.loadData(dataPath);
            if (success) {
                this.analyzer.calculateBasicMetrics();
                this.isInitialized = true;
                return '初期化が完了しました。分析の準備ができています。';
            }
            return 'データの読み込みに失敗しました。';
        } catch (error) {
            console.error('初期化エラー:', error);
            return '初期化中にエラーが発生しました。';
        }
    }

    // 自然言語クエリの処理
    async processQuery(query) {
        if (!this.isInitialized) {
            return this.getResponseTemplate('error', 'notInitialized');
        }

        try {
            // クエリの前処理と分析
            const processedQuery = this.preprocessQuery(query);
            const result = await this.analyzer.analyzeQuery(processedQuery);
            
            // レスポンスの生成
            const formattedResponse = this.formatResponse(result);
            this.logInfo('クエリ処理完了', { query });
            
            return formattedResponse;

        } catch (error) {
            this.logError('クエリ処理エラー', error);
            return '申し訳ありません。分析中にエラーが発生しました。';
        }
    }

    // クエリの前処理
    preprocessQuery(query) {
        let processed = query;

        // 全角を半角に変換
        processed = processed.replace(/[！-～]/g, s => 
            String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
        );
        
        // 空白文字の正規化
        processed = processed.replace(/\s+/g, ' ').trim();
        
        return processed;
    }

    // レスポンスの整形
    formatResponse(result) {
        if (!result) return '分析結果が得られませんでした。';
        
        if (typeof result === 'string') return result;
        
        if (typeof result === 'object') {
            return JSON.stringify(result, null, 2);
        }
        
        return result.toString();
    }

    // システム状態の確認
    getStatus() {
        return {
            initialized: this.isInitialized,
            dataLoaded: this.analyzer.data !== null,
            metricsCalculated: Object.keys(this.analyzer.metrics).length > 0
        };
    }

    // ログ機能
    logInfo(message, data = {}) {
        console.log(JSON.stringify({
            timestamp: new Date().toISOString(),
            level: 'info',
            message,
            data
        }));
    }

    logError(message, error = {}) {
        console.error(JSON.stringify({
            timestamp: new Date().toISOString(),
            level: 'error',
            message,
            error: error.message || error
        }));
    }
}

module.exports = MCPServer;