// class for generating invite-emails
// contains html template with placeholders for name and invitation link

import { renderFile } from "template-file";
import path from "path";

class InviteEmail {
  private name = "";
  private inviteLink = "";
  private lang = "en";

  // store values to inject
  constructor(
    inviteLink: string,
    lang: string = "en",
    name: string = "Straylover",
  ) {
    this.inviteLink = inviteLink;
    this.name = name;
    this.lang = lang;
  }

  // load external template and fill in data
  public async getEmail(): Promise<string> {
    const templatePath = path.join(
      __dirname,
      "invite-email-templates",
      `invite-email-${this.lang}.html`,
    );
    return await renderFile(templatePath, {
      name: this.name,
      inviteLink: this.inviteLink,
    });
  }
}

export { InviteEmail };
