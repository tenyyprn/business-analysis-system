const Papa = require('papaparse');
const _ = require('lodash');
const math = require('mathjs');
const fs = require('fs');
const path = require('path');

class BusinessAnalyzer {
    constructor() {
        this.data = null;
        this.metrics = {};
        this.latestData = null;
    }

    // キーメトリクスの計算
    calculateKeyMetrics() {
        return {
            profitability: {
                operating_margin: this.metrics.profitability.operating_margin,
                roi: this.metrics.profitability.roi,
                trend: this.calculateTrend('operating_margin')
            },
            efficiency: {
                asset_turnover: this.metrics.efficiency.asset_turnover,
                inventory_turnover: this.metrics.efficiency.inventory_turnover,
                trend: this.calculateTrend('asset_turnover')
            },
            growth: {
                revenue_growth: this.metrics.growth.revenue_growth,
                profit_growth: this.metrics.growth.profit_growth,
                trend: this.calculateTrend('revenue')
            },
            financial_health: {
                current_ratio: this.metrics.liquidity.current_ratio,
                debt_ratio: this.metrics.solvency.debt_ratio,
                trend: this.calculateTrend('equity_ratio')
            }
        };
    }

    // 包括的なトレンド分析
    calculateComprehensiveTrends() {
        return {
            revenue: this.calculateDetailedTrend('revenue'),
            profitability: this.calculateDetailedTrend('operating_margin'),
            efficiency: this.calculateDetailedTrend('asset_turnover'),
            growth: this.calculateDetailedTrend('revenue_growth'),
            financial_stability: this.calculateDetailedTrend('equity_ratio')
        };
    }

    // 詳細なトレンド分析
    calculateDetailedTrend(metric) {
        const values = this.data.map(row => row[metric]);
        const trend = this.calculateTrend(metric);

        return {
            direction: trend.direction,
            magnitude: trend.magnitude,
            consistency: trend.consistency,
            current_value: _.last(values),
            average: _.mean(values),
            min: _.min(values),
            max: _.max(values),
            standard_deviation: math.std(values),
            year_over_year_change: this.calculateYearOverYearChange(metric)
        };
    }

    // 前年同期比の計算
    calculateYearOverYearChange(metric) {
        const currentValue = _.last(this.data)[metric];
        const yearAgoIndex = this.data.length - 12;
        if (yearAgoIndex >= 0) {
            const yearAgoValue = this.data[yearAgoIndex][metric];
            return ((currentValue - yearAgoValue) / yearAgoValue) * 100;
        }
        return null;
    }

    // リスク評価
    assessRisks() {
        const risks = [];

        // 収益性リスク
        if (this.metrics.profitability.operating_margin < 10) {
            risks.push({
                category: '収益性リスク',
                level: 'high',
                description: '営業利益率が低く、収益性の改善が必要です。'
            });
        }

        // 流動性リスク
        if (this.metrics.liquidity.current_ratio < 1.5) {
            risks.push({
                category: '流動性リスク',
                level: 'medium',
                description: '流動比率が低く、短期的な支払能力に注意が必要です。'
            });
        }

        // 成長性リスク
        if (this.metrics.growth.revenue_growth < 5) {
            risks.push({
                category: '成長性リスク',
                level: 'medium',
                description: '売上成長率が低く、市場競争力の強化が必要です。'
            });
        }

        // 財務レバレッジリスク
        if (this.metrics.solvency.debt_ratio > 0.7) {
            risks.push({
                category: '財務レバレッジリスク',
                level: 'high',
                description: '負債比率が高く、財務体質の改善が必要です。'
            });
        }

        return risks;
    }

