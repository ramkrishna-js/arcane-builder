function resolvePath(pathExpression, context) {
  return pathExpression.split('.').reduce((value, segment) => {
    if (value === null || value === undefined) return undefined;
    return value[segment];
  }, context);
}

function renderTemplate(input, context) {
  if (typeof input !== 'string') return input;

  return input.replace(/{{\s*([^}]+?)\s*}}/g, (match, keyPath) => {
    const value = resolvePath(keyPath, context);
    if (value === undefined || value === null) {
      return match;
    }
    return String(value);
  });
}

module.exports = {
  renderTemplate
};
