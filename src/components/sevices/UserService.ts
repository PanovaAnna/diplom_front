import {$api} from "@/components/http";

interface ResponseUser {
    name : string
    bonuses: number
    orders : {
        id: number
        date: string
        state: string
        price: number
    }[]
}

interface ResponseOrder {
    address: string,
    paymentType: string,
    surrender: number | null,
    telephone: string,
    name : string
    price: number,
    isPaid: boolean,
    bonuses: number,
    promocode: {promo: string, value: number} | null
    dishes: {
        amount: number,
        image: string,
        name: string,
        saloon: string,
        saloonId: number,
        price: number
    }[]
}

interface ResponseBonuses {
    bonuses : number,
    factors: {
        id: number,
        factor: number
    }[]
}

interface ResponseOrders {
    states : string[],
    orders : {
        id: number,
        date: string,
        state : string,
        price : number,
        isPaid : boolean
    }[]
}

class UserService {

    async getUserInfo(id : number) {
        const res = await $api.get<ResponseUser>(`users/get/${id}`)
        return res.data
    }

    async getUserBonuses(id : number, saloons: number[]) {
        const res = await $api.post<ResponseBonuses>(`users/bonuses/${id}`, {saloons})
        return res.data
    }

    async getOrder(id : number) {
        const res = await $api.get<ResponseOrder>(`users/order/${id}`)
        return res.data
    }

    async getOrders() {
        const res = await $api.get<ResponseOrders>("users/orders")
        return res.data
    }

    async usePromo(promo: string, id: number) {
        const res = await $api.post<{state: string, msg : string | number}>(`promo/use`, {promo,id})
        return res.data
    }

    async checkPromo(promo: string, id: number) {
        const res = await $api.post<{state: string, msg : string | number}>(`promo/check`, {promo,id})
        return res.data
    }

    async getBonusPromo(id: number) {
        const res = await $api.get<{promo: string, value: number}[]>(`users/bonusPromo/${id}`)
        return res.data
    }

    async updateOrder(state : string, id : number) {
        const res = await $api.put(`/users/order/${id}`, {state})
        return res.data
    }

    async distribution(msg : string, id : number) {
        const res = await $api.post<string>(`/users/distribution`, {msg,id})
        return res.data
    }
}

export const userService = new UserService()