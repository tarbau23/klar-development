"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Loader from "@/components/ui/loader";
import LoaderSkeleton from "@/components/loaderSkeleton";
import ImagePreview from "@/components/image-preview";
import { FeedbackForm } from "@/components/feedbackFrom";

import { useLanguage } from "@/context/languageContext";
import { useMessageContext } from "@/context/messagesContext";
import { uploadImageFirebase } from "@/lib/uploadImageFirebase";
import { LoaderModal } from "@/components/loaderModal";
import { convertPdfToImagesAndUpload } from "@/lib/convertPdfToImagesAndUpload";

import { marked } from "marked";

import {
  Camera,
  ArrowUpRight,
  Upload,
} from "lucide-react";
import compressImage from "@/lib/compressImage";
import SocialShareLinks from "@/components/socialShare.";
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
  const [isUploading, setIsUploading] = useState(false);
  const [viewInputIcons, setviewInputIcons] = useState(true);
  const [rowsOfInput, setRowsOfInput] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);

  //context
  const { getAppLanguage } = useLanguage();
  const {
    messages,
    addTextMessage,
    addImageMessage,
    getMessages,
    addPDFMessage,
  } = useMessageContext();

  //Initializers
  const t: any = getAppLanguage();
  const router: any = useRouter();
  let isFormFilled: boolean = false;
  let hasUsedChatBefore: any = localStorage.getItem("hasUsedChatBefore");
  let isUserSecondTime: any = localStorage.getItem("isUserSecondTime");
  let formSubmitted: any = localStorage.getItem("formSubmitted");

  //refs
  const fileInputRef: any = useRef(null);
  const cameraInputRef: any = useRef(null);
  const scrollAreaRef: any = useRef(null);
  const chatRef: any = useRef(null);
  const loadingRef: any = useRef(null);

  let prompt = t.prompt;

  //event handlers
  const handleFileChange = async (event: any) => {
    setinLoading(true);
    setIsUploading(true);
    const file = event.target.files[0];
    if (file) {
      console.log("File selected:", file.name);
    }

    const fileType = file.type; // MIME type, e.g., 'image/png' or 'application/pdf'
    const fileExtension = file.name.split(".").pop().toLowerCase(); // File extension

    if (
      fileType.startsWith("image/") ||
      ["png", "jpg", "jpeg"].includes(fileExtension)
    ) {
      handleCameraFileChange(event);
    } else if (fileType === "application/pdf" || fileExtension === "pdf") {
      try {
        let imageUrls = await convertPdfToImagesAndUpload(file);

        let m = await addPDFMessage(imageUrls, prompt);
        await fetchResponse(m);
        setIsUploading(false);
      } catch (err: any) {
        console.error(err);
      }
    } else {
      console.error("Invalid file type. Please select an image or PDF.");
    }
    setIsUploading(false);
  };

  const handleCameraFileChange = async (event: any) => {
    setIsUploading(true);
    const file = event.target.files?.[0];
    const compressedFile: any = await compressImage(file);
    let url = await uploadImageFirebase(compressedFile);
    let m = await addImageMessage(url, prompt);
    await fetchResponse(m);
    setIsUploading(false);
  };
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

  useEffect(() => {
    if (messages.length < 1) {
      // router.push("prompt");
    } else {
      fetchResponse(messages);
    }
  }, []);

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

    if (isUserSecondTime && !formSubmitted && messages.length > 1) {
      setIsFormOpen(true);
    }
  }, [messages.length]);

  return (
    <div className="flex flex-col max-w-[50rem] mx-auto p-4 space-y-6 justify-start items-center ">
      <LoaderModal isLoading={isUploading} />
      <FeedbackForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      {/* Text Content */}
      <ScrollArea
        ref={scrollAreaRef}
        className="h-[72vh] rounded-md border p-4 w-[100%] bg-card"
        style={{ borderColor: "#AFC4BF66" }}
        scrollHideDelay={5000}
      >
        {messages.map((v: any, i: any, row: any) => {
          if (v.content.length > 1) {
            return (
              <div
                className="flex justify-center items-center m-[10px]"
                ref={i + 1 === row.length ? chatRef : null} //Verify if the card is the last one.
                key={i}
              >
                <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
                  <div className="flex w-max space-x-4 p-4">
                    {v.content.map((a: any, i: number) => {
                      if (i > 0) {
                        return (
                          <figure key={i} className="shrink-0">
                            <div className="overflow-hidden rounded-md">
                              <ImagePreview
                                src={a.image_url.url}
                                alt="hi"
                                width={100}
                                height={100}
                              />
                            </div>
                          </figure>
                        );
                      }
                    })}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            );
          } else {
            return (
              <div
                key={i}
                className={`text-sm mt-[20px] p-[10px] ${v.role == "user" ? "text-right bg-background pr-3" : null}`}
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
                        v.content[0].text === "0"
                          ? i >= 2
                            ? row[i + 2]?.content[0]?.text === "0"
                              ? t.waitText
                              : t.noText
                            : t.waitText
                          : (row[1]?.content[0]?.text === "0" && i === 2) ||
                            translationsConditions.includes(v.content[0]?.text)
                          ? ""
                          : v.content[0].text
                          ? v.content[0].text
                          : "Something Went Wrong"
                      ),
                    }}
                  />
                )}
              </div>
            );
          }
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
              setviewInputIcons(true);
              setInput(e.target.value);
            } else {
              setviewInputIcons(false);
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
              await setviewInputIcons(true);
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
              await setviewInputIcons(true);
              await fetchResponse(m);
            }
          }}
        >
          <ArrowUpRight  className="" style={{ color: "#fff" }} />
        </div>

        {viewInputIcons ? (
          <>
            <Camera
              className="absolute right-[28%] md:right-[9.5%] top-1/2 transform -translate-y-1/2  w-4 h-4"
              style={{ color: "#27A830" }}
              onClick={() => cameraInputRef.current.click()}
            />
            <Upload
              className="absolute right-[20%] md:right-[13%] top-1/2 transform -translate-y-1/2 w-4 h-4 "
              onClick={() => fileInputRef.current.click()}
              style={{ color: "#27A830" }}
            />
          </>
        ) : null}

        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={cameraInputRef}
          style={{ display: "none" }}
          onChange={handleCameraFileChange}
        />
        <input
          type="file"
          accept="image/*,.pdf"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

    </div>
  );
}
