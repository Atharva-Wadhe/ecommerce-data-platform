export type UserRole =
    | 'MANAGEMENT'
    | 'SALES_MANAGER'
    | 'PRODUCT_MANAGER'
    | 'CUSTOMER_SUPPORT'
    | 'SELLER_MANAGER'
    | 'LOGISTICS_MANAGER'
    | 'ADMIN';

export interface WidgetConfig {
    id: string;
    type: 'kpi' | 'chart' | 'table' | 'insights' | 'admin';
    title: string;
    gridArea: 'full' | 'half' | 'third';
}

export interface DashboardConfig {
    role: UserRole;
    displayName: string;
    description: string;
    widgets: WidgetConfig[];
}

export const DASHBOARD_CONFIGS: Record<UserRole, DashboardConfig> = {
    MANAGEMENT: {
        role: 'MANAGEMENT',
        displayName: 'Executive Dashboard',
        description: 'Overall business health and high-level KPIs for executives.',
        widgets: [
            { id: 'kpi-summary', type: 'kpi', title: 'Key Performance Indicators', gridArea: 'full' },
            { id: 'revenue-trend', type: 'chart', title: 'Revenue & Order Trend', gridArea: 'full' },
            { id: 'category-sales', type: 'chart', title: 'Category Sales', gridArea: 'half' },
            { id: 'order-status', type: 'chart', title: 'Order Status Distribution', gridArea: 'half' },
            { id: 'top-sellers', type: 'table', title: 'Top Sellers Leaderboard', gridArea: 'half' },
            { id: 'geography', type: 'chart', title: 'Geographic Sales', gridArea: 'half' },
            { id: 'delivery-summary', type: 'chart', title: 'Delivery Efficiency', gridArea: 'half' },
            { id: 'reviews-summary', type: 'chart', title: 'Customer Satisfaction', gridArea: 'half' },
            { id: 'insights-executive', type: 'insights', title: 'Executive Insights', gridArea: 'full' }
        ]
    },
    SALES_MANAGER: {
        role: 'SALES_MANAGER',
        displayName: 'Sales Dashboard',
        description: 'Detailed revenue, order volumes, and sales growth metrics.',
        widgets: [
            { id: 'kpi-sales', type: 'kpi', title: 'Sales KPIs', gridArea: 'full' },
            { id: 'revenue-trend', type: 'chart', title: 'Revenue Trend', gridArea: 'full' },
            { id: 'category-sales', type: 'chart', title: 'Category Revenue', gridArea: 'half' },
            { id: 'geography', type: 'chart', title: 'State Revenue', gridArea: 'half' },
            { id: 'top-sellers', type: 'table', title: 'Top Sellers', gridArea: 'full' },
            { id: 'insights-sales', type: 'insights', title: 'Sales Insights', gridArea: 'full' }
        ]
    },
    PRODUCT_MANAGER: {
        role: 'PRODUCT_MANAGER',
        displayName: 'Product Dashboard',
        description: 'Product category performance, pricing, and catalog insights.',
        widgets: [
            { id: 'kpi-product', type: 'kpi', title: 'Product KPIs', gridArea: 'full' },
            { id: 'category-sales', type: 'chart', title: 'Category Distribution', gridArea: 'full' },
            { id: 'reviews-summary', type: 'chart', title: 'Category Ratings', gridArea: 'half' },
            { id: 'order-status', type: 'chart', title: 'Category Order Status', gridArea: 'half' },
            { id: 'insights-product', type: 'insights', title: 'Product Insights', gridArea: 'full' }
        ]
    },
    CUSTOMER_SUPPORT: {
        role: 'CUSTOMER_SUPPORT',
        displayName: 'Customer Support Dashboard',
        description: 'Customer satisfaction, reviews, and feedback analysis.',
        widgets: [
            { id: 'kpi-support', type: 'kpi', title: 'Support KPIs', gridArea: 'full' },
            { id: 'reviews-summary', type: 'chart', title: 'Review Rating Distribution', gridArea: 'full' },
            { id: 'geography', type: 'chart', title: 'Reviews by State', gridArea: 'half' },
            { id: 'order-status', type: 'chart', title: 'Order Status Impact', gridArea: 'half' },
            { id: 'insights-support', type: 'insights', title: 'Support Insights', gridArea: 'full' }
        ]
    },
    SELLER_MANAGER: {
        role: 'SELLER_MANAGER',
        displayName: 'Seller Dashboard',
        description: 'Seller performance, ratings, and revenue contributions.',
        widgets: [
            { id: 'kpi-seller', type: 'kpi', title: 'Seller KPIs', gridArea: 'full' },
            { id: 'top-sellers', type: 'table', title: 'Top Sellers Leaderboard', gridArea: 'full' },
            { id: 'geography', type: 'chart', title: 'Seller Geography', gridArea: 'half' },
            { id: 'reviews-summary', type: 'chart', title: 'Seller Ratings', gridArea: 'half' },
            { id: 'insights-seller', type: 'insights', title: 'Seller Insights', gridArea: 'full' }
        ]
    },
    LOGISTICS_MANAGER: {
        role: 'LOGISTICS_MANAGER',
        displayName: 'Logistics Dashboard',
        description: 'Delivery times, shipping costs, and fulfillment efficiency.',
        widgets: [
            { id: 'kpi-logistics', type: 'kpi', title: 'Logistics KPIs', gridArea: 'full' },
            { id: 'delivery-summary', type: 'chart', title: 'Delivery Metrics', gridArea: 'full' },
            { id: 'geography', type: 'chart', title: 'Delivery Times by State', gridArea: 'half' },
            { id: 'order-status', type: 'chart', title: 'Fulfillment Status', gridArea: 'half' },
            { id: 'insights-logistics', type: 'insights', title: 'Logistics Insights', gridArea: 'full' }
        ]
    },
    ADMIN: {
        role: 'ADMIN',
        displayName: 'Administration Dashboard',
        description: 'Data pipeline status, system health, and operational logs.',
        widgets: [
            { id: 'admin-status', type: 'admin', title: 'System Status', gridArea: 'full' }
        ]
    }
};
