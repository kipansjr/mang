const fs = require('fs');
const axios = require('axios');
const figlet = require('figlet');
const colors = require('@colors/colors');
const readline = require('readline-sync');

// Clear console
console.clear();

// Tampilkan banner
console.log(figlet.textSync('NETVANCEFACEBOOK').cyan);

// Baca konfigurasi dari config.json
const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
const { proxyusername, proxypassword, proxyhost, proxyport } = config;

// Input jumlah akun
const jumlah = parseInt(readline.question('How many accounts do you want to generate? '.yellow), 10);
if (isNaN(jumlah) || jumlah <= 0) {
  console.log('❌ Jumlah tidak valid'.red);
  process.exit(1);
}

console.log(`\n🔧 Generating ${jumlah} account${jumlah > 1 ? 's' : ''}...\n`.green);

// Pastikan folder data/ ada
if (!fs.existsSync('data')) {
  fs.mkdirSync('data');
}

(async () => {
  for (let i = 0; i < jumlah; i++) {
    const queryParams = new URLSearchParams({
      proxyusername,
      proxypassword,
      proxyhost,
      proxyport
    }).toString();

    const url = `http://api.netvance.fun/facebook?${queryParams}`;

    try {
      const res = await axios.get(url, {
        headers: { Authorization: 'Bearer NETVANCE' }
      });

      const akun = res.data?.akun;
      if (akun?.email && akun?.password) {
        console.log(`✅ ${'Account #' + (i + 1)}`.bgGreen.black);
        console.log(`EMAIL    : `.cyan + akun.email);
        console.log(`PASSWORD : `.cyan + akun.password);
        console.log(`TOKEN    : `.cyan + (akun.token || 'N/A'));
        console.log('-----------------------------'.gray);

        const saveLine = `${akun.email}:${akun.password}:${akun.token || 'N/A'}\n`;
        fs.appendFileSync('data/accounts.txt', saveLine);
      } else {
        console.log(`❌ Gagal membuat akun ke-${i + 1}`.red, res.data);
      }
    } catch (err) {
      console.error(`❌ Request gagal akun ke-${i + 1}`.red, err.response?.data || err.message);
    }
  }
})();