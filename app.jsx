const puppeteer = require('puppeteer')
const download = require('image-downloader')
var slugify = require('slugify')

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

const links = [
"https://www.gowatch.com.tr/detay/extraction-2?ids=697843&type=movie",
"https://www.gowatch.com.tr/detay/zaman-carki?ids=71914&type=tv"
]

// Resim indirme fonksiyonu
const imgDowloader = async (link) => {
  // Tarayıcıyı başlatır ve yeni bir boş sayfa açar
  const browser = await puppeteer.launch({ headless: true }); // headless true ise işlemleri arka planda yapar
  const page = await browser.newPage();

  //Dizideki linki sayfada açar
  await page.goto(link);

  //Sayfanın yüklenmesini vekler
  const query = await page.evaluate(() => {
    const imgElement = document.querySelector('.posterImg img'); //Almak istediğiniz resmi seçin.
    const title = document.querySelector('.title h1'); //Almak istediğiniz metni seçin.

    return {title: title.innerHTML, img: imgElement.src}

  });
  
  //Resmin yolunu, kayıt yapılacak yeri ve dosya adını belirleme 
  options = {
    url: query.img, //resmin yolu
     // resmi images klasörüne istediğim isimle kaydediyorum.
    dest: __dirname + '/images/'+slugify(query.title).toLowerCase()+'.jpg'
  };
  
  //Resim indirme işlemi
  download.image(options)
    .then(({ filename }) => {
      console.log('Kaydedildi: ', filename); //Resim kaydedildiyse dönen veri
    })
    .catch((err) => console.error(err));   // Resim kaydedilemediyse dönen hata

  await browser.close(); // tarayıcıyı kapat
};


// İşlemleri sıra ile yapsın diye dizi elemanlarını async fonksiyonda dönebiliriz.
async function main() {
  for (let link of links) {
    await imgDowloader(link);
  }
}

main();

