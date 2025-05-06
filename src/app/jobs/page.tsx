"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import translateArray from "@/lib/translateArray";
import  translateJobPost from "../../lib/transalteJobPost";
import { useLanguage } from "@/context/languageContext";
import { marked } from "marked";
import Swal from "sweetalert2";

const getCookie = (name: string): string | null => {
  const matches = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return matches ? decodeURIComponent(matches[1]) : null;
};

function page() {
  const [jobDataList, setJobDataList] = useState<any>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [maxResult, setMaxResult] = useState(0);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);

  const { getAppLanguage } = useLanguage();

  let translate: any = getAppLanguage();

  const fetchJobsFromLocalStorage = async (page: number) => {
    setIsLoading(true);
    const jobDataStr = localStorage.getItem("jobData");
    if (!jobDataStr) {
      console.warn("No jobData found");
      return;
    }

    try {
      const jobData = JSON.parse(jobDataStr);
      jobData.page = page;

      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });

      const data = await res.json();

      let lang: any = (await getCookie("language")) || "english";
      const translatedData: any = await translateArray(
        data.stellenangebote,
        lang
      ); // Translate the job data using the translateArray function

      if (translatedData) {
        setJobDataList((prevJobDataList: any) => [
          ...prevJobDataList,
          ...translatedData,
        ]); // Update the jobDataList state with the new data
      }else{
        Swal.fire("Something went wrong, while translating the data");
      }

      setMaxResult(data.maxErgebnisse); // Update the maxResult state with the new max results
      setPage(data.page); // Update the page state with the new page number
      setMaxPage(Math.ceil(data.maxErgebnisse / 20)); // Update the maxPage state with the new max pages

      //   console.log("Fetched Jobs:", data);
    } catch (err) {
      // console.error("Error fetching jobs:", err);
    }
    setIsLoading(false);
  };

  const fetchJobDetails = async (refnr: string) => {
    setIsModalOpen(true);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/jobDetails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refnr }),
      });
      const data = await res.json();
      let lang: any = (await getCookie("language")) || "english";
      const translatedJob = await translateJobPost(data, lang); // Translate the job data using the translateJobPost function
      console.log("Translated Job:", translatedJob);
      setSelectedJob(translatedJob);
      // console.log("Fetched Job Details:", data);
    } catch (err) {
      // console.error("Error fetching job details:", err);
    }
    setIsLoading(false);
  };

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const jobData = localStorage.getItem("jobData");

      if (!jobData) {
        router.push("/jobs/collect-data");
      }
    }
  }, [router]);

  useEffect(() => {
    fetchJobsFromLocalStorage(1);
  }, []);

  return (
    <div className="bg-background md:max-w-[900px] mx-auto p-[20px] pb-[0px]">
      <div className="mt-[10px] w-100 px-5" id="headFilter">
        <p className="text-bold text-right">
          {translate.jobsPage.maxResults} : {maxResult}
        </p>
      </div>

      {/* JOB LISTS */}
      <div id="jobLists" className="w-100 ">
        {jobDataList?.map((e: any) => (
          <JobListItem
            key={e.refnr}
            job={e}
            onReadMore={() => fetchJobDetails(e.refnr)}
          />
        ))}

        {maxPage > page ? (
          <div className="flex justify-center items-center mt-5">
            <Button
              variant="outline"
              className="w-[200px] h-[50px] text-text text-[#fff] font-bold mb-50% rounded-[50px] bg-[#27A830] hover:bg-[#27A830] hover:text-white mb-[20px]"
              onClick={() => {
                setPage(page + 1);
                fetchJobsFromLocalStorage(page + 1);
              }}
              disabled={isLoading}
            >
              {isLoading ? "⌛" : translate.jobsPage.loadMore}
            </Button>
          </div>
        ) : null}
      </div>

      {isLoading && page === 1 ? (
        <div className="flex justify-center items-center mt-5 h-[60vh]">
          <p>{translate.waitText}</p>
        </div>
      ) : null}

      {isModalOpen && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

const JobListItem = ({ job, onReadMore }: any) => {
  const {
    titel,
    arbeitgeber,
    arbeitsort,
    beruf,
    aktuelleVeroeffentlichungsdatum,
  } = job;

  const { getAppLanguage } = useLanguage();
  const translate: any = getAppLanguage();

  return (
    <div className="w-100 border-rounded bg-card py-2 px-5 rounded border-[#AFC4BF66] my-[10px]">
      <h2 className="text-text font-bold text-[16px]">{titel}</h2>
      <div className="flex ">
        <div className="w-[80%]">
          <h2 className="text-text text-[12px]">
            {translate.jobsPage.employer}: {arbeitgeber}
          </h2>
          <h2 className="text-text text-[12px]">
            {translate.jobsPage.placeOfWork}:{" "}
            {`${arbeitsort.plz}, ${arbeitsort.ort}, ${arbeitsort.land}`}
          </h2>
          <h2 className="text-text text-[12px]">
            {translate.jobsPage.occupation}: {beruf}
          </h2>
          <h2 className="text-text text-[12px]">
            {translate.jobsPage.publishDate}: {aktuelleVeroeffentlichungsdatum}
          </h2>
        </div>
        <div className="w-[20%]">
          <div
            className="w-[50px] md:w-[100%] h-[50px] bg-[#27A830] flex items-center justify-center cursor-pointer"
            style={{ borderRadius: "50px" }}
            onClick={onReadMore}
          >
            <p className="p-0 text-bold hidden md:block text-[#fff]">
              {translate.jobsPage.readMore}
            </p>
            <ArrowUpRight className="" style={{ color: "#fff" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const JobDetailsModal = ({ job, onClose }: any) => {

  const { getAppLanguage } = useLanguage();
  const translate: any = getAppLanguage(); 

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="relative p-5 rounded w-[90%] md:w-[80%] bg-card overflow-y-auto ti-card [&::-webkit-scrollbar-track]:bg-card"
        style={{
          height: "95%",
          scrollbarWidth: "thin",
          scrollbarColor: "#27A830 #f0f0f0",
        }}
      >
        {/* Close Icon */}
        <button
          className="absolute top-3 right-3 text-2xl text-gray-500 hover:text-gray-800"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        {/* Modal Content */}
        <div className={`${job ? null : "h-[100%] flex items-center justify-center"}`}>
        <span
        className={`width-[100%]}`}     
        dangerouslySetInnerHTML={{
            __html: marked.parse(job ? job : translate.waitText), // Use marked to parse the job content
          }}
        />
        </div>
      </div>

      <style jsx>{`
        /* Custom Scrollbar Styling */
        .ti-card::-webkit-scrollbar {
          width: 8px;
        }
        .ti-card::-webkit-scrollbar-thumb {
          background-color: #27a830;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default page;
