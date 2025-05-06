"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import BackButton from "@/components/ui/backButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Loader from "@/components/ui/loader";

import { useLanguage } from "@/context/languageContext";
import { useMessageContext } from "@/context/messagesContext";
import { shareOnWhatsApp } from "@/lib/shareOnWhatsapp";
import { shareOnFacebook } from "@/lib/shareOnFacebook";
import { shareOnTelegram } from "@/lib/shareOnTelegram";

import {
  Camera,
  Search,
  ThumbsDown,
  ThumbsUp,
  Upload,
  Facebook,
} from "lucide-react";
import SocialShareLinks from "@/components/socialShare.";

export default function Component() {
  //context
  const { getAppLanguage } = useLanguage();

  //Initializers
  const t: any = getAppLanguage();
  const router: any = useRouter();

  //refs
  const scrollAreaRef: any = useRef(null);

  return (
    <div className="flex flex-col max-w-[40rem] mx-auto p-4 space-y-6 justify-start items-center">
      {/* Text Content */}
      <ScrollArea
        ref={scrollAreaRef}
        className="h-[50vh] rounded-md border p-4 w-[100%]"
        style={{ borderColor: "#006A4E1F" }}
        scrollHideDelay={5000}
      >
        <p className="text-md text-center font-bold mb-[20px]">Datenschutzerklärung</p>
        <p className="text-sm">
          Datenschutzerklärung
1. Allgemeine Informationen
Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen. In dieser Datenschutzerklärung informieren wir Sie darüber, welche personenbezogenen Daten wir erheben, wie diese verarbeitet werden und welche Rechte Sie in Bezug auf Ihre Daten haben.
Die Erhebung und Verarbeitung Ihrer personenbezogenen Daten erfolgt im Einklang mit den geltenden Datenschutzgesetzen, insbesondere der Datenschutz-Grundverordnung (DSGVO).
2. Verantwortliche Stelle
Verantwortlich für die Erhebung, Verarbeitung und Nutzung Ihrer personenbezogenen Daten im Sinne der DSGVO ist:
Kheira Belhayara technische Dienstleistungen
Zur Feldmühle 02, 59821 Arnsberg
Deutschland
E-Mail: info@kbtechnik.com
3. Erhebung und Verarbeitung personenbezogener Daten
(1) Daten, die Sie uns bereitstellen:
Wir erheben personenbezogene Daten, die Sie uns direkt zur Verfügung stellen, z.B. durch das Hochladen von Dokumenten oder das Fotografieren von Dokumenten. Dies kann umfassen:
•	Name (sofern angegeben)
•	E-Mail-Adresse (sofern angegeben)
•	Hochgeladene Dokumente oder Bilder
•	Nutzungsdaten der App (wie die Art des hochgeladenen Dokuments oder der Bilddatei)
(2) Automatisch erfasste Daten:
Beim Zugriff auf die App werden automatisch bestimmte technische Informationen erfasst, wie:
•	IP-Adresse
•	Geräteinformationen (z.B. Modell, Betriebssystem)
•	App-Interaktionen (z.B. besuchte Seiten, Nutzungszeiten)
•	Protokolldaten über die Nutzung der App (z.B. Fehlerprotokolle)
4. Zweck der Datenverarbeitung
Wir verarbeiten Ihre Daten zu folgenden Zwecken:
•	Bereitstellung der Funktionen der App (z.B. Übersetzung von Dokumenten)
•	Verbesserung der App und ihrer Funktionalitäten
•	Kommunikation mit Ihnen (z.B. Support-Anfragen)
•	Einhaltung gesetzlicher Vorschriften
5. Keine Nutzung für Werbezwecke und keine Weitergabe an Dritte
(1) Wir erheben keine personenbezogenen Daten für Werbezwecke.
(2) Ihre personenbezogenen Daten werden nicht an Dritte weitergegeben, verkauft oder für kommerzielle Zwecke genutzt.
(3) Ihre Daten werden ausschließlich für die oben genannten Zwecke verwendet und bleiben innerhalb des Unternehmens.
6. Rechtsgrundlage der Verarbeitung
Die Verarbeitung Ihrer personenbezogenen Daten erfolgt auf Grundlage der folgenden Rechtsgrundlagen:
•	Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO): Wir benötigen Ihre Daten zur Erfüllung unserer vertraglichen Verpflichtungen (z.B. Bereitstellung der Übersetzungsdienste).
•	Einwilligung (Art. 6 Abs. 1 lit. a DSGVO): Sofern erforderlich, holen wir Ihre Einwilligung zur Verarbeitung Ihrer personenbezogenen Daten ein (z.B. bei der Erhebung von personenbezogenen Daten für die Kommunikation).
•	Berechtigte Interessen (Art. 6 Abs. 1 lit. f DSGVO): Die Verarbeitung Ihrer Daten erfolgt auch, um unsere App zu optimieren und technische Probleme zu beheben.
7. Speicherung Ihrer Daten
Wir speichern Ihre personenbezogenen Daten nur so lange, wie dies für die Zwecke erforderlich ist, für die sie erhoben wurden, oder wie es gesetzliche Aufbewahrungspflichten vorschreiben. Nach Ablauf dieser Fristen werden die Daten gelöscht oder anonymisiert.
8. Sicherheit der Daten
Wir ergreifen geeignete technische und organisatorische Maßnahmen, um Ihre personenbezogenen Daten vor Verlust, Missbrauch oder unbefugtem Zugriff zu schützen. Dazu gehören Maßnahmen wie die Verschlüsselung von Daten und die Absicherung unserer Server.
9. Ihre Rechte als betroffene Person
Sie haben als betroffene Person die folgenden Rechte:
•	Auskunftsrecht: Sie können Auskunft darüber verlangen, welche personenbezogenen Daten wir über Sie speichern.
•	Berichtigungsrecht: Sie können die Berichtigung unrichtiger oder unvollständiger Daten verlangen.
•	Recht auf Löschung: Sie können unter bestimmten Voraussetzungen die Löschung Ihrer personenbezogenen Daten verlangen.
•	Recht auf Einschränkung der Verarbeitung: Sie können die Verarbeitung Ihrer Daten unter bestimmten Umständen einschränken lassen.
•	Recht auf Datenübertragbarkeit: Sie können die Übertragung Ihrer personenbezogenen Daten in einem strukturierten, gängigen und maschinenlesbaren Format verlangen.
•	Widerrufsrecht: Sie können Ihre Einwilligung zur Verarbeitung Ihrer Daten jederzeit widerrufen.
•	Widerspruchsrecht: Sie können gegen die Verarbeitung Ihrer Daten Widerspruch einlegen, sofern die Verarbeitung auf unserem berechtigten Interesse beruht.
Wenn Sie eines dieser Rechte ausüben möchten, können Sie uns unter den oben angegebenen Kontaktdaten erreichen.
10. Cookies und Tracking-Technologien
Unsere App verwendet möglicherweise Cookies und ähnliche Technologien, um die Nutzung der App zu analysieren und zu verbessern. Weitere Informationen finden Sie in unserer Cookie-Richtlinie.
11. Änderungen dieser Datenschutzerklärung
Wir behalten uns vor, diese Datenschutzerklärung von Zeit zu Zeit zu ändern, um sie an neue rechtliche Vorgaben oder Änderungen in der Verarbeitung anzupassen. Wir werden Sie über wesentliche Änderungen informieren. Die aktuelle Version der Datenschutzerklärung ist stets in der App abrufbar.
12. Kontakt
Für Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte können Sie uns jederzeit kontaktieren unter:
E-Mail: info@kbtechnik.com
Adresse: Kheira Belhayara technische Dienstleistungen, Zur Feldmühle 02, 59821 Arnsberg, Deutschland


        </p>
      </ScrollArea>

      {/* Feedback Buttons */}
      <div className="flex justify-between items-between w-[100%]">
        <Button variant="ghost" size="icon">
          <ThumbsUp
            className="w-6 h-6"
            style={{ height: "30px", width: "30px", color: "#006A4E" }}
          />
          <span className="sr-only">Like</span>
        </Button>
        {/* <Share2
          className="w-5 h-5 text-black mt-[20px] mb-[-20px]"
          style={{ height: "30px", width: "30px" }}
        /> */}
        <Button variant="ghost" size="icon">
          <ThumbsDown
            className="w-6 h-6 "
            style={{ height: "30px", width: "30px", color: "#006A4E" }}
          />
          <span className="sr-only">Dislike</span>
        </Button>
      </div>

      {/* Ask Again Button */}
      {/* <div className="flex justify-center">
        <Button variant="outline" className="rounded-full" style={{borderColor: "#000"}}>
          <RefreshCcw className="w-4 h-4 mr-2" />
          {t.onceAgain}
        </Button>
      </div> */}

      {/* Social Media Links */}
     <SocialShareLinks />
    </div>
  );
}
