import { Application, Router } from "https://deno.land/x/oak@v10.5.1/mod.ts";

const app = new Application();
const router = new Router();

// Helper function to update the payment confirmation
async function updatePaymentConfirmation(eventId: string, playerId: string) {
    const response = await fetch(
        `${Deno.env.get("SUPABASE_URL")}/rest/v1/event_player`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Deno.env.get("SUPABASE_KEY")}`,
                "apikey": `${Deno.env.get("SUPABASE_KEY")}`,
            },
            body: JSON.stringify({
                event_id: eventId,
                player_id: playerId,
                payment_confirmation: true,
            }),
        },
    );

    if (!response.ok) {
        throw new Error(
            `Error updating payment confirmation: ${response.statusText}`,
        );
    }

    return response.json();
}

router.post("/", async (context) => {
    try {
        const { eventId, playerId, paymentStatus } = await context.request
            .body().value;

        if (paymentStatus.status === "PAID") {
            await updatePaymentConfirmation(eventId, playerId);
        }

        context.response.status = 200;
        context.response.body = "Payment confirmation updated successfully";
    } catch (error) {
        context.response.status = 500;
        context.response.body = { error: error.message };
    }
});

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
