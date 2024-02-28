const Jasmine = require('jasmine');
const reporters = require('jasmine-reporters');
const jasmine = new Jasmine();

const junitReporter = new reporters.JUnitXmlReporter({
    savePath: __dirname,
    consolidateAll: true,
    filePrefix: "test-results"
});
jasmine.env.addReporter(junitReporter);

jasmine.loadConfig({
    spec_dir: 'src',
    spec_files: ['**/*[sS]pec.js'],
    random: false,
    seed: null,
    stopSpecOnExpectationFailure: false
});

console.log(`Using Jasmine version: ${jasmine.jasmine.version}`)

jasmine.execute();
