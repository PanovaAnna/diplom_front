import styles from "./Main.module.scss";
import {SvgSprite} from "@/components/ui/SvgSprite/SvgSprite";
import {saloonService} from "@/components/sevices/SaloonService";
import {useQuery} from "react-query";
import Link from "next/link";
import {useCallback, useContext, useEffect, useState} from "react";
import {useCart} from "@/components/hooks/useCart";
import {useRouter} from "next/navigation";
import {TelegramContext} from "@/components/providers/TelegramProvider";
import {Loader} from "@/components/ui/Loader/Loader";

const Main = () => {

    const {data, isLoading, isError, error} = useQuery("saloons", saloonService.getAll)
    const [categoryState, setCategory] = useState<string>("")
    const [search, setSearch] = useState<string>("")
    const {cart} = useCart()
    const {tg} = useContext(TelegramContext)
    const router = useRouter()

    const click = useCallback( () => {
        tg?.MainButton.offClick(click)
        router.replace("/cart")
    }, [])

    useEffect(() => {
        tg?.BackButton.hide()

        if (cart.length && tg) {
            tg.MainButton.setParams({text: "Корзина", color: "#FF7020"})
            tg.MainButton.show()
            tg.MainButton.onClick(click)
        }
    }, [])

    if (isLoading) return <Loader/>

    if (!data) return <>Данные по какой-то неизвестной причине отсутствуют(</>

    function categoryClick(category: string) {
        setCategory(category)
    }

    const saloons = data.saloons.filter(saloon => {
        const checkCategory = !categoryState || saloon.categories.includes(categoryState)

        return search === '' ? checkCategory : checkCategory && saloon.name.toLowerCase().includes(search.toLowerCase())
    })


    return (
        <>
            <header className={styles.header}>
                <div className={styles.searchWrapper}>
                    <SvgSprite id={"loupe"} width={20} height={20}/>
                    <input
                        type="text"
                        className={styles.searchInput}
                        value={search}
                        onInput={(event) => {
                            setSearch(event.currentTarget.value)
                        }}
                        placeholder='Искать...'/>
                </div>
                <div className={" w-[32px] h-[32px]"}>
                    <Link href={"profile"}>
                        <img className={"rounded-[50%] w-full h-full object-cover"}
                             src={"https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=338&ext=jpg&ga=GA1.1.1412446893.1704931200&semt=ais"} alt=""/>
                    </Link>
                </div>
            </header>
            <nav className="mb-2">
                <ul className={styles.navList}>
                    <li>
                        <button className={`${styles.navItemAll} ${categoryState === "" ? styles.active : ""}`}
                                type="button" onClick={() => categoryClick("")}>
                        <p>Все</p>
                        </button>
                    </li>
                    {
                        data.categories.map(category =>
                            <li key={category.name}>
                                <button
                                    className={`${styles.navItem} ${category.name === categoryState ? styles.active : ""}`}
                                    type="button" onClick={(event) => {
                                        categoryClick(category.name)
                                        event.currentTarget.querySelector("video")?.play()
                                    }}>
                                    {
                                        category.image.endsWith(".mp4") ?
                                            <video width="32" height="32" autoPlay preload={"auto"} muted={true} className={"mb-auto"}>
                                                <source src={category.image} type="video/mp4"/>
                                            </video> :

                                            <img src={category.image} alt={category.name} className={'w-8 mb-auto'}/>

                                    }
                                    <p>{category.name}</p>
                                </button>
                            </li>
                        )
                    }
                </ul>
            </nav>
            <main className={styles.main}>
                <h2 className={"font-semibold text-3xl mb-4"}>Рестораны</h2>
                <ul className="flex flex-col gap-7">
                    {
                        saloons.map(saloon =>

                            <li className={styles.saloon} key={saloon.id + saloon.name}>
                                <Link className={"mb-2.5 h-48"} href={`saloon/${saloon.id}`}>
                                    <img src={saloon.image} alt={saloon.name}/>
                                </Link>
                                <Link className="font-semibold text-xl"
                                      href={`saloon/${saloon.id}`}>{saloon.name}</Link>
                                <div>
                                    <div className={"flex items-center mt-1"}>
                                        <SvgSprite id={"star"} width={20} height={20}
                                                   classname={"text-[#ED8A19]"}/>
                                        <p className={"ml-2 mr-5"}>{saloon.rating} ({saloon.rating_quantity})</p>
                                        <p>₽</p>
                                        <p className={saloon.price === 1 || saloon.price === 1 ? "font-light text-[#B1B1B1]" : ""}>₽</p>
                                        <p className={saloon.price <= 2 ? "font-light text-[#B1B1B1]" : ""}>₽</p>
                                    </div>
                                </div>
                            </li>
                        )
                    }
                </ul>
            </main>
        </>
    );
};

export {Main};