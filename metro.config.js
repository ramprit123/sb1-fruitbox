const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add web asset extensions
config.resolver.assetExts.push('png', 'svg');
config.resolver.sourceExts.push('mjs');

module.exports = config;