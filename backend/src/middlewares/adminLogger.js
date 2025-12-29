/**
 * Admin Action Logger Middleware
 * Logs admin actions for audit purposes
 */
const adminLogger = (actionType) => {
  return (req, res, next) => {
    // Log admin action
    const logData = {
      adminId: req.user?._id,
      adminEmail: req.user?.email,
      action: actionType,
      method: req.method,
      path: req.path,
      targetId: req.params?.id || req.body?.id || null,
      timestamp: new Date().toISOString(),
      ip: req.ip || req.connection?.remoteAddress,
    };

    // Log to console (in production, use a proper logging service)
    console.log('[ADMIN ACTION]', JSON.stringify(logData, null, 2));

    // In production, you might want to save to a database:
    // await AdminLog.create(logData);

    next();
  };
};

module.exports = adminLogger;

