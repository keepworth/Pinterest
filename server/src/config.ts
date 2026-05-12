/** 开发环境配置 —— 生产环境应通过环境变量覆盖 */

export const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me-in-production';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';