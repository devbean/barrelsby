"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFlatBarrel = void 0;
const ts_morph_1 = require("ts-morph");
const builder_1 = require("../builder");
const project = new ts_morph_1.Project();
function buildFlatBarrel(directory, modules, quoteCharacter, semicolonCharacter, exportNameType, logger, baseUrl, exportDefault) {
    return modules.reduce((previous, current) => {
        const importPath = builder_1.buildImportPath(directory, current, baseUrl);
        logger(`Including path ${importPath}`);
        if (exportDefault) {
            const filename = builder_1.getBasename(current.path);
            previous += `export { default as ${filename} } from ${quoteCharacter}${importPath}${quoteCharacter}${semicolonCharacter}
`;
        }
        if (exportNameType === "name") {
            let exportedNames = "*";
            if (project) {
                const startLocation = baseUrl ? baseUrl : directory.path;
                if (!project.getDirectory(startLocation)) {
                    project.addSourceFilesAtPaths(`${startLocation}/**/*.ts`);
                }
                // const sourceFile = project.getSourceFileOrThrow(current.path);
                const sourceFile = project.addSourceFileAtPath(current.path);
                if (sourceFile) {
                    const exported = [];
                    for (const [name] of sourceFile.getExportedDeclarations()) {
                        exported.push(name);
                    }
                    exportedNames = `{ ${exported.sort().join(", ")} }`;
                }
                return (previous += `export ${exportedNames} from ${quoteCharacter}${importPath}${quoteCharacter}${semicolonCharacter}
`);
            }
            else {
                return (previous += `export * from ${quoteCharacter}${importPath}${quoteCharacter}${semicolonCharacter}
`);
            }
        }
        else {
            return (previous += `export * from ${quoteCharacter}${importPath}${quoteCharacter}${semicolonCharacter}
`);
        }
    }, "");
}
exports.buildFlatBarrel = buildFlatBarrel;
//# sourceMappingURL=flat.js.map