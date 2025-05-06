"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Loader from "@/components/ui/loader";

import { useLanguage } from "@/context/languageContext";
import { useMessageContext } from "@/context/messagesContext";

import { marked } from "marked";

import { ArrowUpRight } from "lucide-react";
import { getSecondLastItem } from "@/lib/extraFunction";

//types
type Message = {
  role: "user" | "assistant";
  content: {
    type: "text" | "image_url";
    text?: string;
    image_url?: { url: string };
  }[];
};

const translationsConditions = [
  "Përktheni këtë në shqip dhe nëse nuk ka tekst për përkthim, përgjigjuni me 0.",
  "ترجمها إلى العربية وإذا لم يكن هناك نص للترجمة رد بـ 0",
  "এটি বাংলায় অনুবাদ করুন এবং যদি অনুবাদ করার মতো কোনো পাঠ্য না থাকে তবে 0 দিয়ে উত্তর দিন।",
  "Translate it in English and if there is no text to translate reply with 0",
  "آنآن را به فارسی ترجمه کنید و اگر متنی برای ترجمه وجود ندارد با 0 پاسخ دهید",
  "Przetłumacz to na polski i jeśli nie ma tekstu do przetłumaczenia, odpowiedz 0.",
  "Tradu-l în română și, dacă nu există text de tradus, răspunde cu 0.",
  "එය සිංහලට පරිවර්තනය කරන්න සහ පරිවර්තනය කිරීමට පෙළක් නොතිබුණි නම් 0 ලෙස ප්‍රතිචාර දක්වන්න.",
  "Bunu Türkçeye çevirin ve çevrilecek metin yoksa 0 ile cevap verin.",
  "Перекладіть це українською та, якщо тексту для перекладу немає, відповідайте 0.",
];

