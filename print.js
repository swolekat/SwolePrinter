const fs = require('fs');
const path = require('path');
const ini2Json = require('ini-to-json');
const pdf = require('html-pdf');

const pathToIniFile = path.join(__dirname, 'message.ini');
const pathToTempPDFFile = path.join(__dirname, 'temp.pdf');
const pathToTemplateHtmlFile = path.join(__dirname, 'template.html');
const { print } =  require("pdf-to-printer");

const removeQuotes = str => {
    return str.substr(1, str.length - 2);
}

const processMessage = (json) => {
    const message = json.message.value;
    const unquotedMessage = removeQuotes(message);
    let messageMinusCommand = unquotedMessage;
    if(json.command_to_remove.value){
        messageMinusCommand = unquotedMessage.replace(`${json.command_to_remove.value.length} `, '');
    }
    if(json.show_images === '"false"'){
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

const getHtmlFileContents = (json) => {
    return `${fs.readFileSync(pathToTemplateHtmlFile)}`.replace('%SENDER_DISPLAY_NAME%', removeQuotes(json.recipient_display_name.value)).replace('%MESSAGE%', processMessage(json));
};

const printFile = () => {
    const iniFileContents = `${fs.readFileSync(pathToIniFile)}`;
    console.log(iniFileContents);
    const json = ini2Json.parse(iniFileContents);
    const htmlFileContents = getHtmlFileContents(json);
    console.log(htmlFileContents);

    pdf.create(htmlFileContents, { renderDelay: 1000 }).toFile(pathToTempPDFFile, () => {
        print(pathToTempPDFFile, {scale: 'noscale', printer: removeQuotes(json.printer_name.value)});
    });
};

printFile();