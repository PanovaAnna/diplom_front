'use client'
import Link from "next/link";
import {useContext, useEffect} from "react";
import {TelegramContext} from "@/components/providers/TelegramProvider";

const AdminPage = () => {
    const {tg} = useContext(TelegramContext)

    useEffect(() => {
        tg?.MainButton.hide()
        tg?.BackButton.hide()
    }, [])

    return (
        <>
            <div className={"p-8 flex flex-col justify-center items-center h-full"}>
                <h2 className={"text-center text-2xl font-semibold mb-8"}>Что вы желаете сделать?</h2>
                <div className={'flex gap-3 justify-center text-white text-center'}>
                    <Link
                        href={"admin/cmm"}
                        className={"w-[140px] bg-[#FF5A30] p-2 rounded-[5px] transform hover:scale-[1.05] transition-all duration-500"}>
                        Рассылка
                    </Link>
                    <Link
                        href={"admin/orders"}
                        className={"w-[140px] bg-[#FF5A30] p-2 rounded-[5px] transform hover:scale-[1.05] transition-all duration-500"}>
                        Заказы
                    </Link>
                </div>
            </div>
        </>
    )
}

export default AdminPage