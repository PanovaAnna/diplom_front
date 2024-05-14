import {useContext, useEffect} from "react";
import {TelegramContext} from "@/components/providers/TelegramProvider";
import {SvgSprite} from "@/components/ui/SvgSprite/SvgSprite";
import {useQuery} from "react-query";
import {userService} from "@/components/sevices/UserService";
import {Loader} from "@/components/ui/Loader/Loader";
import Link from "next/link";
import {useRouter} from "next/navigation";

const Profile = () => {

    const {tg} = useContext(TelegramContext)
    const { data, isLoading, isError } = useQuery("user", () =>  userService.getUserInfo(tg?.initDataUnsafe.user?.id as number))
    const router = useRouter()

    useEffect(() => {
        tg?.BackButton.show()
        tg?.BackButton.onClick(() => {
            router.replace("/")
        })
    },[])

    if (isLoading) return (
        <Loader/>
    )

    if (!data) return (
        <>
            Данные по неизвестной причине отсутствуют
        </>
    )

    return (
        <main className={"p-4"}>
            <h2 className={"text-[40px] mb-8"}>Профиль</h2>
            <header className={"flex gap-10 mb-8"}>
                <img className={"rounded-[50%] h-24"}
                     src={"https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg&ga=GA1.1.1412446893.1704931200&semt=ais"}
                     alt=""/>
                <div>
                    <h4 className={"text-[24px] mb-3"}>{tg?.initDataUnsafe.user?.first_name}</h4>
                    <div className={"flex items-center"}>
                        <div className={"flex gap-2 items-center"}>
                            <SvgSprite id={"bonus"} width={24} height={24}/>
                            <p>{data.bonuses}</p>
                        </div>
                        <div className={"flex gap-2 ml-[50px] items-center"}>
                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
                                 xmlnsXlink="http://www.w3.org/1999/xlink"
                                 width="18" height="18" x="0" y="0" viewBox="0 0 409.603 409.603"
                                 className="">
                                <g>
                                    <path
                                        d="M375.468.002h-141.87c-9.385 0-22.502 5.437-29.133 12.063L9.961 206.568c-13.281 13.266-13.281 35.016 0 48.266l144.824 144.819c13.251 13.266 34.98 13.266 48.251-.015L397.54 205.165c6.625-6.625 12.063-19.763 12.063-29.128v-141.9c0-18.77-15.366-34.135-34.135-34.135zm-68.271 136.535c-18.852 0-34.135-15.299-34.135-34.135 0-18.867 15.283-34.135 34.135-34.135 18.852 0 34.14 15.268 34.14 34.135.001 18.836-15.288 34.135-34.14 34.135z"
                                        fill="#FD6A7E" opacity="1">
                                    </path>
                                </g>
                            </svg>
                            <Link href={"profile/myPromo"} className={"hover:underline"}>Промокоды</Link>
                        </div>
                    </div>
                </div>
            </header>
            <div>
                <h4 className={"text-[20px] font-light mb-6"}>История заказов</h4>
                <ul>
                    {
                        data.orders.length ? data.orders.map(order =>
                            <li key={order.id}
                                className={"text-[12px] flex justify-between bg-white p-5 rounded-[10px] items-center mb-6"}>
                                <Link style={{color: "blue"}} className={"hover:underline"}
                                      href={`profile/order/${order.id}`}>#{order.id}</Link>
                                <div className={"text-center"}>
                                    <p>{order.date}</p>
                                </div>
                                <p>{order.state}</p>
                                <p>₽{order.price}</p>
                            </li>
                        ) : "Заказов нет"
                    }
                </ul>
            </div>
        </main>
    );
};

export {Profile};