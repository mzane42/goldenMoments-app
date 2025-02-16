// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Enable CSS support
  isCSSEnabled: true,
});

// Optimize Metro configuration
config.maxWorkers = 2; // Reduce number of workers
config.transformer.minifierConfig = {
  compress: false, // Disable compression during development
  mangle: false   // Disable name mangling during development
};

// Increase heap size for the Metro bundler
process.env.NODE_OPTIONS = '--max_old_space_size=4096';

module.exports = config;