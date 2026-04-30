import {mkdirSync, writeFileSync} from "fs";
import path from "path";
import type {Reporter, TestModule} from "vitest/node";
import {defaultOutputFile, defaultUserName} from "./constants.js";
import {generateTrx, IOptions} from "./trx-generator.js";

export default class TrxReporter implements Reporter {
  private readonly options: IOptions;
  private testModules: TestModule[] = [];

  public constructor(options: IOptions) {
    this.options = {
      ...options,
      defaultUserName: options?.defaultUserName ?? defaultUserName,
      outputFile: options?.outputFile ?? defaultOutputFile,
    };
  }

  public onTestModuleEnd(testModule: TestModule) {
    this.testModules.push(testModule);
    const trx = generateTrx(this.testModules, this.options);

    const targetDir = path.dirname(path.resolve(this.options.outputFile));
    mkdirSync(targetDir, {recursive: true});

    writeFileSync(this.options.outputFile, trx, {encoding: "utf8"});
    process.stdout.write(`TRX file output to "${this.options.outputFile}"\n`);
  }
}
