
const rp = require('request-promise')
const cheerio = require('cheerio')
const fs = require("fs");

const companyName = "jusbrasil";
// const url = `https://${companyName}.guppy.io`;
// const url = `https://jobs.lever.co/${companyName}`;
// const url = `https://boards.greenhouse.io/${companyName}`;
const url = 'https://jobs.kenoby.com/britvicebba/position?search=&';

const options = {
  uri: url,
  transform: function (body) {
    return cheerio.load(body);
  }
}

async function processarDados(dados){
  //salva no banco de dados
  console.log(JSON.stringify(dados))
  fs.writeFile("processosKenoby.json", JSON.stringify(dados), err => {
     
    // Checking for errors
    if (err) throw err; 
   
    console.log("Done writing");
  });
}

function crawlerToGupy() {
  rp(options)
  .then(($) => {
    const processos = [];
    $('.sc-7dc8e42e-2').each((i, item) => {
      link = `${url}${$(item).find('a').prop('href')}`
      console.log(link)
      const processo = {
        id: i+1,
        ATS: "gupy",
        nm_vaga: $(item).find('.sc-7dc8e42e-4').text(),
        url_processo: link,
      }

      if(processo.nm_vaga !== "")
        processos.push(processo);
    })
    processarDados(processos);
  })
  .catch((err) => {
    console.log(err)
  })
}

function crawlerToLever() {
  rp(options)
  .then(($) => {
    const processos = [];
    $('.posting').each((i, item) => {
      link = $(item).find('a').prop('href');
      console.log(link)
      const processo = {
        id: i+1,
        ATS: "Lever",
        nm_vaga: $(item).find('h5').text(),
        url_processo: link,
      }

      if(processo.nm_vaga !== "")
        processos.push(processo);
    })
    processarDados(processos);
  })
  .catch((err) => {
    console.log(err);
  })
}

function crawlerToGreenhouse() {
  rp(options)
  .then(($) => {
    const processos = []
    $('.level-0').each((i, item) => {
      link = `https://boards.greenhouse.io${$(item).find('a').prop('href')}`;
      console.log(link);
      const processo = {
        id: i+1,
        ATS: "Greenhouse",
        nm_vaga: $(item).find('a').text(),
        url_processo: link,
      }

      if(processo.nm_vaga !== "")
        processos.push(processo);
    })
    processarDados(processos);
  })
  .catch((err) => {
    console.log(err);
  })
}

function crawlerToKenoby() {
  rp(options)
  .then(($) => {
    const processos = []
    $('.container').each((i, item) => {
      link = $(item).find('a').prop('href');
      console.log(link);
      const processo = {
        id: i+1,
        ATS: "Kenoby",
        nm_vaga: $(item).find('a').data("title"),
        url_processo: link,
      }

      if(processo.nm_vaga !== "")
        processos.push(processo);
    })
    processarDados(processos);
  })
  .catch((err) => {
    console.log(err);
  })
}


if (url.includes("gupy")) {
  crawlerToGupy();
} else if (url.includes("lever")) {
  crawlerToLever();
} else if (url.includes("greenhouse")) {
  crawlerToGreenhouse();
} else if (url.includes("kenoby")) {
  crawlerToKenoby(); 
} else {
  console.log("Empresa não crawleada");
}