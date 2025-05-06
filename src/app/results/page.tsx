"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Loader from "@/components/ui/loader";
import ImagePreview from "@/components/image-preview";
import { FeedbackForm } from "@/components/feedbackFrom";

import { useLanguage } from "@/context/languageContext";
import { useMessageContext } from "@/context/messagesContext";
import { uploadImageFirebase } from "@/lib/uploadImageFirebase";
import { convertPdfToImagesAndUpload } from "@/lib/convertPdfToImagesAndUpload";

import { LoaderModal } from "@/components/loaderModal";

import { marked } from "marked";
import Swal from "sweetalert2";

import {
  Camera,
  Search,
  ThumbsDown,
  ThumbsUp,
  Upload,
  Share2,
  Facebook,
} from "lucide-react";
import compressImage from "@/lib/compressImage";

//types

type Message = {
  role: "user" | "assistant";
  content: {
    type: "text" | "image_url";
    text?: string;
    image_url?: { url: string };
  }[];
};

export default function Component() {
  //States
  const [imageUrl, setImageUrl] = useState<any>();
  const [image, setImage] = useState<any>();
  const [promptInput, setPromptInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [rowsOfInput, setRowsOfInput] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);

  //context
  const { getAppLanguage } = useLanguage();
  const { messages, addTextMessage, addImageMessage, addPDFMessage } =
    useMessageContext();

  //Initializers
  let router: any = useRouter();
  const t: any = getAppLanguage();
  let isUserSecondTime: any = localStorage.getItem("isUserSecondTime");
  let formSubmitted: any = localStorage.getItem("formSubmitted");
  // const searchParams: any = useSearchParams();

  //refs
  const fileInputRef: any = useRef(null);
  const cameraInputRef: any = useRef(null);
  const scrollAreaRef: any = useRef(null);

  let prompt = t.prompt;

  //event handlers
  //Event Handlers
  const handleFileButtonClick = () => {
    // Open file upload prompt
    fileInputRef.current.click();
  };

  const handleCameraButtonClick = () => {
    // Open camera capture prompt
    cameraInputRef.current.click();
  };

  const handleFileChange = async (event: any) => {
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

        await addPDFMessage(imageUrls, prompt);

        router.push(`/chat`);
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

    setImage(compressedFile);

    let url = await uploadImageFirebase(compressedFile);

    await addImageMessage(
      url,
      `you will be provided an image. You task is to translate the text on the image to ${t.language} language.`
    );

    router.push(`/chat`);
    setIsUploading(false);
  };

  const search = async () => {
    if (promptInput) {
      await addTextMessage(promptInput, "user");
      router.push(`/chat`);
    } else {
      Swal.fire(t.alertMessageEmpty);
    }
  };

  //Fetching Function

  let fetchResponse = async (updatedMessages: any) => {
    console.log("started Fetch");
    console.time("Fetch Duration");

    setIsLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updatedMessages }),
    });

    console.timeEnd("Fetch Duration");
    console.time("save state Duration");

    const data = await res.json();
    await addTextMessage(data.message, "assistant");

    if (data.message === "0") {
      await addTextMessage(`Translate it in ${t.language}`, "user");

      router.push("/pre-chat");
    } else {
      localStorage.setItem("hasUsedChatBefore", "true");
    }

    setTimeout(() => {
      if (isUserSecondTime && !formSubmitted) {
        setIsFormOpen(true);
      }
    }, 2000);

    setIsLoading(false);

    console.timeEnd("save state Duration");
    console.log("Ended Fetch");

    // console.log(messages);
  };

  useEffect(() => {
    if (messages.length === 1) {
      fetchResponse(messages);
    }
  }, []);

  return (
    <div className="flex flex-col max-w-[50rem] mx-auto p-4 justify-center items-center gap-[10px]">
      <LoaderModal isLoading={isUploading} />
      <FeedbackForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />

      {/* Text Content */}
      <ScrollArea
        ref={scrollAreaRef}
        className="min-h-[45vh] h-[55vh] rounded-[10px] p-4 w-[100%] bg-card border border-[#AFC4BF66]"
        style={{ borderColor: "#AFC4BF66" }}
        scrollHideDelay={5000}
      >
        {messages.length > 0 && messages[0].content[1]?.image_url?.url ? (
          <div className="flex justify-center items-center m-[10px]">
            <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
              <div className="flex w-max space-x-4 p-4">
                {messages[0].content.map((a: any, i: number) => {
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
        ) : null}
        {messages.length > 1 ? (
          <p
            className="text-sm mt-[20px] p-[10px]"
            style={{
              backgroundColor: "#006A4E",
              color: "white",
              borderRadius: "10px",
            }}
          >
            <span
              className="text-sm"
              dangerouslySetInnerHTML={{
                __html: marked.parse(
                  messages[1].content[0].text === "0"
                    ? ""
                    : messages[1].content[0].text
                    ? messages[1].content[0].text
                    : "Something Went Wrong"
                ),
              }}
            ></span>
          </p>
        ) : (
          <Loader />
        )}

        {/* Search Bar */}
      </ScrollArea>

      <div className="relative w-full flex items-center gap-[10px]">
        <textarea
          rows={rowsOfInput}
          className="w-[85%] py-[15px] px-5 rounded-[28px] bg-card"
          placeholder={t["3-page"].ask}
          value={promptInput as string}
          onChange={(e) => {
            setPromptInput(e.target.value);
            let rows = e.target.value.length;
            rows = Math.ceil(rows / 38) === 0 ? 1 : Math.ceil(rows / 38);
            setRowsOfInput(rows);
          }}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              if (isLoading === false) {
                search();
                router.push("/chat");
              }
            }
          }}
        />
        <div
          className="w-[50px] h-[50px] bg-[#27A830] flex items-center justify-center"
          style={{ borderRadius: "50px" }}
          onClick={() => {
            if (isLoading === false) {
              search();
              router.push("/chat");
            }
          }}
        >
          <Search className="" style={{ color: "#fff" }} />
        </div>
      </div>

      {/* File submission section  */}

      <div className="w-full text-center border border-[#AFC4BF66] p-[10px] rounded-[10px] bg-card">
        <p className=" w-[100%] text-center text-[20px]">
          {t["3-page"].upload}
        </p>

        <div className="flex justify-center items-center w-100 gap-[10px] m-[0px]">
          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col items-center gap-1 bg-[#AFC4BF38] w-[50%] h-[100%] py-[10px]"
            onClick={handleCameraButtonClick}
          >
            <Camera
              className="w-20 h-20"
              style={{ height: "32px", width: "32px", color: "#27A830" }}
            />
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={cameraInputRef}
              style={{ display: "none" }}
              onChange={handleCameraFileChange}
            />
            <span className="sr-only">Take picture</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col items-center gap-1 bg-[#AFC4BF38] w-[50%] h-[100%] py-[10px]"
            onClick={handleFileButtonClick}
          >
            <Upload
              className="w-8 h-8"
              style={{ height: "32px", width: "32px", color: "#27A830" }}
            />
            <input
              type="file"
              accept="image/*,.pdf"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </Button>
        </div>
      </div>

      {/* Action Buttons  */}

      <div className="flex w-[100%] gap-[10px]">
        <div
          className="relative w-full flex justify-center flex-row w-[50%]"
          style={{ marginTop: "5px!important" }}
        >
          <Button
            className="w-1/2 rounded-full bg-[#27A830] w-[100%] py-6"
            onClick={async () => {
              if (!isLoading) {
                await addTextMessage(t.prompts.explain, "user");
                router.push("/chat");
              }
            }}
          >
            <p className="text-[14px] p-0 text-text">{t["3-page"].explain}</p>
          </Button>
        </div>
        <div
          style={{ marginTop: "0px!important" }}
          className="relative w-full flex justify-center mt-[0px] w-[50%]"
        >
          <Button
            className="w-1/2 rounded-full bg-[#27A830] w-[100%] py-6"
            onClick={async () => {
              if (!isLoading) {
                await addTextMessage(t.prompts.summarize, "user");
                router.push("/chat");
              }
            }}
          >
            <p className="text-[14px] p-0 text-text">{t["3-page"].summarize}</p>
          </Button>
        </div>
      </div>
    </div>
  );
}
