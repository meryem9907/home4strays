import { renderFile } from "template-file";
import path from "path";

class VerifyMail {
  private lang = "en";

  // store values to inject
  constructor(lang: string = "en") {
    this.lang = lang;
  }

  // load external template and fill in data
  public async getEmail(): Promise<string> {
    const templatePath = path.join(
      __dirname,
      "verified-email-templates",
      `verified-email-${this.lang}.html`,
    );
    return await renderFile(templatePath, {});
  }
}

export { VerifyMail };