export default function Component() {
  //States
  const [input, setInput] = useState("");
  const [inLoading, setinLoading] = useState(false);
  const [rowsOfInput, setRowsOfInput] = useState(1);
  const [jobPrompt, setJobPrompt] = useState<any>();

  //context
  const { getAppLanguage } = useLanguage();
  const { messages, addTextMessage, discardMessages } = useMessageContext();

  //Initializers
  const t: any = getAppLanguage();
  const router: any = useRouter();
  let hasUsedChatBefore: any = localStorage.getItem("hasUsedChatBefore");

  //refs
  const scrollAreaRef: any = useRef(null);
  const chatRef: any = useRef(null);
  const loadingRef: any = useRef(null);

  //Fetching Function

  let fetchResponse = async (updatedMessages: any) => {
    console.log("started Fetch");
    console.time("Fetch Duration");

    setinLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updatedMessages }),
    });

    console.timeEnd("Fetch Duration");
    console.time("save state Duration");

    const data = await res.json();

    let msg = await addTextMessage(data.message, "assistant");

    if (
      data.message === "0" &&
      getSecondLastItem(msg)?.content[0].text != "0"
    ) {
      // await addTextMessage(t.prompts.translatePrompt, "user");

      let obj = {
        role: "user",
        content: [
          {
            type: "text",
            text: t.prompts.translate,
          },
        ],
      };

      msg.push(obj);

      fetchResponse(msg);

      setTimeout(() => {
        setinLoading(true);
      }, 2000);
    }

    setinLoading(false);

    console.timeEnd("save state Duration");
    console.log("Ended Fetch");
  };

  const isValidJson = (text: string) => {
    try {
      const parsed = JSON.parse(text);
      return typeof parsed === "object" && parsed !== null;
    } catch {
      return false;
    }
  };

  const hasExpectedKeys = (obj: any) => {
    const requiredKeys = [
      "jobTitle",
      "location",
      "radius",
      "professionalField",
      "temporaryEmployment",
      "publishedSince",
      "includePrivateAgencies",
      "offerType",
      "contractType",
      "disabilityFriendly",
    ];
    return requiredKeys.every((key) => key in obj);
  };

  const extractJsonFromGpt = (text: string) => {
    // Match content inside ```json ... ```
    const match = text?.match(/```json\s*([\s\S]*?)\s*```/i);

    if (match && match[1]) {
      return match[1];
    }

    return text;
  };

  const handleGptResponse = (gptOutput: string) => {
    const cleaned = extractJsonFromGpt(gptOutput);

    try {
      const parsed = JSON.parse(cleaned);

      const requiredKeys = [
        "jobTitle",
        "location",
        "radius",
        "professionalField",
        "temporaryEmployment",
        "publishedSince",
        "includePrivateAgencies",
        "offerType",
        "contractType",
        "disabilityFriendly",
      ];

      const isValid = requiredKeys.every((key) => key in parsed);

      if (isValid) {
        localStorage.setItem("jobData", JSON.stringify(parsed));
        console.log("✅ Saved to localStorage:", parsed);
        router.push("/jobs");
      } else {
        console.error("❌ JSON is missing expected keys.");
      }
    } catch (err) {
      // console.error("❌ Failed to parse JSON:", err);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      if (inLoading) {
        loadingRef.current.scrollIntoView({ behavior: "smooth" }); //Use scrollIntoView to automatically scroll to my ref
      } else {
        chatRef.current.scrollIntoView({ behavior: "smooth" }); //Use scrollIntoView to automatically scroll to my ref
      }
      document.body.scrollIntoView({ behavior: "smooth" }); //Use scrollIntoView to automatically scroll to my ref
    }

    if (messages.length > 1 && !hasUsedChatBefore) {
      localStorage.setItem("hasUsedChatBefore", "true");
    }
    handleGptResponse(messages[messages.length - 1]?.content[0]?.text);
  }, [messages.length]);

  useEffect(() => {
    discardMessages();
    const loadPrompt = async (language: string) => {
      const res = await fetch("/locale/jobPrompt.txt");
      const template = await res.text();
      return template.replace("{LANGUAGE}", language);
    };

    const fetchPrompt = async () => {
      const prompt = await loadPrompt(t.language);
      let m = await addTextMessage(prompt, "user");
      await fetchResponse(m);
    };

    fetchPrompt();
  }, []);

  return (
    <div className="flex flex-col max-w-[50rem] mx-auto p-4 space-y-6 justify-start items-center ">
      {/* Text Content */}
      <ScrollArea
        ref={scrollAreaRef}
        className="h-[72vh] rounded-md border p-4 w-[100%] bg-card"
        style={{ borderColor: "#AFC4BF66" }}
        scrollHideDelay={5000}
      >
        {messages.map((v: any, i: any, row: any) => {
          return (
            <div
              key={i}
              className={`text-sm mt-[20px] p-[10px] ${
                v.role == "user" ? "text-right bg-background pr-3" : null
              }`}
              style={{
                backgroundColor: v.role == "user" ? "" : "#27A830",
                color: v.role == "user" ? "#27A830" : "white",
                borderRadius: "10px",
              }}
              ref={i + 1 === row.length ? chatRef : null} //Verify if the card is the last one.
            >
              {v.content[0].text === "0" ? (
                i > 2 ? (
                  translationsConditions.includes(
                    row[i + 1]?.content[0]?.text
                  ) ? (
                    t.waitText
                  ) : (
                    t.noText
                  )
                ) : (
                  t.waitText
                )
              ) : (
                <span
                  dangerouslySetInnerHTML={{
                    __html: marked.parse(
                      i == 0
                        ? ""
                        : v.content[0].text === "0"
                        ? i >= 2
                          ? row[i + 2]?.content[0]?.text === "0"
                            ? t.waitText
                            : t.noText
                          : t.waitText
                        : (row[1]?.content[0]?.text === "0" && i === 2) ||
                          translationsConditions.includes(v.content[0]?.text)
                        ? ""
                        : isValidJson(extractJsonFromGpt(v.content[0].text))
                        ? "Please Wait"
                        : v.content[0].text
                        ? v.content[0].text
                        : "Something Went Wrong"
                    ),
                  }}
                />
              )}
            </div>
          );
        })}

        {inLoading ? (
          <div
            ref={loadingRef} //Verify if the card is the last one.
          >
            <Loader />
          </div>
        ) : null}
      </ScrollArea>

      <div className="relative w-full mt-[20px] flex items-center gap-[10px]">
        <textarea
          rows={rowsOfInput}
          className="w-[85%] md:w-[96%] py-[15px] px-5 rounded-[28px] bg-card"
          placeholder={t["3-page"].ask}
          value={input as string}
          onChange={(e) => {
            if (e.target.value === "") {
              setInput(e.target.value);
            } else {
              setInput(e.target.value);
            }
            let rows = e.target.value.length;
            rows = Math.ceil(rows / 38) === 0 ? 1 : Math.ceil(rows / 38);
            setRowsOfInput(rows);
          }}
          onKeyDown={async (e) => {
            if (e.key === "Enter" && !inLoading && input != "") {
              e.preventDefault();
              e.currentTarget.blur();
              let m = messages;
              m.push({
                role: "user",
                content: [
                  {
                    type: "text",
                    text: input,
                  },
                ],
              });
              // await addTextMessage(input, "user");
              setInput("");
              await setinLoading(true);
              setRowsOfInput(1);
              await fetchResponse(m);
            }
          }}
        />
        <div
          className="w-[50px] h-[50px] bg-[#27A830] flex items-center justify-center"
          style={{ borderRadius: "50px" }}
          onClick={async () => {
            if (!inLoading && input != "") {
              let m = messages;
              m.push({
                role: "user",
                content: [
                  {
                    type: "text",
                    text: input,
                  },
                ],
              });
              // await addTextMessage(input, "user");
              setInput("");
              await setinLoading(true);
              await fetchResponse(m);
            }
          }}
        >
          <ArrowUpRight className="" style={{ color: "#fff" }} />
        </div>
      </div>
    </div>
  );
}
