import {useContext, useEffect} from "react";
import {TelegramContext} from "@/components/providers/TelegramProvider";
import {useQuery} from "react-query";
import {userService} from "@/components/sevices/UserService";
import {Loader} from "@/components/ui/Loader/Loader";
import {useRouter} from "next/navigation";

const MyPromo = () => {

    const {tg} = useContext(TelegramContext)
    const {data, isLoading} = useQuery("bonusPromo", () => userService.getBonusPromo(tg?.initDataUnsafe.user?.id as number))
    const router = useRouter()

    useEffect(() => {
        const click = () => {
            router.back()
            tg?.BackButton.offClick(click)
        }

        tg?.BackButton.show()
        tg?.BackButton.onClick(click)

        return () => {
            tg?.BackButton.offClick(click)
        }
    },[])

    if (isLoading) return (
        <Loader/>
    )

    if (!data) return (
        <div className={"flex justify-center items-center h-full text-xl font-semibold p-4 text-center"}>
            У вас ещё нету бонусных промокодов (
        </div>
    )

    function copyText(event : any) {
        const copyInput = document.createElement("input")
        copyInput.type = "text"
        document.body.insertBefore(copyInput, null)
        copyInput.value = event.currentTarget.innerText
        copyInput.select()
        document.execCommand("copy")
        copyInput.remove()
        tg?.showAlert(`Промокод ${event.currentTarget.innerText} скопирован!`)
    }

    return (
        <main className={"p-4"}>
            <h2 className={"text-[40px] mb-8"}>Мои промокоды</h2>
            <ul>
                {
                    data.map(promo =>
                        <li className={"bg-[#FF7020] text-white shadow flex justify-between px-3 py-2 rounded-[5px] font-semibold mb-5"}>
                            <span onClick={copyText} className={"cursor-pointer"}>{promo.promo}</span>
                            <span>{promo.value}%</span>
                        </li>
                    )
                }
            </ul>
        </main>
    );
};

export {MyPromo};