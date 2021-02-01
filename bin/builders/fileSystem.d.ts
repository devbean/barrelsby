import { BaseUrl } from "../options/baseUrl";
import { ExportNameType } from "../options/exportNameType";
import { Logger } from "../options/logger";
import { SemicolonCharacter } from "../options/noSemicolon";
import { QuoteCharacter } from "../options/quoteCharacter";
import { Directory, Location } from "../utilities";
export declare function buildFileSystemBarrel(directory: Directory, modules: Location[], quoteCharacter: QuoteCharacter, semicolonCharacter: SemicolonCharacter, _1: ExportNameType, _: Logger, // Not used
baseUrl: BaseUrl): string;
