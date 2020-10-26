const fs = require('fs');
const path = require('path');

const argumentregxp = /([^=]+)/gm;
const lineregxp = /(^[^\n\r]+$)/gm;

function parseINI(file) {
    let result = `{\n`
    let lines = file.match(lineregxp)
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(';')) {
            continue
        }
        else if() {

        }
    }
    return result
}

function parseENV(file) {
    let result = '{\n'
    let lines = file.match(lineregxp)
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].match('#')) {
            continue
        }
        else {
            let values = lines[i].match(argumentregxp)
            result += `\t"${values[0]}" : "${values[1]}"`
            if (i < lines.length - 1) {
                result += ','
            }
            result += `\n`
        }
    }
    result += '}'
    return result
}

let file = process.argv[2]
let extension = path.extname(file)

if (file == undefined) {
    console.error("You must give a file as argument. Shutting down.")
    return
}
else if (fs.lstatSync(file).isDirectory()) {
    console.error("The argument you give is a directory. Choose a file. Shutting down.")
    return
}
else if (extension !== ".ini" && path.basename(file) !== "env"){
    console.error("We can't parse this file atm. Shutting down.")
}
else {
    try {
        const data = fs.readFileSync(file, 'utf8')
        let result = ''
        if (extension === ".ini") {
            result = parseINI(data)
        }
        else if(path.basename(file) === "env"){
            result = parseENV(data)
        }
        let time = new Date()
        let filename = `${path.parse(file).name}.${time.getFullYear()}${time.getMonth() + 1}${time.getDate()}${time.getHours()}${time.getMinutes()}${time.getSeconds()}.json`
        fs.writeFile(filename, result, function (err,data) {
            if (err) {
                return console.error(err);
            }
            console.log(`File '${filename}' has been successfully created`)
    })
    } catch (err) {
        console.error(err)
    }
}

