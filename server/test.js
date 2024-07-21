const bcrypt = require('bcrypt');

(async()=>{
    const password = "Amma@2004";
const hashedPassword = await bcrypt.hashSync(password, 10);
console.log(hashedPassword);
//const hashedPassword = "$2b$10$UjQmtsxLt8Fd88meq1HRqOKCYzDWKCVLvIVnirDq/vfVB9d4ttBg.";
const isPasswordValid = await bcrypt.compareSync(password, hashedPassword);
console.log(isPasswordValid);
})();