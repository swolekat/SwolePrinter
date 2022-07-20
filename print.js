const fs = require('fs');
const path = require('path');
const ini2Json = require('ini-to-json');
const pdf = require('html-pdf');

const pathToIniFile = path.join(__dirname, 'message.ini');
const pathToTempPDFFile = path.join(__dirname, 'temp.pdf');
const { print } =  require("pdf-to-printer");

const defaultValues = {
    template_name: 'template',
    replacement_map: '{}',
};

const booleanKeys = ['raw_html', 'show_images'];

const removeQuotes = str => {
    return str.substr(1, str.length - 2);
}

const getDataFromIniFile = () => {
    const iniFileContents = `${fs.readFileSync(pathToIniFile)}`;
    console.log(iniFileContents);
    const json = ini2Json.parse(iniFileContents);
    const cleanJson = {};
    Object.keys(json).forEach(key => {
        cleanJson[key] = removeQuotes(json[key].value);
        if(booleanKeys.includes(key)){
            cleanJson[key] = cleanJson[key] === '1';
        }
    });
    Object.keys(defaultValues).forEach(key => {
        if(cleanJson[key] !== ''){
            return;
        }
        cleanJson[key] = defaultValues[key];
    });

    return cleanJson;
};

const processString = (data, string) => {
    let messageMinusCommand = string;
    if(data.text_to_remove){
        messageMinusCommand = string.replace(`${data.text_to_remove.length} `, '');
    }
    if(!data.show_images){
        return messageMinusCommand;
    }
    const wordsInMessage = messageMinusCommand.split(' ');
    const updatedWords = [];
    for(let word of wordsInMessage) {
        if(!word.startsWith("http")){
            updatedWords.push(word);
            continue;
        }
        updatedWords.push(`<img src="${word}" />`);
    }
    return updatedWords.join(' ');
};


const getHtmlFileContents = (data) => {
    const pathToTemplateHtmlFile = path.join(__dirname, `${data.template_name}.html`);
    const templateFileContents = `${fs.readFileSync(pathToTemplateHtmlFile)}`;
    if(data.raw_html){
        return templateFileContents.replace('%MESSAGE%', decodeURI(data.message));
    }

    const replacementMap = JSON.parse(decodeURI(data.replacement_map));
    return Object.keys(replacementMap).reduce((sum, key) => {
        const processedValue =  processString(data, replacementMap[key]);
        return templateFileContents.replace(`${key}`, processedValue);
    }, templateFileContents);
};

const printFile = () => {
    const data = getDataFromIniFile();
    const htmlFileContents = getHtmlFileContents(data);
    pdf.create(htmlFileContents, { renderDelay: 1000 }).toFile(pathToTempPDFFile, () => {
        print(pathToTempPDFFile, {scale: 'noscale', printer: data.printerName === '' ? undefined : data.printerName});
    });
};

printFile();