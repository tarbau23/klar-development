"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useLanguage } from "@/context/languageContext";
import Swal from "sweetalert2";

import { db } from "@/lib/firebsae";
import { collection, addDoc } from "firebase/firestore";
import { comment } from "postcss";

interface FeedbackFormProps {
  isOpen: boolean;
  onClose: () => void;
}


const uploadArrayToFirestore = async ( array : any) => {
  console.log(array)
  let obj = {
    appUse: array[0],
    whatHelpful: array[1],
    motivatesDaily: array[2],
    newFeatureSuggestion: array[3],
    scale: array[4],
    comments: array[5]
  }
  try {
    const collectionRef = collection(db, "FeedbackForm");
    const docRef = await addDoc(collectionRef, obj);

    console.log("Document successfully written with ID:", docRef.id);
    return docRef.id; // Return the document ID if needed
  } catch (error) {
    console.error("Error adding document:", error);
  }
};

export function FeedbackForm({ isOpen, onClose }: FeedbackFormProps) {
  const { getAppLanguage } = useLanguage();

  const Toast = Swal.mixin({
    toast: true,
    position: "top",
    iconColor: "red",
    customClass: {
      popup: "colored-toast",
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<(string | string[])[]>([]);
  const [otherInputs, setOtherInputs] = useState<{ [key: number]: string }>({});

  const translations: any = getAppLanguage();
  const t: any = translations.feedbackForm;

  const handleNext = () => {
    if (currentStep < t.steps.length - 1 && answers[currentStep]) {
      setCurrentStep(currentStep + 1);
    } else {
      Toast.fire({
        icon: "error",
        title: translations.feedbackError,
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async() => {
    if (!answers[currentStep]) {
      Toast.fire({
        icon: "error",
        title: translations.feedbackError,
      });
      return false;
    }
    const finalAnswers = answers.map((answer, index) => {
      if (
        Array.isArray(answer) &&
        answer.includes("Other") &&
        otherInputs[index]
      ) {
        return [...answer.filter((a) => a !== "Other"), otherInputs[index]];
      }
      if (answer === "Other" && otherInputs[index]) {
        return otherInputs[index];
      }
      return answer;
    });
    onClose();
    await uploadArrayToFirestore(finalAnswers);
    // console.log("Form submitted:", finalAnswers);

    localStorage.setItem('formSubmitted', 'true');

    setCurrentStep(0);
    setAnswers([]);
    setOtherInputs({});
  };

  const handleAnswer = (answer: string | string[]) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = answer;
    setAnswers(newAnswers);
    // console.log(answers);

    // Handle 'Other' option
    if (Array.isArray(answer) && answer.includes("Other")) {
      setOtherInputs((prev) => ({
        ...prev,
        [currentStep]: prev[currentStep] || "",
      }));
    } else if (answer === "Other") {
      setOtherInputs((prev) => ({
        ...prev,
        [currentStep]: prev[currentStep] || "",
      }));
    } else {
      // Remove 'Other' input if not selected
      setOtherInputs((prev) => {
        const newOtherInputs = { ...prev };
        delete newOtherInputs[currentStep];
        return newOtherInputs;
      });
    }
  };

  const handleOtherInput = (value: string) => {
    setOtherInputs({ ...otherInputs, [currentStep]: value });
  };

  const currentQuestion = t.steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[425px] [&>button]:hidden"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <h2 className="text-lg font-semibold mb-2">
            {currentQuestion.question}
          </h2>
          {currentQuestion.type === "textarea" ? (
            <Textarea
              value={(answers[currentStep] as string) || ""}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder={t.steps[currentStep].question}
            />
          ) : currentStep === 4 ? ( // Slider for 1-10 question
            <div className="space-y-4">
              <Slider
                min={1}
                max={10}
                step={1}
                value={[parseInt(answers[currentStep] as string) || 1]}
                onValueChange={(value) => handleAnswer(value[0].toString())}
              />
              <div className="flex justify-between">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <span key={num} className="text-sm">
                    {num}
                  </span>
                ))}
              </div>
            </div>
          ) : currentStep === 1 ? (
            <div className="space-y-2">
              {currentQuestion.options.map((option: any, index: any) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`option-${index}`}
                    checked={
                      Array.isArray(answers[currentStep]) &&
                      answers[currentStep].includes(option)
                    }
                    onCheckedChange={(checked) => {
                      const newAnswer = Array.isArray(answers[currentStep])
                        ? [...answers[currentStep]]
                        : [];
                      if (checked) {
                        newAnswer.push(option);
                      } else {
                        const index = newAnswer.indexOf(option);
                        if (index > -1) {
                          newAnswer.splice(index, 1);
                        }
                      }
                      handleAnswer(newAnswer);
                    }}
                  />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
              {currentStep === 1 &&
                Array.isArray(answers[currentStep]) &&
                answers[currentStep].includes("Other") && (
                  <Input
                    className="mt-2"
                    placeholder="Please specify"
                    value={otherInputs[currentStep] || ""}
                    onChange={(e) => handleOtherInput(e.target.value)}
                  />
                )}
            </div>
          ) : (
            <RadioGroup
              value={answers[currentStep] as string}
              onValueChange={handleAnswer}
            >
              {currentQuestion.options.map((option: any, index: any) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}
          {answers[currentStep] === "Other" &&
            currentStep !== 1 &&
            currentStep !== 4 && (
              <Input
                className="mt-2"
                placeholder="Please specify"
                value={otherInputs[currentStep] || ""}
                onChange={(e) => handleOtherInput(e.target.value)}
              />
            )}
        </div>
        <div className="flex justify-between">
          <Button onClick={handlePrevious} disabled={currentStep === 0}>
            {t.previous}
          </Button>
          {currentStep === t.steps.length - 1 ? (
            <Button onClick={handleSubmit}>{t.submit}</Button>
          ) : (
            <Button onClick={handleNext}>{t.next}</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
