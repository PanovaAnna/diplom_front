import {FC, useContext, useState} from 'react';
import Link from "next/link";
import {DishCart} from "@/components/hooks/useCart";
import {TelegramContext} from "@/components/providers/TelegramProvider";

interface Props {
    order : {dish : DishCart, count : number},
    addFromCart : Function,
    removeFromCart : Function,
    calculatePrice: () => number,
    calculateBonuses : Function
}

const OrderCard: FC<Props> = ({order, calculateBonuses,addFromCart, removeFromCart, calculatePrice}) => {

    const [count, setCount] = useState<number>(order.count)
    const {tg} = useContext(TelegramContext)

    return (
        <li className={"flex items-start p-5 mb-6 bg-white rounded-[5px] shadow"}>
            <img src={order.dish.image} alt={order.dish.name} className={"h-[60px] w-[90px] object-contain rounded-xl"}/>
            <div className={"flex flex-col ml-3 pl-1.5"}>
                <Link href={`/saloon/${order.dish.saloon.id}/product/${order.dish.id}`}>
                    {order.dish.name} <span className={"text-[#F8A917] font-semibold"}>{order.count}x</span>
                </Link>
                <Link href={`/saloon/${order.dish.saloon.id}`}>
                    <span className={"text-[12px] text-[#B1B1B1] font-light"}>{order.dish.saloon.name}</span>
                </Link>
            </div>
            <div className={"ml-auto"}>
                <span className={"font-semibold text-center block"}>₽{order.dish.price}</span>
                <div className={"flex pt-2.5 gap-2"}>
                    <button className={"bg-[#FF7020] rounded-[5px] text-white w-6 h-6 text-center flex justify-center items-center"} onClick={() => {
                        setCount(count+1)
                        addFromCart(order.dish, order.dish.saloon.id, order.dish.saloon.name)
                        tg?.MainButton.setParams({text: "Стоимость: ₽" + calculatePrice(), color: "#FF7020"})
                        calculateBonuses()
                    }}>+</button>
                    <button className={"bg-[#FF7020] rounded-[5px] text-white w-6 h-6 text-center flex justify-center items-center"} onClick={() => {
                        setCount(count-1)
                        removeFromCart(order.dish)
                        tg?.MainButton.setParams({text: "Стоимость: ₽" + calculatePrice(), color: "#FF7020"})
                        calculateBonuses()
                    }}>-</button>
                </div>
            </div>
        </li>
    );
};

export {OrderCard};