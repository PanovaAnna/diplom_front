import {useCallback, useContext, useEffect, useState} from "react";
import {TelegramContext} from "@/components/providers/TelegramProvider";
import {useRouter} from "next/navigation";
import Link from "next/link";
import styles from "./styles.module.scss"
import {useQuery} from "react-query";
import {userService} from "@/components/sevices/UserService";
import {Loader} from "@/components/ui/Loader/Loader";
import {SvgSprite} from "@/components/ui/SvgSprite/SvgSprite";

const AdminOrders = () => {
    const {tg} = useContext(TelegramContext)
    const {data, isLoading} = useQuery("orders", async () => await getOrders())
    const [search, setSearch] = useState<string>("")
    const [orders, setOrders] = useState<{
        id: number,
            date: string,
            state : string,
            price : number,
            isPaid : boolean
    }[]>([])

    const router = useRouter()

    const backClick = useCallback(() => {
        router.back()
        tg?.BackButton.offClick(backClick)
    }, [])

    useEffect(() => {
        tg?.MainButton.hide()
        tg?.BackButton.show()
        tg?.BackButton.onClick(backClick)
    }, [])

    useEffect(() => {
        if (!data) return

        setOrders(data.orders.filter(order => {

            if (!search) return true

            return order.id.toString().includes(search) || order.date.includes(search) || order.state.includes(search) || order.price.toString().includes(search)
        }))
    }, [search])

    if (isLoading) return <Loader/>

    if (!data) return <>Данные отсутствуют по неизвестной причине(</>

    async function getOrders() {
        return await userService.getOrders().then((res) => {
            setOrders(res.orders)
            return res
        })
    }

    function byField(fieldName : string, custom : number){
        return custom === 1 ? (a : any, b : any) => a[fieldName] > b[fieldName] ? 1 : -1 : (a : any, b : any) => a[fieldName] > b[fieldName] ? -1 : 1;
    }

    function sort(e : any, field : string) {
        const svgSprite = e.currentTarget.querySelector("svg") as SVGSVGElement;
        if (svgSprite.classList.contains("hidden")) svgSprite.classList.remove("hidden")

        if (svgSprite.classList.contains("up")) {
            svgSprite.classList.replace("up", "bottom")
            setOrders([...orders].sort(byField(field, 1)))
        }
        else if (svgSprite.classList.contains("bottom")){
            svgSprite.classList.replace("bottom", "up")
            setOrders([...orders].sort(byField(field, -1)))
        }
    }

    return (
        <main className={"p-4"}>
            <h2 className={"text-[40px] mb-8"}>Заказы пользователей</h2>
            <header className={"mb-7 p-2 rounded-[5px]"}>
                <input type="text" placeholder={"Поиск..."} value={search} onInput={(event) => setSearch(event.currentTarget.value)}/>
            </header>
            <div>
                <ul>
                    <div className={styles.orderHeader}>
                        <div className={"flex gap-1 cursor-pointer select-none"} onClick={(e) => sort(e,"id")}><span>Id</span> <SvgSprite id={'arrow'} width={14} height={14} classname={"hidden up"}/>
                        </div>
                        <div className={"flex gap-1 cursor-pointer select-none"} onClick={(e) => sort(e,"date")}><span>Дата заказа</span> <SvgSprite id={'arrow'} width={14} height={14} classname={"hidden up"}/>
                        </div>
                        <div className={"flex gap-1 cursor-pointer select-none"} onClick={(e) => sort(e,"state")}><span>Статус</span> <SvgSprite id={'arrow'} width={14} height={14} classname={"hidden up"}/>
                        </div>
                        <div className={"flex gap-1 cursor-pointer select-none"} onClick={(e) => sort(e,"price")}><span>Цена</span> <SvgSprite id={'arrow'} width={14} height={14} classname={"hidden up"}/>
                        </div>
                    </div>
                    {
                        orders.map(order =>
                            <li key={order.id} className={styles.orderItem}>
                            <Link style={{color: "blue"}} className={"hover:underline"}
                                      href={`/profile/order/${order.id}`}>#{order.id}</Link>
                                <div className={"text-center"}>
                                    <p>{order.date}</p>
                                </div>
                                <select className={"text-center"} defaultValue={order.state} onInput={(e) => {
                                    userService.updateOrder(e.currentTarget.value, order.id)
                                    order.state = e.currentTarget.value
                                }}>
                                    {
                                        data.states.map(state =>
                                            <option value={state}>{state}</option>
                                        )
                                    }
                                </select>
                                <p>₽{order.price}</p>
                            </li>
                        )
                    }
                </ul>
            </div>
        </main>
    );
};

export {AdminOrders};