    // 機会の特定
    identifyOpportunities() {
        const opportunities = [];

        // 成長機会
        if (this.metrics.growth.revenue_growth > 15) {
            opportunities.push({
                category: '成長機会',
                potential: 'high',
                description: '高い売上成長率を活かした事業拡大の機会があります。'
            });
        }

        // 効率化機会
        if (this.metrics.efficiency.asset_turnover < 2) {
            opportunities.push({
                category: '効率化機会',
                potential: 'medium',
                description: '資産効率の改善による収益性向上の余地があります。'
            });
        }

        // 投資機会
        if (this.metrics.cashflow.operating_cash_ratio > 0.15) {
            opportunities.push({
                category: '投資機会',
                potential: 'high',
                description: '潤沢なキャッシュフローを活用した戦略的投資の機会があります。'
            });
        }

        return opportunities;
    }

    // KPI分析
    analyzeKPIs() {
        return {
            financial_kpis: {
                revenue_per_employee: this.metrics.operations.employee_productivity,
                profit_per_employee: this.latestData.operating_profit / this.latestData.employees,
                rd_ratio: this.metrics.operations.rd_intensity,
                marketing_efficiency: this.metrics.operations.marketing_efficiency
            },
            operational_kpis: {
                inventory_days: 365 / this.metrics.efficiency.inventory_turnover,
                receivables_days: 365 / this.metrics.efficiency.receivables_turnover,
                asset_efficiency: this.metrics.efficiency.asset_turnover
            },
            market_kpis: {
                market_share: this.latestData.market_share,
                market_share_growth: this.calculateGrowthRate('market_share')
            }
        };
    }

    // レポート生成
    generateReport() {
        const report = {
            summary: this.generateComprehensiveSummary(),
            financial_analysis: {
                profitability: this.analyzeProfitability(),
                efficiency: this.analyzeEfficiency(),
                liquidity: this.analyzeLiquidity(),
                solvency: this.analyzeSolvency()
            },
            trends: this.calculateComprehensiveTrends(),
            risks: this.assessRisks(),
            opportunities: this.identifyOpportunities(),
            kpis: this.analyzeKPIs(),
            recommendations: this.generateRecommendations()
        };

        return report;
    }

    // 提案生成
    generateRecommendations() {
        const recommendations = [];
        const metrics = this.metrics;

        // 収益性改善の提案
        if (metrics.profitability.operating_margin < 15) {
            recommendations.push({
                category: '収益性改善',
                suggestion: 'コスト構造の見直しと高付加価値サービスの展開を検討してください。',
                priority: 'high'
            });
        }

        // 効率性改善の提案
        if (metrics.efficiency.asset_turnover < 2) {
            recommendations.push({
                category: '効率性改善',
                suggestion: '遊休資産の活用や不要資産の処分を検討してください。',
                priority: 'medium'
            });
        }

        // 成長戦略の提案
        if (metrics.growth.revenue_growth < 10) {
            recommendations.push({
                category: '成長戦略',
                suggestion: '新規市場の開拓や既存顧客への深耕を強化してください。',
                priority: 'high'
            });
        }

        return recommendations;
    }

    // 流動性分析
    analyzeLiquidity() {
        const liquidity = this.metrics.liquidity;
        return {
            metrics: liquidity,
            trend: this.calculateTrend('current_ratio'),
            assessment: this.assessLiquidity(liquidity)
        };
    }

    // 支払能力分析
    analyzeSolvency() {
        const solvency = this.metrics.solvency;
        return {
            metrics: solvency,
            trend: this.calculateTrend('equity_ratio'),
            assessment: this.assessSolvency(solvency)
        };
    }

    // 流動性評価
    assessLiquidity(metrics) {
        let assessment = '';
        if (metrics.current_ratio > 2) {
            assessment = '流動性は十分に確保されています。';
        } else if (metrics.current_ratio > 1.5) {
            assessment = '流動性は適正な水準です。';
        } else {
            assessment = '流動性の改善が必要です。';
        }
        return assessment;
    }

    // 支払能力評価
    assessSolvency(metrics) {
        let assessment = '';
        if (metrics.equity_ratio > 0.5) {
            assessment = '財務体質は強固です。';
        } else if (metrics.equity_ratio > 0.3) {
            assessment = '財務体質は安定しています。';
        } else {
            assessment = '財務体質の強化が必要です。';
        }
        return assessment;
    }
}

module.exports = BusinessAnalyzer;