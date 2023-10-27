const axios = require('axios');
const fs = require('fs');
const prompt = require('prompt');

function joinCode(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

async function check(invite) {
  try {
    const headers = {
      'Range': 'bytes=0-2000',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36'
    };
    const response = await axios.get(invite, { headers });

    if (response.data.includes('<meta name="description"')) {
      console.log(`\x1b[32mValid group invite link: ${invite}\x1b[0m`);
      fs.appendFileSync('valids.txt', `${invite}\n`, 'utf8');
    } else {
      console.log(`\x1b[31mInvalid group invite link: ${invite}\x1b[0m`);
    }

  } catch (error) {
    if (error.response) {
      console.error('\x1b[31mError fetching invite:', invite, error.response.status, '\x1b[0m');
    } else {
      console.error('\x1b[31mError fetching invite:', invite, error.message, '\x1b[0m');
    }
  }
}

async function main() {
  console.log("\x1b[33m----------------------------------");
  console.log("NOTE: CHECKING IS SLOW SO YOU DON'T GET RATE-LIMITED!");
  console.log("the chances of actually finding a valid invite link are EXTREMELY tiny,");
  console.log("turning down the sleep time means more inconsistent results or ratelimits :(");
  console.log("----------------------------------\n\x1b[0m");

  prompt.start();
  prompt.message = '';
  prompt.delimiter = '';

  const choiceSchema = {
    properties: {
      choice: {
        description: `\x1b[36mMode Selection: \n\x1b[36m[1] \x1b[37mTemporary Invite Links [8 characters long] \n\x1b[36m[2] \x1b[37mPermanent Invite Links [10 characters long] \n\x1b[36m[3] \x1b[37mBoth \n\x1b[36mMode:`,
        pattern: /^[1-3]$/,
        message: 'Invalid Choice.',
        required: true
      }
    }
  };

  prompt.get(choiceSchema, async (err, result) => {
    if (err) {
      console.error('\x1b[31mError reading input. Exiting...\x1b[0m');
      return;
    }

    let codeLength;
    switch (result.choice) {
      case '1':
        codeLength = 8;
        break;
      case '2':
        codeLength = 10;
        break;
      case '3':
        codeLength = 'both';
        break;
    }

    while (true) {
      const length = codeLength === 'both' ? (Math.random() < 0.5 ? 8 : 10) : codeLength;
      const invite = `https://discord.gg/${joinCode(length)}`;
      await check(invite);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  });
}

main();
