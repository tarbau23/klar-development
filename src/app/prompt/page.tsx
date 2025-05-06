"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, ArrowUpRight, Upload } from "lucide-react";
import Swal from "sweetalert2";

import { useLanguage } from "@/context/languageContext";
import { useMessageContext } from "@/context/messagesContext";
import { uploadImageFirebase } from "@/lib/uploadImageFirebase";
import compressImage from "@/lib/compressImage";
import { convertPdfToImagesAndUpload } from "@/lib/convertPdfToImagesAndUpload";
import getNotification from "@/lib/getNotification";

import { Button } from "@/components/ui/button";
import { LoaderModal } from "@/components/loaderModal";
import { YoutubeModal } from "@/components/youtubeModal";
import PreWrittenPrompt from "@/components/PreWrittenPrompt";
import { LanguageModal } from "@/components/LanguageModal";

const getCookie = (name: string): string | null => {
  const matches = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return matches ? decodeURIComponent(matches[1]) : null;
};

export default function Component() {
  // language Context
  const { getAppLanguage } = useLanguage();
  const { addImageMessage, discardMessages, addTextMessage, addPDFMessage } =
    useMessageContext();

  //states
  const [imageUrl, setImageUrl] = useState<any>();
  const [image, setImage] = useState<any>();
  const [promptInput, setPromptInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [rowsOfInput, setRowsOfInput] = useState(1);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  // initializers
  let router: any = useRouter();
  const t: any = getAppLanguage();

  //refs
  const fileInputRef: any = useRef(null);
  const cameraInputRef: any = useRef(null);

  let prompt = t.prompt;

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

        router.push(`/results`);
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

    // console.log(compressedFile.size);

    setImage(compressedFile);

    let url = await uploadImageFirebase(compressedFile);

    setImageUrl(url);

    await addImageMessage(url, prompt);

    setIsUploading(false);
    router.push(`/results`);
  };

  const search = async () => {
    if (promptInput) {
      await addTextMessage(promptInput, "user");
      router.push(`/chat`);
    } else {
      Swal.fire(t.alertMessageEmpty);
    }
  };

  //cleanup function
  useEffect(() => {
    discardMessages();
  }, []);

  //Modal Opener
  useEffect(() => {
    const savedLanguage = getCookie("language");
    !savedLanguage ? setIsLanguageModalOpen(true) : null
  }, []);

  return (
    <div className="flex flex-col items-center max-w-[50rem] mx-auto p-4 justify-center">
      <LoaderModal isLoading={isUploading} />
      <YoutubeModal />
      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        isExpend={false}
      />

      {/* Notification Section  */}

      <div className="text-center flex flex-row items-center bg-card w-100 sm:w-[80%] py-[0px] px-[10px] rounded-md gap-3 border border-[#AFC4BF66]">
        <Image
          src={"/infoIcon.png"}
          width={60}
          height={60}
          alt="hide"
          className="w-[30px] h-[30px]"
        />
        <p className="text-left text-[12px] mt-[10px] font-bold">
          {getNotification(t.language)}
        </p>
      </div>

      {/* Search Input Section */}

      <div className="w-full space-y-2 mt-[10px]">
        <p className="text-[12px] text-left">{t["2-page"].ask}</p>
        <div className="relative w-full flex items-center gap-[10px]">
          <textarea
            rows={rowsOfInput}
            className="w-[85%] py-[15px] px-5 rounded-[28px] bg-card border border-[#AFC4BF66]"
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
                search();
              }
            }}
          />
          <div
            className="w-[50px] h-[50px] bg-[#27A830] flex items-center justify-center"
            style={{ borderRadius: "50px" }}
            onClick={() => search()}
          >
            <ArrowUpRight className="" style={{ color: "#fff" }} />
          </div>
        </div>
      </div>

      {/* Features Section */}

      <div
        id="feature"
        className="bg-card w-100 py-2 px-5 mt-5 border border-[#AFC4BF66] rounded-[10px]"
      >
        <div className="w-full">
          <p className="text-[24px]  text-center">{t["2-page"].title}</p>
          <p className="text-center text-[12px] ">{t["2-page"].subTitle}</p>
        </div>

        <div className="text-center flex flex-row items-stretch gap-[10px] mt-[10px]">
          <div
            className="text-center flex flex-col items-center w-[33%] rounded-md justify-center cursor-pointer"
            onClick={handleCameraButtonClick}
          >
            <div className="h-[50px] w-[50px] bg-background rounded-full flex items-center justify-center">
              <Image
                src={"/homeworkIcon.png"}
                className="h-[24px] w-[24px]"
                width={24}
                height={24}
                alt="hide"
              />
            </div>
            <p className="font-bold text-center text-[12px] mt-[10px]">
              {t["2-page"].homework}
            </p>
          </div>
          <div
            className="text-center flex flex-col items-center w-[33%] rounded-md justify-center cursor-pointer"
            onClick={handleCameraButtonClick}
          >
            <div className="h-[50px] w-[50px] bg-background rounded-full flex items-center justify-center">
              <Image
                src={"/legalIcon.png"}
                width={50}
                height={50}
                alt="hide"
                className="h-[24px] w-[24px]"
              />
            </div>
            <p className="font-bold text-center text-[12px] mt-[10px]">
              {t["2-page"].contracts}
            </p>
          </div>
          <div
            className="text-center flex flex-col items-center w-[33%] rounded-md justify-center cursor-pointer"
            onClick={handleCameraButtonClick}
          >
            <div className="h-[50px] w-[50px] bg-background rounded-full flex items-center justify-center">
              <Image
                src={"/scannerIcon.png"}
                width={50}
                height={50}
                alt="hide"
                className="h-[24px] w-[24px]"
              />
            </div>
            <p className="font-bold text-center text-[12px] mt-[10px]">
              {t["2-page"].information}
            </p>
          </div>
        </div>
      </div>

      {/* File submission section  */}

      <div
        className="w-full text-center border border-[#AFC4BF66] p-[10px] rounded-[10px] bg-card"
        style={{ marginTop: "10px" }}
      >
        <p className="text-[18px] text-center w-100 text-left text-[16px]">
          {t["2-page"].upload}
        </p>

        <div className="flex justify-center items-center w-100 gap-[10px] m-[0px]">
          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col items-center gap-1 bg-background w-[50%] h-[100%] py-[10px]"
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
            <span className="">Camera</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col items-center gap-1 bg-background w-[50%] h-[100%] py-[10px]"
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
            <span className="">File</span>
          </Button>
        </div>
      </div>

      {/* pre written prompt  */}
      <PreWrittenPrompt />
    </div>
  );
}
