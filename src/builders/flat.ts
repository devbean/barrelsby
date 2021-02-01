import { Project } from "ts-morph";
import { buildImportPath, getBasename } from "../builder";
import { BaseUrl } from "../options/baseUrl";
import { ExportNameType } from "../options/exportNameType";
import { Logger } from "../options/logger";
import { SemicolonCharacter } from "../options/noSemicolon";
import { QuoteCharacter } from "../options/quoteCharacter";
import { Directory, Location } from "../utilities";

const project: Project = new Project();

export function buildFlatBarrel(
  directory: Directory,
  modules: Location[],
  quoteCharacter: QuoteCharacter,
  semicolonCharacter: SemicolonCharacter,
  exportNameType: ExportNameType,
  logger: Logger,
  baseUrl: BaseUrl,
  exportDefault: boolean
): string {
  return modules.reduce((previous: string, current: Location) => {
    const importPath = buildImportPath(directory, current, baseUrl);
    logger(`Including path ${importPath}`);
    if (exportDefault) {
      const filename = getBasename(current.path);
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
      } else {
        return (previous += `export * from ${quoteCharacter}${importPath}${quoteCharacter}${semicolonCharacter}
`);
      }
    } else {
      return (previous += `export * from ${quoteCharacter}${importPath}${quoteCharacter}${semicolonCharacter}
`);
    }
  }, "");
}
