const crypto = require('crypto');

function hashPassword(pass) {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512',salt)
        .update(pass)
        .digest("base64");

    return salt + "$" + hash;
}

function printUsage() {
    console.info('\nUsage: createUserManually <password-for-hashing>');
    // TODO: Next version usage
    // console.info('\nUsage: createUserManually --password <password-for-hashing> --display-password');
}

var args = process.argv.slice(2);
if (!args.length) {
    console.error('Error: No parameters provided.');
    printUsage();
    return;
}

if (args.length !== 1) {
    console.error('Error: Only one parameter is needed.');
    printUsage();
    return;
}

var password = args[0];
console.info('\n\nGENERATED HASHED PASSWORD');
console.info('=================================================\n');
console.info('Password:\t' + password);
console.info('Hash:\t\t' + hashPassword(password));
console.info('\n\n');
