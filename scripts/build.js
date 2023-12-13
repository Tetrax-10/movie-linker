const fs = require("fs")

fs.cpSync("./assets", "./dist/assets", { recursive: true })
fs.cpSync("./css", "./dist/css", { recursive: true })
fs.cpSync("./src", "./dist/src", { recursive: true })
fs.cpSync("./manifest.json", "./dist/manifest.json", { recursive: true })

const secrets = fs.readFileSync("./secrets.json", "utf-8")
fs.writeFileSync("./dist/secrets.json", secrets.replace(/"([^"]{32})"/g, '"your-tmdb-api-key-goes-here"'))
