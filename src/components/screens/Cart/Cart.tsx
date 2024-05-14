import styles from "./Cart.module.scss"
import {OrderCard} from "@/components/screens/Cart/components/OrderCard/OrderCard";
import {useCart} from "@/components/hooks/useCart";
import {useCallback, useContext, useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {TelegramContext} from "@/components/providers/TelegramProvider";
import {SvgSprite} from "@/components/ui/SvgSprite/SvgSprite";
import {Range} from "@/components/screens/Cart/ui/Range/Range";
import {useQuery} from "react-query";
import {userService} from "@/components/sevices/UserService";
import {Loader} from "@/components/ui/Loader/Loader";
import {text} from "node:stream/consumers";
import {relativizeURL} from "next/dist/shared/lib/router/utils/relativize-url";

const Cart = () => {

    const {cart, setBonuses, addFromCart, removeFromCart, clear, setPromo : setPromocode, getPromo} = useCart()
    const com = useRef<HTMLTextAreaElement>(null);
    const {data, isLoading} = useQuery("bonuses",
        () => userService.getUserBonuses(tg?.initDataUnsafe.user?.id as number, cart.map(dish => dish.dish.saloon.id))
    )
    const [input, setInput] = useState<string>("0")
    const [promo, setPromo] = useState<string>("")
    const [modal, setModal] = useState<boolean>(false)
    const [bonusesAwarded, setBonusesAwarded] = useState<number>(0)

    const router = useRouter()
    const {tg} = useContext(TelegramContext)

    const clickWithBonuses = useCallback(() => {
        if (calculatePrice() < 100) {
            tg?.showAlert("Минимальная сумма заказа - 100 рублей")
            return
        }
        tg?.MainButton.offClick(clickWithBonuses)
        tg?.MainButton.hide()
        const btn = document.querySelector('#btn') as HTMLButtonElement
        btn.disabled = false
        document.querySelector("#modal")?.classList.replace("hidden", "flex")
        setModal(true)
    }, [])

    const clickWithoutBonuses = useCallback(async () => {
        if (promo) {
            tg?.MainButton.disable()
            tg?.MainButton.showProgress(true)
            const {state,msg} = await userService.usePromo(promo,tg?.initDataUnsafe.user?.id as number)
            if (state === "error") {
                tg?.showAlert(msg)
                setPromocode({promo: '', value: 0})
                tg?.MainButton.showProgress(false)
                return
            }
        }
        tg?.MainButton.offClick(clickWithoutBonuses)
        tg?.MainButton.hide()
        localStorage.setItem("comment", com.current?.value as string)
        setBonuses(+input)
        router.replace("/form")
    }, [])


    function calculatePrice() {
        let price = 0;

        for (const cartElement of cart) {
            price += cartElement.dish.price * cartElement.count
        }
         return price
    }

    function calculateBonuses() {
        if (data) {
            const {factors} = data
            let bonusesAwardedTemp = 0
            for (const cartEl of cart) {
                const factor = factors.find(factor => factor.id === cartEl.dish.saloon.id)
                bonusesAwardedTemp += cartEl.dish.price * cartEl.count * (factor?.factor as number / 100)
            }
            setBonusesAwarded(Math.ceil(bonusesAwardedTemp))
        }
    }

    useEffect(() => {

        tg?.BackButton.show()
        tg?.BackButton.onClick(() => {
            router.replace("/")
            tg?.MainButton.offClick(clickWithBonuses)
            tg?.MainButton.offClick(clickWithoutBonuses)
        })
        tg?.MainButton.hide()
        tg?.MainButton.setParams({text: "Стоимость: ₽" + calculatePrice(), color: "#FF7020"})

    }, [])

    useEffect(() => {
        if (!isLoading) {

            calculateBonuses()

            tg?.MainButton.show()
            if (data != undefined && data.bonuses > 0) tg?.MainButton.onClick(clickWithBonuses)
            else tg?.MainButton.onClick(clickWithoutBonuses)
        }

        return () => {
            tg?.MainButton.offClick(clickWithoutBonuses)
            tg?.MainButton.offClick(clickWithBonuses)
        }

    }, [isLoading])

    useEffect(() => {
        const fullPrice = calculatePrice()

        const realPrice = (fullPrice - +input) / fullPrice

        if (data) {
            const {factors} = data
            let bonusesAwardedTemp = 0
            for (const cartEl of cart) {
                const factor = factors.find(factor => factor.id === cartEl.dish.saloon.id)
                bonusesAwardedTemp += cartEl.dish.price * cartEl.count * (factor?.factor as number / 100)
            }
            setBonusesAwarded(Math.round(bonusesAwardedTemp * realPrice))
        }

    }, [input])

    if (isLoading) return (
        <Loader/>
    )

    if (data === undefined) return (
        <>Данные отсутствуют</>
    )

    if (!cart.length) {
        tg?.MainButton.hide()
        return (
            <div className={"flex flex-col justify-center items-center h-full gap-3"}>
                <SvgSprite id={"cart"} width={70} height={70}/>
                <p className={"text-2xl"}>Ваша корзина <span className={"text-[#FF7020]"}>пустая</span> :(</p>
            </div>
        )
    }

    const {bonuses} = data

    return (
        <div className={styles.cart}>
            <div className={styles.wrapper}>
                <div className={"mb-10 flex justify-between items-center px-5"}>
                    <h2 className={"text-[40px]"}>Корзина</h2>
                    <button className={""} onClick={() => {
                        clear()
                        setModal(prev => !prev)
                        setInput('0')
                    }}><SvgSprite id={"trash"} width={36} height={36}/></button>
                </div>
                <ul className={"px-3"}>
                    {
                        cart.map(order =>
                            order.count ? <OrderCard calculateBonuses={calculateBonuses} calculatePrice={calculatePrice} key={`${order.dish}${order.count}`}
                                                     order={order} addFromCart={addFromCart}
                                                     removeFromCart={removeFromCart}/> : null
                        )
                    }
                </ul>
                <div className={"flex shadow"}>
                    <div className={"px-3 py-3.5 bg-[#FF7020] flex items-center flex-grow"}>
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink"
                             width="24" height="24" x="0" y="0" viewBox="0 0 409.603 409.603"
                             className="">
                            <g>
                                <path
                                    d="M375.468.002h-141.87c-9.385 0-22.502 5.437-29.133 12.063L9.961 206.568c-13.281 13.266-13.281 35.016 0 48.266l144.824 144.819c13.251 13.266 34.98 13.266 48.251-.015L397.54 205.165c6.625-6.625 12.063-19.763 12.063-29.128v-141.9c0-18.77-15.366-34.135-34.135-34.135zm-68.271 136.535c-18.852 0-34.135-15.299-34.135-34.135 0-18.867 15.283-34.135 34.135-34.135 18.852 0 34.14 15.268 34.14 34.135.001 18.836-15.288 34.135-34.14 34.135z"
                                    fill="white" opacity="1">
                                </path>
                            </g>
                        </svg>
                        <input value={promo} onInput={(e) => setPromo(e.currentTarget.value)}
                               className={"ml-4 placeholder-white text-[14px] text-white flex-grow"} type="text"
                               placeholder={"Промокод..."}/>
                    </div>
                    <button id={"promocodeApply"} className={"text-[14px] bg-white text-center w-[95px]"}
                            onClick={async (event) => {
                                if (promo) {
                                    const loader = document.querySelector("#loader") as HTMLSpanElement
                                    const text = event.currentTarget.querySelector("#apply") as HTMLSpanElement
                                    loader.classList.remove("hidden")
                                    text.classList.add("hidden")
                                    const {state, msg} = await userService.checkPromo(promo, tg?.initDataUnsafe.user?.id as number)
                                    if (state === "error") {
                                        tg?.showAlert(msg)
                                        loader.classList.add("hidden")
                                        text.classList.remove("hidden")
                                        return
                                    }
                                    setPromocode({promo: promo, value: msg as number})
                                    loader.classList.add("hidden")
                                    text.classList.remove("hidden")
                                    document.querySelector("#promocodeApply")?.classList.add("hidden")
                                    document.querySelector("#promocodeCancel")?.classList.remove("hidden")
                                    tg?.showAlert("Промокод успешно использован!")
                                    tg?.MainButton.setText("Стоимость: ₽" + (calculatePrice() - Math.ceil(calculatePrice() * +msg / 100)))
                                }
                            }}>
                        <div id={'loader'} className={"hidden h-[24px]"}><Loader/></div>
                        <span id={"apply"}>Применить</span>
                    </button>
                    <button id={"promocodeCancel"} className={"text-[14px] bg-white text-center w-[95px] hidden"}
                            onClick={async (event) => {
                                document.querySelector("#promocodeApply")?.classList.remove("hidden")
                                event.currentTarget.classList.add("hidden")
                                tg?.showAlert("Промокод отменён")
                                setPromocode({promo: '', value: 0})
                                tg?.MainButton.setText("Стоимость: ₽" + calculatePrice())
                            }}>
                        <span>Отменить</span>
                    </button>
                </div>
                <textarea placeholder='Комментарий к заказу...' ref={com} className={styles.textArea}></textarea>
            </div>
            <div id={'modal'} className={"absolute hidden justify-center items-center inset-0 bg-black bg-opacity-50"}>
                <div className={"bg-white relative w-[90%] rounded-xl p-8 pt-12"}>
                    <button
                        className={"absolute right-[8px] top-[8px] transform hover:scale-110"}
                        onClick={() => {
                            if (data != undefined && data.bonuses > 0) tg?.MainButton.onClick(clickWithBonuses)
                            else tg?.MainButton.onClick(clickWithoutBonuses)
                            tg?.MainButton.show()
                            document.querySelector("#modal")?.classList.replace("flex", "hidden")
                            setModal(false)
                            setInput("0")
                        }}
                    >
                        <SvgSprite id={"cross"} width={24} height={24}/>
                    </button>
                    <div className={"flex justify-between mb-8"}>
                        <h4 className={"text-[20px] font-semibold"}>Оплата бонусами</h4>
                        <div className={"flex items-center"}>
                            <SvgSprite id={"bonus"} width={24} height={24}/>
                            <p>{bonuses}</p>
                        </div>
                    </div>
                    <Range bonuses={bonuses > calculatePrice() ? calculatePrice() - 100 : bonuses} input={input}
                           setInput={setInput}/>
                    <p className={"font-semibold mb-3"}>Начислится бонусов: {bonusesAwarded}</p>
                    <button
                        id={'btn'}
                        className={"flex font-semibold justify-center w-full bg-[#FF7020] text-white py-1.5 rounded-xl"}
                        onClick={async (event) => {
                            if (promo) {
                                event.currentTarget.disabled = true
                                const {state,msg} = await userService.usePromo(promo,tg?.initDataUnsafe.user?.id as number)
                                if (state === "error") {
                                    tg?.showAlert(msg)
                                    setPromocode({promo: '', value: 0})
                                    return
                                }
                            }

                            router.replace("/form")
                            localStorage.setItem("comment", com.current?.value as string)
                            setBonuses(+input)
                        }}
                    >
                        Оплатить {(calculatePrice() - +input) - Math.ceil((getPromo().value ? getPromo().value / 100 * (calculatePrice() - +input) : 0))}₽
                    </button>
                </div>
            </div>
        </div>
    );
};

export {Cart};