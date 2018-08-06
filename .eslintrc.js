module.exports = {
  extends: [
    "plugin:node/recommended"
  ],
  plugins: [
    "node"
  ],
  rules: {
    "indent": ["error", 2, {
      "MemberExpression": "off"
    }]
  },
}
