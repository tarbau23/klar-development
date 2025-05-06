"use client";

import { useRef} from "react";
import Image from "next/image";

import BackButton from "@/components/ui/backButton";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useLanguage } from "@/context/languageContext";
import { shareOnWhatsApp } from "@/lib/shareOnWhatsapp";
import { shareOnFacebook } from "@/lib/shareOnFacebook";
import { shareOnTelegram } from "@/lib/shareOnTelegram";

import {
  ThumbsDown,
  ThumbsUp,
  Facebook,
} from "lucide-react";
import { useRouter } from "next/navigation";
import SocialShareLinks from "@/components/socialShare.";

export default function Component() {
  //context
  const { getAppLanguage } = useLanguage();
  
  //Initializers
  const t: any = getAppLanguage();
  let router : any= useRouter()

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
        <p className="text-md text-center font-bold mb-[20px]">AGB</p>
        <p className="text-sm">
                  Allgemeine Geschäftsbedingungen (AGB)
                  1. Geltungsbereich
                  Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der App Klar, die es den Nutzern ermöglicht, Dokumente hochzuladen oder Fotos von Dokumenten zu machen, die dann automatisch in die gewünschte Sprache des Nutzers übersetzt werden.
                  2. Anbieter der App
                  Anbieter der App ist:
                  Kheira Belhayara technische Dienstleistungen
                  Zur Feldmühle 02, 59821 Arnsberg
                  Deutschland
                  3. Nutzungsgegenstand und Funktionen
                  (1) Die App bietet den Nutzern die Möglichkeit, Fotos von Dokumenten zu machen oder PDF-Dokumente hochzuladen. Diese Dokumente werden dann automatisch in die von dem Nutzer gewählte Sprache übersetzt.
                  (2) Die App verwendet maschinelles Übersetzen (z.B. durch KI-gestützte Übersetzungsdienste), und es kann keine 100%ige Genauigkeit der Übersetzungen garantiert werden.
                  4. Nutzung der App
                  (1) Der Nutzer verpflichtet sich, die App ausschließlich für rechtmäßige und zulässige Zwecke zu verwenden und keine Inhalte zu hochzuladen oder zu verbreiten, die gegen geltendes Recht oder die Rechte Dritter verstoßen.
                  (2) Der Nutzer ist für die Inhalte, die er in die App hochlädt, vollständig verantwortlich und garantiert, dass er über alle notwendigen Rechte an den hochgeladenen Dokumenten verfügt.
                  (3) Der Nutzer ist verpflichtet, keine Urheberrechtsverletzungen oder andere Verstöße gegen geistiges Eigentum zu begehen.
                  5. Haftung
                  (1) Der Anbieter übernimmt keine Haftung für die Richtigkeit und Vollständigkeit der Übersetzungen, die durch die App erzeugt werden.
                  (2) Der Anbieter haftet nicht für direkte oder indirekte Schäden, die aus der Nutzung der App oder der fehlerhaften Übersetzung von Dokumenten entstehen, es sei denn, es liegt grobe Fahrlässigkeit oder Vorsatz vor.
                  (3) Der Anbieter haftet nicht für technische Störungen oder Ausfälle der App, die außerhalb seiner Kontrolle liegen, wie z.B. Ausfälle von Drittanbieterdiensten, auf die die App zugreift.
                  6. Urheberrecht
                  (1) Die App und alle damit verbundenen Inhalte, einschließlich der Übersetzungen, unterliegen dem Urheberrecht des Anbieters oder der Drittanbieter, von denen Inhalte und Technologien genutzt werden.
                  (2) Der Nutzer erhält ein nicht übertragbares, nicht ausschließliches Nutzungsrecht an den in der App bereitgestellten Übersetzungen, das auf den persönlichen Gebrauch beschränkt ist.
                  (3) Es ist dem Nutzer nicht gestattet, die Übersetzungen oder die App für kommerzielle Zwecke zu verwenden, zu reproduzieren oder zu verbreiten, ohne vorherige ausdrückliche Genehmigung des Anbieters.
                  7. Datenschutz
                  (1) Der Schutz Ihrer persönlichen Daten ist uns wichtig. Informationen zur Erhebung, Verarbeitung und Nutzung Ihrer personenbezogenen Daten finden Sie in unserer [Datenschutzerklärung-Link].
                  (2) Wir erheben und verarbeiten nur die Daten, die zur Bereitstellung der App erforderlich sind, und speichern diese Daten gemäß den geltenden Datenschutzgesetzen.
                  8. Änderungen der AGB
                  Der Anbieter behält sich das Recht vor, diese AGB jederzeit zu ändern. Änderungen werden den Nutzern in der App angezeigt und sind ab dem Zeitpunkt der Veröffentlichung der neuen AGB wirksam.
                  9. Anwendbares Recht und Gerichtsstand
                  (1) Es gilt deutsches Recht unter Ausschluss des internationalen Privatrechts.
                  (2) Der Gerichtsstand für alle Streitigkeiten aus diesem Vertrag ist [Ort, z.B. Berlin], sofern der Nutzer Kaufmann, eine juristische Person des öffentlichen Rechts oder ein öffentlich-rechtliches Sondervermögen ist.
                  10. Schlussbestimmungen
                  Sollte eine Bestimmung dieser AGB ungültig oder nicht durchsetzbar sein, bleiben die übrigen Bestimmungen davon unberührt. An die Stelle der ungültigen Bestimmung tritt eine solche, die dem wirtschaftlichen Zweck der ungültigen Bestimmung am nächsten kommt.

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

        <Button variant="ghost" size="icon">
          <ThumbsDown
            className="w-6 h-6 "
            style={{ height: "30px", width: "30px", color: "#006A4E" }}
          />
          <span className="sr-only">Dislike</span>
        </Button>
      </div>

      {/* Social Media Links */}
      <SocialShareLinks />
    </div>
  );
}
