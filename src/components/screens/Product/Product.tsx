import React, {useCallback, useContext, useEffect, useState} from 'react';
import styles from "./Product.module.scss"
import {useQuery} from "react-query";
import {useParams, useRouter} from "next/navigation";
import {saloonService} from "@/components/sevices/SaloonService";
import {useCart} from "@/components/hooks/useCart";
import {Dish} from "@/components/types/Dish";
import {TelegramContext} from "@/components/providers/TelegramProvider";
import {Loader} from "@/components/ui/Loader/Loader";

const Product = () => {

    const saloonId = useParams().saloon
    const productId = useParams().product
    const {data, isLoading} = useQuery("saloon"+saloonId, () => saloonService.getOne(saloonId as string))

    const {cart, addFromCart, removeFromCart} = useCart()
    const amountInCart = cart.find(value => value.dish.id === Number(productId))
    const [counter, setCounter] = useState<number>(!amountInCart ? 0 : amountInCart.count)

    const {tg} = useContext(TelegramContext)
    const router = useRouter()

    const click = useCallback(() => {
        router.replace("/cart")
        tg?.MainButton.offClick(click)
    }, [])

    useEffect(() => {

        tg?.BackButton.show()
        tg?.BackButton.onClick(() => {
            router.replace(`/saloon/${saloonId}`)
            tg?.MainButton.offClick(click)
        })

        if (cart.length && tg) {
            tg.MainButton.setParams({text: "Корзина", color: "#FF7020"})
            tg.MainButton.show()
            tg.MainButton.onClick(click)
        }

    },[])

    if (isLoading) return <Loader/>

    if (!data) return <>Данные по какой-то неизвестной причине отсутствуют(</>

    const dish = data?.dishes.find(dish => dish.id === +productId)

    if (!dish) return <>Такого продукта не существует!</>

    function counterClick(value : number) {
        setCounter(prev => prev === 0 && value === -1 ? 0 : prev + value)
        if (value == 1) {
            addFromCart(dish as Dish, +saloonId, data?.saloon.name as string)
            if (!tg?.MainButton.isVisible) tg?.MainButton.show()
        }
        else {
            removeFromCart(dish as Dish)
            if (!cart.length) tg?.MainButton.hide()

        }
    }

    return (
        <main>
            <header>
                <img className={"h-[250px] object-cover w-full"} src={dish.image} alt=""/>
            </header>
            <div className={"py-5 px-4 rounded-t-2xl transform -translate-y-3 bg-[#f9f9f9]"}>
                <h3 className={"text-2xl font-semibold"}>{dish.name}</h3>
                <span className={"text-[#B1B1B1] mb-4 block"}>{dish.weight}г</span>
                <div className={"flex justify-between mb-6"}>
                    <div className={styles.counter}>
                        <button className={styles.minus} onClick={() => counterClick(-1)}>—</button>
                        <p className={styles.count}>{counter}</p>
                        <button className={styles.plus} onClick={() => counterClick(1)}>+</button>
                    </div>
                    <p className={"text-[18px] font-semibold"}>{dish.price} ₽</p>
                </div>
                <h4 className={"font-semibold text-[18px] mb-4"}>Описание</h4>
                <p className={"text-[14px]"}>{dish.description}</p>
            </div>
        </main>
    );
};

export default Product;