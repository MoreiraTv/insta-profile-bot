import * as puppeteer from "puppeteer";
import fs from "fs";
import crypto from "crypto";
import Leite from "leite";

const gerar = new Leite();

if (fs.existsSync("credentials.txt")) {
  console.log("O arquivo credentials já existe!");
} else {
  fs.writeFile("credentials.txt", "", (err) => {
    if (err) throw err;
    console.log("O arquivo foi criado!");
  });
}

function removeAcento(text) {
  text = text.toLowerCase();
  text = text.replace(new RegExp("[ÁÀÂÃ]", "gi"), "a");
  text = text.replace(new RegExp("[ÉÈÊ]", "gi"), "e");
  text = text.replace(new RegExp("[ÍÌÎ]", "gi"), "i");
  text = text.replace(new RegExp("[ÓÒÔÕ]", "gi"), "o");
  text = text.replace(new RegExp("[ÚÙÛ]", "gi"), "u");
  text = text.replace(new RegExp("[Ç]", "gi"), "c");
  return text;
}

function numberRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


let account = async () => {
  const browser = await puppeteer.launch({ 
    headless: false, 
    args: [
      '--disable-dev-shm-usage',
] });
  const page = await browser.newPage();
  
  let date = new Date();
  console.log(date);
  //Thu Oct 10 2019 18:39:13 GMT-0300 (Horário Padrão de Brasília)

  let nome = gerar.pessoa.nome();
  let hash = crypto.createHash("md5").update(date.toString()).digest("hex");
  let usuario =
  removeAcento(nome.replace(/\s+/g, ".").toLowerCase()) + hash.slice(0, 5);
  let senha = hash
  .slice(0, 10)
  .replace("3", "@")
  .replace("7", "%")
  .replace("2", "$")
  .replace("a", "4")
  .replace("1", ".");
  let email = `mcodec91+${usuario}@proton.me`;
  let nasc = gerar.pessoa.nascimento({ string: true, idade: 21 });

  let dia = nasc.slice(0,2);
  if(dia != "10" || dia != "20" || dia != "30"){
    dia = dia.replace("0", "");
  }
  let mes = nasc.slice(4,5);
  console.log("mes: ",mes)
  if(mes != "10"){
    mes = mes.replace("0", "");
  }
  let ano = nasc.slice(6,10);

  const meses = [
    "",
    "janeiro",
    "fevereiro",
    "marco",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ]

  if(mes == 0) mes + 1;

  
  try {
    console.log(dia);
    console.log(meses[mes]);
    console.log(ano);

    async function arrowDownPress(numb){
      await page.waitForTimeout(1000);
      for(var n = 0; n < numb; n++ ){
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(100);
      }
      await page.keyboard.press('Enter');
    }
    
    await page.goto("https://instagram.com", {
      waitUntil: "networkidle2",
      timeout: 0
    });

    await page.waitForTimeout(2000);
    
    const modalCokie = await page.$('div[role="presentation"]');
    
    if(modalCokie){
      page.click('div._1XyCr > button:nth-child(3)');
      await page.waitForTimeout(3000);

      
      await page.click('a[href="/accounts/emailsignup/"]');
      await page.waitForTimeout(3000);
    }else{
      
      await page.click('a[href="/accounts/emailsignup/"]');
      await page.waitForTimeout(3000);
    }

    await page.click('input[name="emailOrPhone"]');
    await page.keyboard.type(email, {delay: 100});
    await page.waitForTimeout(3000);
  
    await page.click('input[name="fullName"]');
    await page.keyboard.type(nome, {delay: 100});
    await page.waitForTimeout(1500);
  
    await page.click('input[name="username"]');
    await page.keyboard.type(usuario, {delay: 100});
    await page.waitForTimeout(2000);
  
    await page.click('input[name="password"]');
    await page.keyboard.type(senha, {delay: 100});
    await page.waitForTimeout(4000);
  
    await page.screenshot({ path: "./screenshots/steps/parte1.png" });
    
    await page.click('[type="submit"]');
    
    await page.waitForTimeout(4000);

    //não funciona dá o click então a melhor solução é alterar por Arrow
    await page.click('select[title="Ano:"]')
    await page.waitForTimeout(1000);
    console.log(2022 - parseInt(ano));
    await page.keyboard.press('Home');
    await arrowDownPress(2022 - parseInt(ano));
    await page.waitForTimeout(1000);

    await page.click('select[title="Mês:"]');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Home');
    if(mes != 1){
      await arrowDownPress(mes-1)
    }

    await page.waitForTimeout(1000);
    await page.click('select[title="Dia:"]')
    await page.waitForTimeout(1000);
    await page.keyboard.press('Home');
    if(mes != 1){
      await arrowDownPress(dia-1)
    }
    
    await page.waitForTimeout(3000);

    await page.click('div.qF0y9.Igw0E.IwRSH.eGOV_.acqo5._4EzTm.lC6p0.g6RW6 > button', );

    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: "./screenshots/steps/parte2.png" });
    
    const element2Auth = page.$('input[aria-label="Código de confirmação"]');
    if(element2Auth){
      console.log("Chegamos na verificação de 2 etapas");
      console.log("Voce tem 120 segundos para preencher o codigo de verificação");
      for(let x = 0; x < 120; x++){
        await page.waitForTimeout(1000);
        console.log(x, " segundos!");
      }
    }
    
    await page.screenshot({ path: "./screenshots/steps/parte3.png" });

    //verificando se tem o modal de notificação do instagram
    const modalNotif = await page.$('div._a9-v');

    if(modalNotif){
      await page.click('div._a9-z > button:nth-child(2)');
      await page.waitForTimeout(1000);
    }

    //document.querySelectorAll('button._acan._acap._acas')
    const elementsButtonFolloInitial = await page.$$('button._acan._acap._acas');

    if(elementsButtonFolloInitial){
      const qtdElement = elementsButtonFolloInitial.length
      console.log(elementsButtonFolloInitial);
      console.log(qtdElement);
      for(var y=1; y <= 15; y++){
        var x = numberRandom(0, qtdElement);
        const history = [];
        if(!history.includes(x)){
          y--;
          return
        }else{
          await page.click(`button._acan._acap._acas:nth-child(${x})`);
          await page.waitForTimeout(2000);
          history.push(x);
        }
      }
    }
    
    await page.waitForTimeout(3000);
    
    await page.click('a[href="/"]');


    return [nome, usuario, senha, email];

} catch (error) {
    console.error(error);
} finally {
  // await browser.close();
}
  
  
  
};

let [nome, usuario, senha, email] = await account()


var data = "\n" +
      "=================================================="
      + new Date().toString() +
      "\n";

var data2 = 
      nome +
      "\n" +
      usuario +
      "\n" +
      senha +
      "\n" +
      email +
      "\n" +
      "=================================================="

if (nome) {
  fs.appendappendFileSyncFile(
    "credentials.txt",
    data,
    (err) => {
      if (err) throw err;
      console.log("Credentials salva!");
    }
  );
  fs.appendappendFileSyncFile(
    "credentials.txt",
    data2,
    (err) => {
      if (err) throw err;
      console.log("Credentials salva!");
    }
  );
}else{
  console.log("Não foi possivel obter dados do usuario/cadastrar")
}
