const fs = require('fs');
console.log(`
   //-/ -//  //-/ //-  //-/ //-  // / //-
  //-/  //  //-/ // / //-/ // /   -  // /
 //    //- //   //-  //   //-  // / // /
 prod.kr :: prodzpod 2024
 have a nice day!
`);

(async() => {
   let extern = {};
   if (fs.existsSync(require.resolve('./external/init'))) extern = await require('./external/init').init();
   if (await require('./src/@main/include').init()) return;
   await require('./src/@main/main').init(extern);
})();