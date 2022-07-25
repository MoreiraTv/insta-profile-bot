import * as puppeteer from "puppeteer";
import Leite from "leite";

const gerar = new Leite();

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--disable-dev-shm-usage"],
  });
  const page = await browser.newPage();

  let nome = gerar.pessoa.nome();

  try {
    await page.goto("https://google.com", {
      waitUntil: "load",
      // waitUntil: "networkidle2",
      timeout: 0,
    });

    const element = await page.$("input[title='Pesquisar']");

    if (element) {
      element.click();
      await page.waitForTimeout(2000);
      page.keyboard.type(nome, {delay: 100});
      await page.waitForTimeout(1000);
      await page.keyboard.press('Enter'); // Enter Key
      await page.waitForTimeout(2000);

      console.log("Pesquisando: ", nome);
    }else{
      console.log("não achei o elemento");
    }
  } catch (error) {
    console.log(error);
    console.log("não deu 😥");
  }
})();


let date = new Date();
date = date.toString().slice(16, 24);
console.log(date);
//Thu Oct 10 2019 18:39:13 GMT-0300 (Horário Padrão de Brasília)