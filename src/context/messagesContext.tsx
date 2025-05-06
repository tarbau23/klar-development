"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

const MessageContext = createContext<any>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<any>([]);

  const addTextMessage = (text: string, role: "assistant" | "user") => {
  
    const newMessage: any = {
      role: role,
      content: [
        {
          type: "text",
          text,
        },
      ],
    };
  
    // Functional state update ensures consistent results
    let newState : any;
    // newState.push(newMessage);

    setMessages((prevMessages: any[]) => {
      newState = [...prevMessages, newMessage]; // Compute the new state here
      return newState; // Update the state with the new state
    });
    return newState; // Return the calculated new state
  };
  

  const addImageMessage = async (url: string, text: string) => {
    const newMessage: any = {
      role: "user",
      content: [
        {
          type: "text",
          text: text,
        },
        {
          type: "image_url",
          image_url: {
            // url: `data:image/jpeg;base64,${base64Image}`,
            url: `${url}`,
          },
        },
      ],
    };
    let m;
    await setMessages((prevMessages: any) => {
      const updatedMessages = [...prevMessages, newMessage];
      m = updatedMessages;
      return updatedMessages;
    });

    console.log("Added Image");
    return m;
  };

  const addPDFMessage = async (imageUrls: any, text: string) => {
    let content: any = [
      {
        type: "text",
        text: text,
      },
    ];

    imageUrls.forEach((element: any) => {
      content.push({
        type: "image_url",
        image_url: {
          url: `${element}`,
        },
      });
    });

    const newMessage: any = {
      role: "user",
      content: content,
    };
    let m;
    await setMessages((prevMessages: any) => {
      const updatedMessages = [...prevMessages, newMessage];
      m = updatedMessages;
      return updatedMessages;
    });

    console.log("Added PDF");
    // console.log(newMessage);

    return m;
  };

  const discardMessages = () => {
    setMessages([]);
  };

  const getMessages = () =>{
    console.log(messages)
    return messages
  }

  return (
    <MessageContext.Provider
      value={{
        messages,
        addTextMessage,
        addImageMessage,
        addPDFMessage,
        discardMessages,
        getMessages
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessageContext must be used within a MessageProvider");
  }
  return context;
};
