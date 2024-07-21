import fs from 'fs';
import path from 'path';

async function main() {
    const contractsDir = path.join(__dirname, '..', 'artifacts', 'contracts');
    const outputDir = path.join(__dirname, '..', '..', 'frontend', 'src', 'contracts');

    console.log('Contracts directory:', contractsDir);
    console.log('Output directory:', outputDir);

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        console.log('Created output directory');
    }

    const contractFiles = fs.readdirSync(contractsDir);
    console.log('Files in contracts directory:', contractFiles);

    for (const contractFolder of contractFiles) {
        const fullContractDir = path.join(contractsDir, contractFolder);
        if (fs.statSync(fullContractDir).isDirectory()) {
            const files = fs.readdirSync(fullContractDir);
            const jsonFile = files.find(file => file.endsWith('.json') && !file.endsWith('.dbg.json'));

            if (jsonFile) {
                console.log('Processing file:', jsonFile);
                const fullPath = path.join(fullContractDir, jsonFile);
                const contractData = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

                const outputData = {
                    abi: contractData.abi,
                    address: "CONTRACT_ADDRESS_PLACEHOLDER"
                };

                const outputPath = path.join(outputDir, jsonFile);
                fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));
                console.log(`Generated contract info for ${jsonFile} at ${outputPath}`);
            }
        }
    }
}

main()
    .then(() => {
        console.log('Contract info generation complete');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Error in main function:', error);
        process.exit(1);
    });