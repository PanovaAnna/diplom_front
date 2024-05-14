'use client'

import './globals.scss'
import {QueryClient, QueryClientProvider} from "react-query";
import Head from "next/head";
import {TelegramProvider} from "@/components/providers/TelegramProvider";


export default function RootLayout({children}: { children: React.ReactNode }) {

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false
            }
        }
    })


    return (
        <html lang="en">
        <Head>
            <title>DeliveryDubna</title>
        </Head>
        <body>
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
        <QueryClientProvider client={queryClient}>
            <TelegramProvider>
                {children}
            </TelegramProvider>
        </QueryClientProvider>
        </body>
        </html>
    )
}
