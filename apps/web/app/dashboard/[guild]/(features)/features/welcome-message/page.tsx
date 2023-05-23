import { UpdateForm } from "./form";
import { prisma } from "@/utils/prisma";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import { ChannelTypes, fetchGuildChannels } from "@/utils/discord";
import { z } from "zod";

const schema = z.object({
    channel: z.string().optional(),
    message: z.string(),
});

export type Data = z.infer<typeof schema>;

export default async function WelcomeMessage({
    params: { guild },
}: {
    params: { guild: string };
}) {
    const feature = await prisma.welcomeFeature.findUnique({
        where: {
            guild_id: guild,
        },
    });

    async function enable() {
        "use server";

        await prisma.welcomeFeature.create({
            data: {
                guild_id: guild,
            },
        });
        revalidatePath(`/dashboard/${guild}/features/welcome-message`);
    }

    async function disable() {
        "use server";

        await prisma.welcomeFeature.deleteMany({
            where: {
                guild_id: guild,
            },
        });
        revalidatePath(`/dashboard/${guild}/features/welcome-message`);
    }

    async function handleSubmit(raw: Data) {
        "use server";
        const data = schema.parse(raw);

        await prisma.welcomeFeature.updateMany({
            data: {
                message: data.message,
                channel_id: data.channel,
            },
            where: {
                guild_id: guild,
            },
        });

        revalidatePath(`/dashboard/${guild}/features/welcome-message`);
    }

    if (feature == null) {
        return (
            <form
                className="flex flex-col gap-4 items-center justify-center text-center w-full h-full bg-secondary text-secondary-foreground p-4 rounded-lg border-[1px]"
                action={enable}
            >
                <h2 className="font-semibold text-lg">
                    Enable Welcome Message
                </h2>
                <Button>Enable</Button>
            </form>
        );
    }

    let channels = await fetchGuildChannels(
        process.env.DISCORD_BOT_TOKEN!,
        guild
    );

    //only text channels
    channels = channels
        .filter((c) => [ChannelTypes.GUILD_TEXT].includes(c.type))
        .map((c) => ({ id: c.id, name: c.name, type: c.type }));

    return (
        <>
            <h1 className="text-2xl font-bold">Welcome Message</h1>
            <p className="text-muted-foreground text-sm">
                Send a new message when someone joined the server
            </p>
            <form action={disable}>
                <Button variant="destructive" size="sm" className="px-6">
                    Disable
                </Button>
            </form>
            <UpdateForm
                feature={feature}
                channels={channels}
                submit={handleSubmit}
            />
        </>
    );
}