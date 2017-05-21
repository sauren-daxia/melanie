var fs = require('fs');

function formatText(path) {
    let text = fs.readFileSync(path).toString();
    text = text.replace(/\s*-\s*/g, '-');
    text = text.replace(/\s*—\s*/g, '-');
    text = text.replace(/\s*--\s*/g, '-');
    text = text.replace(/\s*－\s*/g, '-');
    text = text.replace(/。[\s]*\n/g, '\n');
    text = text.replace(/。/g, '\n');
    text = text.replace(/；[\s]*\n/g, '\n');
    text = text.replace(/；/g, '\n');
    // text = text.replace(/[^a-z]+;/g, '\n');
    text = text.replace(/至\s*/g, '至');
    years = text.match(/[期\(\s（其间：]*(\s|\n)[0-9]{4}[\.\d]*(\-|年)/g)
    if (years) {
        years.forEach(function (year) {
            text = text.replace(year, '\n' + year.trim());
        })
    }
    else {
        console.log('Not find years: ' + path)
    }
    text = text.replace(/\n[\s]*\n/g, '\n').replace(/\n$/, '')
    text.split('\n').forEach(function (line) {
        text = text.replace(line, line.trim());
    })
    // fs.writeFileSync(path.replace('.xml', '_new.xml'), text);
    fs.writeFileSync(path, text);
}

formatText(process.argv[2]);
