import fs from "fs";
import Yargs from "yargs";

const configParser = (configPath: string): any => {
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

  // Backwards compatibility for directory string, as opposed to an array
  if (config.directory && typeof config.directory === "string") {
    config.directory = [config.directory];
  }

  return config;
};

export function getArgs(): Yargs.Argv {
  // @ts-ignore Work around deep types.
  return Yargs.usage("Usage: barrelsby [options]")
    .example("barrelsby", "Run barrelsby")

    .string("b")
    .alias("b", "baseUrl")
    .nargs("b", 1)
    .describe(
      "b",
      "The base url relative to 'directory' for non-relative imports (with tsconfig's baseUrl)."
    )

    .config("c", configParser)
    .alias("c", "config")
    .describe("c", "The location of the config file.")

    .array("d")
    .alias("d", "directory")
    .describe("d", "A list of directories to create barrels for.")
    .default("d", ["./"])

    .boolean("D")
    .alias("D", "delete")
    .describe("D", "Delete existing barrel files.")
    .default("D", false)

    .array("e")
    .alias("e", "exclude")
    .describe(
      "e",
      "Excludes any files whose paths match any of the regular expressions."
    )

    .array("E")
    .alias("E", "exportDefault")
    .describe(
      "E",
      "Also export the default export of the file. Currently works only with the `flat` mode."
    )

    .help("h")
    .alias("h", "help")
    .default("h", false)

    .array("i")
    .alias("i", "include")
    .describe(
      "i",
      "Only include files whose paths match any of the regular expressions."
    )

    .string("l")
    .alias("l", "location")
    .describe("l", "The mode for picking barrel file locations")
    .choices("l", ["top", "below", "all", "replace", "branch"])
    .default("l", "top")

    .boolean("L")
    .alias("L", "local")
    .describe("L", "Barrels only include files from same directory.")
    .default("L", false)

    .string("n")
    .alias("n", "name")
    .describe("n", "The name to give barrel files")
    .default("n", "index")

    .string("s")
    .alias("s", "structure")
    .describe("s", "The mode for structuring barrel file exports")
    .choices("s", ["flat", "filesystem"])
    .default("s", "flat")

    .string("t")
    .alias("t", "exportNameType")
    .describe("t", "The exported names type for barrel file")
    .choices("t", ["*", "name"])
    .default("t", "*")

    .boolean("q")
    .alias("q", "singleQuotes")
    .describe(
      "q",
      "Use single quotes for paths instead of the default double quotes"
    )
    .default("q", false)

    .boolean("S")
    .alias("S", "noSemicolon")
    .describe(
      "S",
      "Omit semicolons from the end of lines in the generated barrel files."
    )
    .default("S", false)

    .version()
    .alias("v", "version")
    .default("v", false)

    .boolean("V")
    .alias("V", "verbose")
    .describe("V", "Display additional logging information")
    .default("V", false);
}
