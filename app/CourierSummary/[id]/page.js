"use client"

import React, { useEffect, useState } from 'react'
import CourierSummary from '@/components/CourierSummary/index'
import { fetchDocById } from "@/api/firebase/functions/fetch";
import { usePathname } from 'next/navigation';

export default function Page() {
    const pathname = usePathname();
    const [invoice, setInvoice] = useState(null);

    useEffect(() => {
        const fetchInvoice = async () => {
            const match = pathname && pathname.match(/\/([^/]+)$/);
            const id = match && match[1];
            const data = await fetchDocById(id, "place_job");
            setInvoice(data);
        };
        fetchInvoice();
    }, [pathname]);
    return (
        <div style={{ width: '97vw' }}>
            {invoice ?
                <CourierSummary courierDetails={invoice} pdf={invoice} />
                : null}
        </div>
    )
}
