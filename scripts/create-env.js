const fs = require('fs')
fs.writeFileSync('./.env',`REACT_APP_sURL=${process.env.REACT_APP_sURL}`)