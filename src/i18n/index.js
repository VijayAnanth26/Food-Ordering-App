export const getMessages = async (locale) => {
  try {
    const messages = await import(`../messages/${locale}.json`);
    return messages.default;
  } catch (error) {
    console.warn(`Could not load messages for locale: ${locale}. Falling back to 'en'.`);
    const fallback = await import('../messages/en.json');
    return fallback.default;
  }
}; 