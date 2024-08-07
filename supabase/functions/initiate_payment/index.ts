import { Application, Router } from "https://deno.land/x/oak@v16.1.0/mod.ts";

const app = new Application();
const router = new Router();

router.post("/", async (context) => {
    try {
        const headers = context.request.headers;
        const phoneNumber = headers.get("X-Phone-Number");
        const eventTitle = headers.get("X-Event-Title");
        const amount = headers.get("X-Amount");

        const paymentRequest = {
            payeePaymentReference: eventTitle,
            callbackUrl: `{${
                Deno.env.get("VITE_SUPABASE_URL")
            }}/rest/v1/rpc/payment_callback`,
            payerAlias: phoneNumber,
            payeeAlias: Deno.env.get("PAYEE_ALIAS"),
            amount: amount,
            currency: "SEK",
            message: `Sign-up Payment for ${eventTitle}`,
        };

        const response = await fetch(
            "https://swicpcapi.sytes.net/swish-cpcapi/api/v1/paymentrequests",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Deno.env.get("SWISH_API_KEY")}`,
                    Accept: "application/json",
                },
                body: JSON.stringify(paymentRequest),
            },
        );

        const data = await response.json();
        context.response.body = { paymentUrl: data.paymentUrl };
    } catch (error) {
        context.response.status = 500;
        context.response.body = {
            error: "Payment initiation failed",
            details: error.message,
        };
    }
});

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
