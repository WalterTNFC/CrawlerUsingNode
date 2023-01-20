
const rp = require('request-promise')
const cheerio = require('cheerio')
const fs = require("fs");

const companyName = "Lend";
// const url = `https://${companyName}.guppy.io`;
const url = `https://jobs.lever.co/${companyName}`

const options = {
  uri: url,
  transform: function (body) {
    return cheerio.load(body)
  }
}

async function processarDados(dados){
  //salva no banco de dados
  console.log(JSON.stringify(dados))
  fs.writeFile("processosLever.json", JSON.stringify(dados), err => {
     
    // Checking for errors
    if (err) throw err; 
   
    console.log("Done writing");
  });
}

function crawlerToGupy() {
  rp(options)
  .then(($) => {
    const processos = []
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
        processos.push(processo)
    })
    processarDados(processos)
  })
  .catch((err) => {
    console.log(err)
  })
}

function crawlerToLever() {
  rp(options)
  .then(($) => {
    const processos = []
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
        processos.push(processo)
    })
    processarDados(processos)
  })
  .catch((err) => {
    console.log(err)
  })
}


if (url.includes("gupy")) {
  crawlerToGupy()
}

else{
  crawlerToLever()
}