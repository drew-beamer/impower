import { EventSelect } from "@/components/ui/select";
import { Button } from "@/components/ui/styledButtons";
import { getEvents } from "@/lib/mongo/events";
import { EventOption } from "@/lib/types/event";
import Link from "next/link";


export const metadata = {
    title: "Events | IMPOWER",
    description: "Explore and analyze any FRC competition this season from an outreach award perspective.",
    openGraph: {
        title: "Events | IMPOWER",
        description: "Explore and analyze any FRC competition this season from an outreach award perspective.",
        url: "https://impower.drewbeamer.io/events",
        site_name: "IMPOWER",
        locale: "en_US",
        type: "website",
        images: [
            {
                url: "https://impower.drewbeamer.io/images/og.png",
                width: 1200,
                height: 630,
            }],

    }
}


export default async function EventsPage() {

    var today = new Date();
    var future = new Date()
    future.setDate(future.getDate() + 7);


    const todayString = today.getFullYear() + "-" + (today.getMonth() + 1 < 10 ? "0" + (today.getMonth() + 1) : today.getMonth() + 1) + "-" + (today.getDate() + 1 < 10 ? "0" + (today.getDate()) : today.getDate());
    const futureString = future.getFullYear() + "-" + (future.getMonth() + 1 < 10 ? "0" + (future.getMonth() + 1) : future.getMonth() + 1) + "-" + (future.getDate() + 1 < 10 ? "0" + (future.getDate()) : future.getDate());


    const eventData = await getEvents({ fields: ["end_date", "week", "awards", "projections"] });

    const thisWeekEvents = eventData?.filter((event) => {
        if (event.end_date !== undefined) {
            return event.end_date >= todayString && event.end_date < futureString;
        }
        return false
    })

    return <div className="pt-12 flex justify-center flex-wrap w-full mb-24">
        <div className="max-w-[800px] w-full">
            <section className="w-full text-left">
                <h2 className="w-full overflow-x-auto">This Week</h2>
                <div className="whitespace-nowrap overflow-x-scroll space-x-6 my-6 align-top">
                    {thisWeekEvents.map((event) => {
                        return <div key={event.key} className="w-72 h-72 relative p-8 mx-6 mb-10 bg-stone-100 shadow-xl text-stone-900 rounded-2xl inline-block whitespace-normal align-top">
                            <div>
                                <h3 className="font-bold">{event.name}</h3>
                                <h4 className="font-normal mt-2">Week {event.week !== undefined ? event.week : null}</h4>

                            </div>
                            <Link href={`/events/${event.key}`}>
                                <Button filled className="absolute bottom-8 text-regular px-2 py-2">View Event</Button>
                            </Link>
                        </div>
                    })}</div>
            </section>
            <section className="w-full relative text-left flex flex-wrap items-center">
                <h2 className="grow">All Events</h2>
                <div className="w-72 py-2">
                    <EventSelect events={eventData.map((event) => {
                        return {
                            value: event.key,
                            label: event.name
                        } as EventOption
                    })} />
                </div>

                <table className="w-full text-sm text-left px-6">
                    <thead className="text-xs uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Week</th>
                            <th scope="col" className="px-6 py-3">Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {eventData.map((event) => {
                            return <tr key={event.key} className="border-b">
                                <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">{event.week? event.week : "CMP"}</th>
                                <td className="px-6 py-4"><Link href={`/events/${event.key}`}>{event.name}</Link></td>
                            </tr>
                        })}
                    </tbody>
                </table>

            </section>
        </div>

    </div>
}