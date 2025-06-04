const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Opt out of package.json:exports feature for Supabase compatibility
config.resolver.unstable_enablePackageExports = false;
config.resolver.sourceExts.push('cjs'); 

module.exports = withNativeWind(config, { input: "./global.css" });