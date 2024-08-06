import { Application, Router } from "https://deno.land/x/oak@v10.5.1/mod.ts";

const app = new Application();
const router = new Router();

const SUPABASE_URL = "https://zqnoqrullziicwrunhwx.supabase.co";
const SUPABASE_KEY = "YOUR_SUPABASE_SERVICE_ROLE_KEY";

// Helper function to update the payment confirmation
async function updatePaymentConfirmation(eventId: string, playerId: string) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/event_player`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "apikey": SUPABASE_KEY,
        },
        body: JSON.stringify({
            payment_confirmation: true,
            event_id: eventId,
            player_id: playerId,
        }),
    });

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
