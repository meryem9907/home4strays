import React from "react";
import Link from "next/link";

export default function datapolice() {
  return (
    <div className="datenschutz-wrapper p-4 max-w-4xl mx-auto text-justify">
      <h1 className="text-2xl font-bold mb-4">Datenschutzerklärung</h1>

      <p>
        Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und Zweck
        der Verarbeitung von personenbezogenen Daten (nachfolgend kurz
        „Daten“) innerhalb unseres Onlineangebotes und der mit ihm verbundenen
        Webseiten, Funktionen und Inhalte sowie externen Onlinepräsenzen, wie
        z. B. unsere Social-Media-Profile, auf (nachfolgend gemeinsam bezeichnet
        als „Onlineangebot“). Im Hinblick auf die verwendeten
        Begrifflichkeiten, wie z. B. „Verarbeitung“ oder „Verantwortlicher“,
        verweisen wir auf die Definitionen im Art. 4 der
        Datenschutzgrundverordnung (DSGVO).
      </p>

      <p>
        <strong>Verantwortlicher</strong>
        <br />
        NGO home4Strays
        <br />
        Max Mustermannstraße 123
        <br />
        12345 Musterstadt
        <br />
        Deutschland
        <br />
        E-Mail: info@home4strays.org
        <br />
        Impressum:{" "}
        <Link href="/impressum" className="text-blue-600 underline">
          https://home4strays.org/impressum
        </Link>
      </p>

        <strong>Maßgebliche Rechtsgrundlagen</strong>
        <br />
        Nach Maßgabe des Art. 13 DSGVO teilen wir Ihnen die Rechtsgrundlagen
        unserer Datenverarbeitungen mit. Sofern die Rechtsgrundlage in dieser
        Datenschutzerklärung nicht genannt wird, gilt Folgendes:
        <br />
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>
            Die Rechtsgrundlage für die Einholung von Einwilligungen ist Art. 6
            Abs. 1 lit. a und Art. 7 DSGVO;
          </li>
          <li>
            die Rechtsgrundlage für die Verarbeitung zur Erfüllung unserer
            Leistungen und Durchführung vertraglicher Maßnahmen sowie
            Beantwortung von Anfragen ist Art. 6 Abs. 1 lit. b DSGVO;
          </li>
          <li>
            die Rechtsgrundlage für die Verarbeitung zur Erfüllung unserer
            rechtlichen Verpflichtungen ist Art. 6 Abs. 1 lit. c DSGVO;
          </li>
          <li>
            und die Rechtsgrundlage für die Verarbeitung zur Wahrung unserer
            berechtigten Interessen ist Art. 6 Abs. 1 lit. f DSGVO.
          </li>
        </ul>


      <p>
        <strong>Sicherheitsmaßnahmen</strong>
        <br />
        Wir treffen nach Maßgabe des Art. 32 DSGVO geeignete technische und
        organisatorische Maßnahmen, um ein dem Risiko angemessenes Schutzniveau
        zu gewährleisten. Dabei berücksichtigen wir den Stand der Technik, die
        Implementierungskosten, die Art, den Umfang, die Umstände und Zwecke der
        Verarbeitung sowie die unterschiedlichen Eintrittswahrscheinlichkeiten
        und Schwere der Risiken.
        <br />
        Zu den Maßnahmen gehören insbesondere die Sicherung der Vertraulichkeit,
        Integrität und Verfügbarkeit von Daten sowie Verfahren zur Wahrnehmung
        von Betroffenenrechten, zur Löschung von Daten und zur Reaktion auf
        Gefährdungen.
      </p>


        <strong>Rechte der betroffenen Personen</strong>
        <br />
        Sie haben das Recht:
        <br />
        – auf Auskunft über die von uns verarbeiteten personenbezogenen Daten
        (Art. 15 DSGVO),
        <br />
        – auf Berichtigung unrichtiger oder Vervollständigung unvollständiger
        Daten (Art. 16 DSGVO),
        <br />
        – auf Löschung Ihrer Daten (Art. 17 DSGVO) bzw. Einschränkung der
        Verarbeitung (Art. 18 DSGVO),
        <br />
        – auf Datenübertragbarkeit (Art. 20 DSGVO),
        <br />
        – auf Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO).


      <p>
        <strong>Widerrufsrecht</strong>
        <br />
        Sie haben das Recht, erteilte Einwilligungen gemäß Art. 7 Abs. 3 DSGVO
        mit Wirkung für die Zukunft zu widerrufen.
      </p>

      <p>
        <strong>Widerspruchsrecht</strong>
        <br />
        Sie können der künftigen Verarbeitung Ihrer Daten jederzeit nach
        Maßgabe des Art. 21 DSGVO widersprechen. Der Widerspruch kann
        insbesondere gegen die Verarbeitung für Zwecke der Direktwerbung
        erfolgen.
      </p>

      <p>
        <strong>SSL-Verschlüsselung</strong>
        <br />
        Unsere Website nutzt aus Sicherheitsgründen und zum Schutz der
        Übertragung vertraulicher Inhalte (z. B. Anfragen über das
        Kontaktformular) eine SSL-Verschlüsselung. Eine verschlüsselte
        Verbindung erkennen Sie an der Adresszeile des Browsers („https://“)
        und dem Schloss-Symbol.
        <br />
        Bei aktivierter SSL-Verschlüsselung können die Daten, die Sie an uns
        übermitteln, nicht von Dritten mitgelesen werden.
      </p>

      <p>
        <strong>Stand der Datenschutzerklärung</strong>
        <br />
        14. Juni 2025
      </p>

      <p className="mt-4 text-sm text-gray-600">
        Erstellt mit{" "}
        <Link
          href="https://www.datenschutz-generator.de"
          className="text-blue-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Datenschutz-Generator.de
        </Link>
        , einem Service von{" "}
        <Link
          href="https://www.kanzlei-hasselbach.de/"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Kanzlei Hasselbach
        </Link>
        .
      </p>
    </div>
  );
}
