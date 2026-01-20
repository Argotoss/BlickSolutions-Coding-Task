import { app } from "./app";

const portValue = Number(process.env.PORT ?? 3001);
const port = Number.isNaN(portValue) ? 3001 : portValue;

app.listen(port, () => {
  process.stdout.write(`Server listening on port ${port}\n`);
});
