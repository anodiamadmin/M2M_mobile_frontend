import 'dotenv/config';

export default ({ config }) => {
  return {
    ...config, // 👈 This automatically loads everything from your app.json!
    
    // Now we just overwrite the specific parts that need the API Key
    android: {
      ...config.android,
      config: {
        ...config.android?.config,
        googleMaps: {
          apiKey: process.env.GOOGLE_API_KEY 
        }
      }
    },
    ios: {
      ...config.ios,
      config: {
        ...config.ios?.config,
        googleMapsApiKey: process.env.GOOGLE_API_KEY
      }
    },
    extra: {
      ...config.extra,
      googleApiKey: process.env.GOOGLE_API_KEY
    }
  };
};