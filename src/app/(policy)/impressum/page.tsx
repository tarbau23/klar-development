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
        <p className="text-md text-center font-bold mb-[20px]">
            Impressum
        </p>
        <p className="text-sm">
          Impressum
Angaben gemäß § 5 TMG:
Betreiber der App:
Kheira Belhayara technische dienstleistung
Zur Feldmühle 02, 59821- Arnsberg
Deutschland
Vertreten durch:
Kheira Belhayara
Kontakt:
Telefon: +49 2931 5327521
Haftungsausschluss:
Die Inhalte dieser App wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte übernehmen wir jedoch keine Gewähr. Eine Haftung für etwaige Schäden, die aus der Nutzung der App entstehen, ist ausgeschlossen, soweit diese nicht auf vorsätzlichem oder grob fahrlässigem Verhalten beruhen.
Urheberrecht:
Alle Inhalte und Werke in dieser App, die durch den Betreiber erstellt wurden, unterliegen dem deutschen Urheberrecht. Eine Vervielfältigung, Bearbeitung oder sonstige Nutzung der Inhalte ist ohne ausdrückliche Zustimmung des Betreibers nicht gestattet.
Datenschutzerklärung:
Wir nehmen den Schutz Ihrer persönlichen Daten ernst. Weitere Informationen zur Erhebung, Verarbeitung und Nutzung Ihrer Daten finden Sie in unserer 

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
