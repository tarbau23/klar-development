'use client'

import notification from "../../public/notification/notification.json";

const getNotification = (lang : any) =>{

    const noty : any = notification;
    return noty[lang];

}

export default getNotification;