const LOCALES = {
  "en-NG": { currency: "NGN", timeZone: "Africa/Lagos" },
  "en-GH": { currency: "GHS", timeZone: "Africa/Accra" },
  "fr-CI": { currency: "XOF", timeZone: "Africa/Abidjan" }
};

function makeI18n(locale, messages, pseudo) {
  const config = LOCALES[locale];
  const pluralRules = new Intl.PluralRules(locale);

  function fill(text, values) {
    return text.replace(/\{(\w+)\}/g, function(match, name) {
      return values && name in values ? String(values[name]) : match;
    });
  }

  function expand(text) {
    if (!pseudo) return text;
    return "[" + text + " " + "~".repeat(Math.ceil(text.length * 0.35)) + "]";
  }

  return {
    t: function(key, values) {
      const text = messages[key] || key;
      return expand(fill(text, values));
    },
    plural: function(baseKey, count) {
      const form = pluralRules.select(count);
      return expand(fill(messages[baseKey + "." + form], { count: count }));
    },
    price: function(amount) {
      return new Intl.NumberFormat(locale, { style: "currency", currency: config.currency }).format(amount);
    },
    slot: function(iso) {
      return new Intl.DateTimeFormat(locale, { dateStyle: "full", timeStyle: "short", timeZone: config.timeZone }).format(new Date(iso));
    }
  };
}
