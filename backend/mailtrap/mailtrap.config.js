import { MailtrapClient } from "mailtrap";

const TOKEN = "d7b04732eb5bf780a0af49cf47f737fe";
const ENDPOINT = "https://send.api.mailtrap.io/";

export const mailTrapclients = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

export const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Malik Hammad",
};