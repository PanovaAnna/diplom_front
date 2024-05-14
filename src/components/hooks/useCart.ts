import {Dish} from "@/components/types/Dish";

export type DishCart = Dish & { saloon: { id: number, name: string } }

let local = null

if (typeof window !== 'undefined') {
    local = localStorage?.getItem("cart")
}

let cart: { dish: DishCart, count: number }[] = local ? JSON.parse(local) : []
let bonuses = 0;
let promocode : {promo: string, value: number} = {promo: "", value: 0}

export function useCart() {

    function clear() {
        cart = []
        localStorage.removeItem("cart")
    }

    function addFromCart(dish: Dish, saloonId: number, saloonName: string) {

        const currentOrder = cart.find(order => order.dish.id === dish.id)

        if (currentOrder) {
            currentOrder.count++
            localStorage?.setItem("cart", JSON.stringify(cart))
            return currentOrder.count
        } else {
            cart.push({
                dish: {
                    ...dish,
                    saloon: {
                        id: saloonId,
                        name: saloonName
                    }
                },
                count: 1
            })
            localStorage?.setItem("cart", JSON.stringify(cart))
            return 1
        }
    }

    function removeFromCart(dish: Dish) {
        const currentOrder = cart.find(order => order.dish.id === dish.id)

        if (currentOrder) currentOrder.count--
        else return

        if (currentOrder.count === 0) {
            cart.splice(cart.indexOf(currentOrder), 1)
            if (!cart.length) localStorage.removeItem("cart")
            return 0;
        }

        localStorage?.setItem("cart", JSON.stringify(cart))
        return currentOrder.count
    }

    function setBonuses(value : number) {
        bonuses = value
    }

    function getBonuses() {return bonuses}

    function setPromo(promo : {promo: string, value: number}) {
        promocode = promo
    }

    function getPromo() {
        return promocode
    }

    return {
        cart,
        addFromCart,
        removeFromCart,
        clear,
        setBonuses,
        getBonuses,
        setPromo,
        getPromo
    }
}