import { notFound } from 'next/navigation';
import useFetchLaravelData from '@/shared/hook/useFetchData/useFetchData';
import NewsEventDetail from './NewsEventDetail';

interface INewsEventDetail {
    id: number;
    title: string;
    date: string;
    date_day: string;
    date_month: string;
    image: string | null;
    description: string | null;
}

interface INewsEventResponse {
    success: boolean;
    data: INewsEventDetail;
    message?: string;
}

export default async function NewsEventDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const res: INewsEventResponse = await useFetchLaravelData({
        url: `/news-events/${params.id}`,
    });

    if (!res?.success || !res?.data) {
        notFound();
    }

    return <NewsEventDetail data={res.data} />;
}